'use strict'

const language = require('kth-node-web-common/lib/language')
const { hasGroup } = require('@kth/kth-node-passport-oidc')

const i18n = require('../i18n')

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

module.exports.requireRole = (...roles) =>
  async function _hasCourseAcceptedRoles(req, res, next) {
    const lang = language.getLanguage(res)

    const user = req.session.passport.user || {}
    const courseCode = req.params.courseCode.toUpperCase()
    const courseInitials = req.params.courseCode.slice(0, 2).toUpperCase()
    // TODO: Add date for courseresponsible
    const userCourseRoles = {
      isExaminator: hasGroup(`edu.courses.${courseInitials}.${courseCode}.examiner`, user),
      isCourseResponsible: _hasThisTypeGroup(courseCode, courseInitials, user, 'courseresponsible'),
      isSuperUser: user.isSuperUser,
      isCourseTeacher: _hasThisTypeGroup(courseCode, courseInitials, user, 'teachers'),
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
