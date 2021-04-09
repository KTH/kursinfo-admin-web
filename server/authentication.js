'use strict'

const passport = require('passport')
const log = require('kth-node-log')
const CasStrategy = require('kth-node-passport-cas').Strategy
const { GatewayStrategy } = require('kth-node-passport-cas')
const language = require('kth-node-web-common/lib/language')
const config = require('./configuration').server
const i18n = require('../i18n')
/**
 * Passport will maintain persistent login sessions. In order for persistent sessions to work, the authenticated
 * user must be serialized to the session, and deserialized when subsequent requests are made.
 *
 * Passport does not impose any restrictions on how your user records are stored. Instead, you provide functions
 * to Passport which implements the necessary serialization and deserialization logic. In a typical
 * application, this will be as simple as serializing the user ID, and finding the user by ID when deserializing.
 */
passport.serializeUser(function (user, done) {
  if (user) {
    log.debug('User serialized: ' + user)
    done(null, user)
  } else {
    done()
  }
})

passport.deserializeUser(function (user, done) {
  if (user) {
    log.debug('User deserialized: ' + user)
    done(null, user)
  } else {
    done()
  }
})

/**
 * Before asking Passport to authenticate a request, the strategy (or strategies) used by an application must
 * be configured.
 *
 * Strategies, and their configuration, are supplied via the use() function. For example, the following uses
 * the passport-cas-kth strategy for CAS authentication.
 */

const casOptions = {
  ssoBaseURL: config.cas.ssoBaseURL,
  serverBaseURL: config.hostUrl,
  log,
}

if (config.cas.pgtUrl) {
  casOptions.pgtURL = config.hostUrl + config.cas.pgtUrl
}

const strategy = new CasStrategy(casOptions, function (logOnResult, done) {
  const { user } = logOnResult
  log.debug(`User from CAS: ${user} ${JSON.stringify(logOnResult)}`)
  return done(null, user, logOnResult)
})

passport.use(strategy)

passport.use(
  new GatewayStrategy(
    {
      casUrl: config.cas.ssoBaseURL,
    },
    function (result, done) {
      log.debug({ result }, `CAS Gateway user: ${result.user}`)
      done(null, result.user, result)
    }
  )
)

// The factory routeHandlers.getRedirectAuthenticatedUser returns a middleware that sets the user in req.session.authUser and
// redirects to appropriate place when returning from CAS login
// The unpackLdapUser function transforms an ldap user to a user object that is stored as
const ldapClient = require('./adldapClient')
const { hasGroup, getGroups } = require('kth-node-ldap').utils
module.exports.redirectAuthenticatedUserHandler = require('kth-node-passport-cas').routeHandlers.getRedirectAuthenticatedUser(
  {
    ldapConfig: config.ldap,
    ldapClient,
    proxyPrefixPath: config.proxyPrefixPath.uri,
    unpackLdapUser: function (ldapUser, pgtIou) {
      return {
        username: ldapUser.ugUsername,
        displayName: ldapUser.displayName,
        email: ldapUser.mail,
        ugKthid: ldapUser.ugKthid,
        pgtIou,
        memberOf: getGroups(ldapUser), // memberOf important for requireRole
        isSuperUser: hasGroup(config.auth.superuserGroup, ldapUser),
      }
    },
  }
)

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
      isExaminator: hasGroup(`edu.courses.${courseInitials}.${courseCode}.examiner`, ldapUser),
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
