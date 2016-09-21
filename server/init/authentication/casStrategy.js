'use strict'

const passport = require('passport')
const config = require('../configuration')
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
  ssoBaseURL: config.full.cas.ssoBaseURL,
  serverBaseURL: config.full.hostUrl,
  log: log
}

if (config.full.cas.pgtUrl) {
  casOptions.pgtURL = config.full.hostUrl + config.full.cas.pgtUrl
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
  casUrl: config.full.cas.ssoBaseURL
}, function (result, done) {
  log.debug({ result: result }, `CAS Gateway user: ${result.user}`)
  done(null, result.user, result)
}))
