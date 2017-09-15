'use strict'

const passport = require('passport')
const config = require('./configuration').server
const log = require('kth-node-log')
const CasStrategy = require('kth-node-passport-cas').Strategy
const GatewayStrategy = require('kth-node-passport-cas').GatewayStrategy

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
  log: log
}

if (config.cas.pgtUrl) {
  casOptions.pgtURL = config.hostUrl + config.cas.pgtUrl
}

const strategy = new CasStrategy(casOptions,
  function (logOnResult, done) {
    const user = logOnResult.user
    log.debug(`User from CAS: ${user} ${JSON.stringify(logOnResult)}`)
    return done(null, user, logOnResult)
  }
)

passport.use(strategy)

passport.use(new GatewayStrategy({
  casUrl: config.cas.ssoBaseURL
}, function (result, done) {
  log.debug({ result: result }, `CAS Gateway user: ${result.user}`)
  done(null, result.user, result)
}))

// The factory routeHandlers.getRedirectAuthenticatedUser returns a middleware that sets the user in req.session.authUser and
// redirects to appropriate place when returning from CAS login
// The unpackLdapUser function transforms an ldap user to a user object that is stored as
const ldapClient = require('./adldapClient')
const { hasGroup } = require('kth-node-ldap').utils
module.exports.redirectAuthenticatedUserHandler = require('kth-node-passport-cas').routeHandlers.getRedirectAuthenticatedUser({
  ldapConfig: config.ldap,
  ldapClient: ldapClient,
  proxyPrefixPath: config.proxyPrefixPath.uri,
  unpackLdapUser: function (ldapUser, pgtIou) {
    return {
      username: ldapUser.ugUsername,
      displayName: ldapUser.displayName,
      email: ldapUser.mail,
      pgtIou: pgtIou,
      // This is where you can set custom roles
      isAdmin: hasGroup(config.auth.adminGroup, ldapUser)
    }
  }
})

/*
  Checks req.session.authUser as created above im unpackLdapUser.

  Usage:

  requireRole('isAdmin', 'isEditor')
*/

module.exports.requireRole = function () {
  const roles = Array.prototype.slice.call(arguments)

  return function _hasNoneOfAcceptedRoles (req, res, next) {
    const ldapUser = req.session.authUser || {}

    // Check if we have any of the roles passed
    const hasAuthorizedRole = roles.reduce((prev, curr) => prev || ldapUser[curr], false)
    // If we don't have one of these then access is forbidden
    if (!hasAuthorizedRole) {
      const error = new Error('Forbidden')
      error.status = 403
      return next(error)
    }
    return next()
  }
}
