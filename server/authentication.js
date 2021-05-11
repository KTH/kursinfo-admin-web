'use strict'

const language = require('kth-node-web-common/lib/language')
const i18n = require('../i18n')

function _hasThisTypeGroup(courseCode, courseInitials, ldapUser, employeeType) {
  // 'edu.courses.SF.SF1624.20192.1.courseresponsible'
  // 'edu.courses.SF.SF1624.20182.9.teachers'

  const groups = ldapUser.memberOf
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

module.exports.requireRole = function () {
  const roles = Array.prototype.slice.call(arguments)

  return async function _hasCourseAcceptedRoles(req, res, next) {
    const lang = language.getLanguage(res)

    const ldapUser = req.session.authUser || {}
    const courseCode = req.params.courseCode.toUpperCase()
    const courseInitials = req.params.courseCode.slice(0, 2).toUpperCase()
    // TODO: Add date for courseresponsible
    const userCourseRoles = {
      // isExaminator: hasGroup(`edu.courses.${courseInitials}.${courseCode}.examiner`, ldapUser),
      isCourseResponsible: _hasThisTypeGroup(courseCode, courseInitials, ldapUser, 'courseresponsible'),
      isSuperUser: ldapUser.isSuperUser,
      isCourseTeacher: _hasThisTypeGroup(courseCode, courseInitials, ldapUser, 'teachers'),
    }

    // If we don't have one of these then access is forbidden
    const hasAuthorizedRole = roles.reduce((prev, curr) => prev || userCourseRoles[curr], false)

    if (!hasAuthorizedRole) {
      const infoAboutAuth = {
        status: 403,
        showMessage: true,
        message: i18n.message('message_have_not_rights', lang),
      }
      return next(infoAboutAuth)
    }
    req.session.thisCourseUserRoles = userCourseRoles
    return next()
  }
}
