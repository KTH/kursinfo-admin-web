// Be aware that this entire file, or most of it, is replicated in multiple apps,
// so changes here should probably be synced to the other apps.
// See https://confluence.sys.kth.se/confluence/x/6wYJDQ for more information.

const { ugRestApiHelper } = require('@kth/ug-rest-api-helper')
const log = require('@kth/log')
const { server: serverConfig } = require('../configuration')
const { getCourseGroupName, getCourseRoundGroupName, buildEmployeesHtmlObject } = require('../utils/ugUtils')

/**
 * Initializes connection properties for the UG REST API.
 * This must be called before any UG API requests are made.
 */
function initializeUGConnection() {
  const { url, key } = serverConfig.ugRestApiURL
  const { authTokenURL, authClientId, authClientSecret } = serverConfig.ugAuth

  ugRestApiHelper.initConnectionProperties({
    authorityURL: authTokenURL,
    clientId: authClientId,
    clientSecret: authClientSecret,
    ugURL: url,
    subscriptionKey: key,
  })
}

// Initialize once at module load
initializeUGConnection()

/**
 * Fetches UG course group and round groups for a given course.
 *
 * @param {string} courseCode - The Ladok course code.
 * @param {string} semester - The semester code (e.g., '20241').
 * @param {string[]} applicationCodes - List of application codes for the course rounds.
 * @returns {Promise<Object[]>} List of UG group objects.
 */
async function fetchCourseAndRoundGroups(courseCode, semester, applicationCodes) {
  const courseGroupName = getCourseGroupName(courseCode)
  const courseRoundGroupNames = applicationCodes.map(code => `${courseGroupName}.${semester}.${code}`)

  return await ugRestApiHelper.getUGGroups('name', 'in', [courseGroupName, ...courseRoundGroupNames], false)
}

/**
 * Removes duplicate users from each role list based on their `kthid`.
 *
 * @param {Object} roles - Object with role keys (`examiners`, `teachers`, `courseCoordinators`) and arrays of user objects.
 */
function removeDuplicateUsers(roles) {
  for (const role of Object.keys(roles)) {
    const seen = new Set()

    roles[role] = roles[role].filter(user => {
      const { kthid } = user
      if (!kthid || seen.has(kthid)) return false
      seen.add(kthid)
      return true
    })
  }
}

/**
 * Fetches user details for all users in the given groups,
 * categorized by their role (examiner, teacher, or courseCoordinator).
 *
 * @param {Object[]} groups - List of group objects, each containing role arrays of KTH IDs.
 * @returns {Promise<Object>} An object mapping roles to arrays of user objects.
 */
async function fetchUsersInGroupsCategorizedByRole(groups) {
  const usersByRole = { examiners: [], teachers: [], courseCoordinators: [] }

  for (const group of groups) {
    for (const role of Object.keys(usersByRole)) {
      const kthIds = group[role]
      if (Array.isArray(kthIds)) {
        const users = await Promise.all(kthIds.map(id => ugRestApiHelper.getUGUsers('kthid', 'eq', id)))
        usersByRole[role].push(...users.flat())
      }
    }
  }

  removeDuplicateUsers(usersByRole)

  return usersByRole
}

/**
 * Fetches all UG group names in which a given user appears as a role attribute,
 * categorized by the user's role in those groups (examiner, teacher, or courseCoordinator).
 *
 * @param {string} userKthId - The user's KTH ID.
 * @returns {Promise<Object>} An object mapping roles to arrays of group names.
 */
async function fetchGroupNamesForUserCategorizedByRole(userKthId) {
  const groupNamesByRole = { examiners: [], teachers: [], courseCoordinators: [] }

  await Promise.all(
    Object.keys(groupNamesByRole).map(async role => {
      const groups = await ugRestApiHelper.getUGGroups(role, 'contains', userKthId)
      groupNamesByRole[role].push(...groups.map(group => group.name))
    })
  )

  return groupNamesByRole
}

/**
 * Checks which roles (examiner, teacher, or course coordinator) a specific user has
 * for a given course (not course round).
 *
 * @param {string} userKthId - The KTH ID of the user.
 * @param {string} courseCode - The course code (e.g., 'SF1624').
 * @returns {Promise<Object>} An object with boolean flags for each role at course level.
 */
async function getEmployeeRoleForCourse(userKthId, courseCode) {
  const groupNamesByRole = await fetchGroupNamesForUserCategorizedByRole(userKthId)
  const courseGroupName = getCourseGroupName(courseCode)

  return {
    isExaminer: groupNamesByRole.examiners.some(name => name.includes(courseGroupName)),
    isCourseTeacher: groupNamesByRole.teachers.some(name => name.includes(courseGroupName)),
    isCourseCoordinator: groupNamesByRole.courseCoordinators.some(name => name.includes(courseGroupName)),
  }
}

/**
 * Checks which roles (examiner, teacher, or course coordinator) a specific user has
 * for a given course round (semester + application code).
 *
 * @param {string} userKthId - The KTH ID of the user.
 * @param {string} courseCode - The course code (e.g., 'SF1624').
 * @param {string} semester - Semester for the course round (e.g., '20241').
 * @param {string} applicationCode - Application code for the course round (e.g., '11111').
 * @returns {Promise<Object>} An object with boolean flags for each role at course round level.
 */
async function getEmployeeRoleForCourseRound(userKthId, courseCode, semester, applicationCode) {
  const groupNamesByRole = await fetchGroupNamesForUserCategorizedByRole(userKthId)
  const courseGroupName = getCourseGroupName(courseCode)
  const courseRoundGroupName = getCourseRoundGroupName(courseCode, semester, applicationCode)

  return {
    isExaminer: groupNamesByRole.examiners.some(name => name.includes(courseGroupName)), // Always checked on the course version level
    isCourseTeacher: groupNamesByRole.teachers.some(name => name.includes(courseRoundGroupName)), // Checked on the course round level
    isCourseCoordinator: groupNamesByRole.courseCoordinators?.some(name => name.includes(courseRoundGroupName)), // Checked on the course round level
  }
}

/**
 * Fetches the examiners, teachers, and course coordinators for a given course
 * and returns them formatted as an object suitable for rendering in HTML.
 *
 * @param {Object} params
 * @param {string} params.courseCode - The course code (e.g., 'SF1624').
 * @param {string} params.semester - The semester (e.g., '20241').
 * @param {string[]} params.applicationCodes - List of application codes for course rounds.
 * @returns {Promise<Object>} Object containing categorized user data ready for HTML rendering.
 */
async function getCourseEmployees({ courseCode, semester, applicationCodes }) {
  try {
    const groups = await fetchCourseAndRoundGroups(courseCode, semester, applicationCodes)
    const usersByRole = await fetchUsersInGroupsCategorizedByRole(groups)
    return buildEmployeesHtmlObject(usersByRole.examiners, usersByRole.teachers, usersByRole.courseCoordinators)
  } catch (err) {
    log.info('Error in getCourseEmployees', { error: err })
    throw err
  }
}

/**
 * Determines whether a user has access rights for a specific course round.
 *
 * @param {Object} user - The user object containing role flags and identifiers.
 * @param {string} courseCode - The course code related to the course round.
 * @param {string} semester - The semester code to check (e.g., '20241').
 * @param {string} applicationCode - A single application code representing the course round.
 * @returns {boolean} True if the user has the required access; otherwise, false.
 */

async function resolveUserAccessRights(user, courseCode, semester, applicationCode) {
  const { isKursinfoAdmin, isSchoolAdmin, isSuperUser } = user

  // Grant access to high-level roles immediately
  if (isKursinfoAdmin || isSchoolAdmin || isSuperUser) return true

  const { isExaminer, isCourseTeacher, isCourseCoordinator } = await getEmployeeRoleForCourseRound(
    user.kthId,
    courseCode,
    semester,
    applicationCode
  )

  // Grant access if the user is an examiner, teacher, or course coordinator for the course round
  // Note: isExaminer is always checked on the course version level,
  //       while isTeacher and isCourseCoordinator are checked on the course round level
  if (isExaminer || isCourseTeacher || isCourseCoordinator) return true

  // Else, return false
  return false
}

module.exports = {
  fetchCourseAndRoundGroups,
  fetchUsersInGroupsCategorizedByRole,
  fetchGroupNamesForUserCategorizedByRole,
  getEmployeeRoleForCourse,
  getEmployeeRoleForCourseRound,
  getCourseEmployees,
  resolveUserAccessRights,
}
