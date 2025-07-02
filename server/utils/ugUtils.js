// Be aware that this entire file, or most of it, is replicated in multiple apps,
// so changes here should probably be synced to the other apps.
// See https://confluence.sys.kth.se/confluence/x/6wYJDQ for more information.

/**
 * Converts a course code into its UG course group name.
 *
 * @param {string} courseCode - The Ladok course code (typically 6 or 7 characters).
 * @returns {string|undefined} UG course group name, or undefined if the format is invalid.
 */
function getCourseGroupName(courseCode) {
  if (courseCode.length === 7) return `ladok2.kurser.${courseCode.slice(0, 3)}.${courseCode.slice(3)}`
  if (courseCode.length === 6) return `ladok2.kurser.${courseCode.slice(0, 2)}.${courseCode.slice(2)}`
  return undefined
}

/**
 * Constructs the UG course round group name from course code, semester, and application code.
 *
 * @param {string} courseCode - The course code (e.g., 'SF1624').
 * @param {string} semester - The semester (e.g., '20241').
 * @param {string} applicationCode - The application code for the round (e.g., '11111').
 * @returns {string|undefined} Full UG course round group name or undefined if input is invalid.
 */
function getCourseRoundGroupName(courseCode, semester, applicationCode) {
  if (!courseCode || !semester || !applicationCode) return undefined
  const courseGroupName = getCourseGroupName(courseCode)
  if (!courseGroupName) return undefined
  return `${courseGroupName}.${semester}.${applicationCode}`
}

/**
 * Converts a list of person objects into HTML snippets.
 *
 * @param {Object[]} personList - List of person objects containing `username`, `givenName`, and `surname`.
 * @returns {string} HTML string representing the list of people.
 */
function createPersonHtml(personList) {
  return personList
    .map(
      person => `
      <p class="person">
        <img class="profile-picture" src="https://www.kth.se/files/thumbnail/${person.username}" width="31" height="31">
        <a href="/profile/${person.username}/">${person.givenName} ${person.surname}</a> 
      </p>`
    )
    .join('')
}

/**
 * Builds an object with categorized employee roles and corresponding HTML content.
 *
 * @param {Object[]} examiners - List of examiner person objects.
 * @param {Object[]} teachers - List of teacher person objects.
 * @param {Object[]} courseCoordinators - List of course coordinator person objects.
 * @returns {Object} Object containing HTML strings for each role, if applicable.
 */
function buildEmployeesHtmlObject(examiners, teachers, courseCoordinators) {
  return {
    ...(examiners?.length && { examiners: createPersonHtml(examiners) }),
    ...(teachers?.length && { teachers: createPersonHtml(teachers) }),
    ...(courseCoordinators?.length && { courseCoordinators: createPersonHtml(courseCoordinators) }),
  }
}

module.exports = {
  getCourseGroupName,
  getCourseRoundGroupName,
  createPersonHtml,
  buildEmployeesHtmlObject,
}
