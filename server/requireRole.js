'use strict'

const language = require('@kth/kth-node-web-common/lib/language')
const log = require('@kth/log')

const i18n = require('../i18n')
const ladokCourseData = require('./apiCalls/ladokApi')
const { getEmployeeRoleForCourse } = require('./apiCalls/ugRestApi')

const schools = () => ['abe', 'eecs', 'itm', 'cbh', 'sci']

async function _isAdminOfCourseSchool(courseCode, user) {
  const { memberOf: userGroups } = user

  if (!userGroups || userGroups?.length === 0) return false

  const userSchools = schools().filter(schoolCode => userGroups.includes(`app.kursinfo.${schoolCode}`))

  if (userSchools.length === 0) return false
  const courseSchoolCode = await ladokCourseData.getCourseSchoolCode(courseCode)

  if (courseSchoolCode === 'missing_school_code' || courseSchoolCode === 'ladok_get_fails') {
    log.info('Has problems with fetching school code to define if user is a school admin', {
      message: courseSchoolCode,
    })
    return false
  }

  const hasSchoolCodeInAdminGroup = userSchools.includes(courseSchoolCode.toLowerCase())
  log.debug('User admin role', { hasSchoolCodeInAdminGroup })

  return hasSchoolCodeInAdminGroup
}

const messageHaveNotRights = lang => ({
  status: 403,
  message: i18n.message('message_have_not_rights', lang),
})

module.exports.requireRole = (...requiredRoles) =>
  async function _hasCourseAcceptedRoles(req, res, next) {
    const lang = language.getLanguage(res)
    const { user = {} } = req.session.passport

    const courseCode = req.params.courseCode.toUpperCase()

    // Determine the user's role in the course as a whole (not a specific round)
    const { isCourseCoordinator, isCourseTeacher, isExaminer } = await getEmployeeRoleForCourse(user.kthId, courseCode)

    // Build a full list of role flags
    const roles = {
      isCourseCoordinator,
      isCourseTeacher,
      isExaminer,
      isKursinfoAdmin: user.isKursinfoAdmin,
      isSuperUser: user.isSuperUser,
      isSchoolAdmin: null, // Will be resolved below if needed
    }

    req.session.passport.user.roles = roles

    // Check if the user has at least one of the required roles
    const isAuthorized = requiredRoles.some(role => roles[role])
    if (isAuthorized) return next()

    // If the required roles do NOT include school admin, deny access
    if (!requiredRoles.includes('isSchoolAdmin')) {
      return next(messageHaveNotRights(lang))
    }

    // Otherwise, check whether the user is a school admin for the given course
    const isScoolAdmin = await _isAdminOfCourseSchool(courseCode, user)
    req.session.passport.user.roles.isSchoolAdmin = isScoolAdmin

    // Allow or deny access based on school admin status
    if (isScoolAdmin) return next()
    else return next(messageHaveNotRights(lang))
  }
