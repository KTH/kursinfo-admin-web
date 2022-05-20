'use strict'

const language = require('@kth/kth-node-web-common/lib/language')
const { hasGroup } = require('@kth/kth-node-passport-oidc')
const log = require('@kth/log')

const i18n = require('../i18n')
const koppsCourseData = require('./koppsApi')

function _hasThisTypeGroup(courseCode, courseInitials, user, employeeType) {
  // 'edu.courses.SF.SF1624.20192.1.courseresponsible'
  // 'edu.courses.SF.SF1624.20182.9.teachers'

  const groups = user.memberOf
  const startWith = `edu.courses.${courseInitials}.${courseCode}.` // TODO: What to do with years 20192. ?
  const endWith = `.${employeeType}`
  if (groups && groups.length > 0) {
    for (let i = 0; i < groups.length; i++) {
      if (groups[i].indexOf(startWith) >= 0 && groups[i].indexOf(endWith) >= 0) {
        return true
      }
    }
  }
  return false
}

const schools = () => ['abe', 'eecs', 'itm', 'cbh', 'sci']

async function _isAdminOfCourseSchool(courseCode, user) {
  // app.kursinfo.***
  const { memberOf: userGroups } = user

  if (!userGroups || userGroups?.length === 0) return false

  const userSchools = schools().filter(schoolCode => userGroups.includes(`app.kursinfo.${schoolCode}`))

  if (userSchools.length === 0) return false
  const courseSchoolCode = await koppsCourseData.getCourseSchool(courseCode)
  log.debug('Fetched courseSchoolCode to define user role', { courseSchoolCode, userSchools })

  if (courseSchoolCode === 'missing_school_code' || courseSchoolCode === 'kopps_get_fails') {
    log.info('Has problems with fetching school code to define if user is a school admin', {
      message: courseSchoolCode,
    })
    return false
  }

  const hasSchoolCodeInAdminGroup = userSchools.includes(courseSchoolCode.toLowerCase())
  log.debug('User admin role', { hasSchoolCodeInAdminGroup })

  // think about missing course code

  return hasSchoolCodeInAdminGroup
}

const messageHaveNotRights = lang => ({
  status: 403,
  showMessage: true,
  message: i18n.message('message_have_not_rights', lang),
})

module.exports.requireRole = (...roles) =>
  async function _hasCourseAcceptedRoles(req, res, next) {
    const lang = language.getLanguage(res)

    const { user = {} } = req.session.passport
    const courseCode = req.params.courseCode.toUpperCase()
    const courseInitials = courseCode.slice(0, 2)
    // TODO: Add date for courseresponsible
    const basicUserCourseRoles = {
      isCourseResponsible: _hasThisTypeGroup(courseCode, courseInitials, user, 'courseresponsible'),
      isCourseTeacher: _hasThisTypeGroup(courseCode, courseInitials, user, 'teachers'),
      isExaminator: hasGroup(`edu.courses.${courseInitials}.${courseCode}.examiner`, user),
      isKursinfoAdmin: user.isKursinfoAdmin,
      isSuperUser: user.isSuperUser,
      isSchoolAdmin: null,
    }

    req.session.passport.user.roles = basicUserCourseRoles

    // If we don't have one of these then access is forbidden
    const hasBasicAuthorizedRole = roles.reduce((prev, curr) => prev || basicUserCourseRoles[curr], false)
    if (hasBasicAuthorizedRole) return next()

    if (!hasBasicAuthorizedRole && !roles.includes('isSchoolAdmin')) return next(messageHaveNotRights(lang))

    _isAdminOfCourseSchool(courseCode, user).then(isAdminOfCourseSchool => {
      req.session.passport.user.roles.isSchoolAdmin = isAdminOfCourseSchool

      if (isAdminOfCourseSchool) return next()
      else return next(messageHaveNotRights(lang))
    })
  }
