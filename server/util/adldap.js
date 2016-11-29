const ldap = require('ldapjs')
const config = require('../init/configuration').full
const secureConfig = require('../init/configuration').secure
const log = require('kth-node-log')
const session = require('./session')

/**
 * Creating an LDAPJS Client instance based on the configuration in localSettings.js
 * url  a valid LDAP url.
 * socketPath  If you're running an LDAP server over a Unix Domain Socket, use this.
 * log  You can optionally pass in a bunyan instance the client will use to acquire a logger. The client logs all messages at the trace level.
 * timeout  How long the client should let operations live for before timing out. Default is Infinity.
 * connectTimeout  How long the client should wait before timing out on TCP connections. Default is up to the OS.
 * maxConnections  Whether or not to enable connection pooling, and if so, how many to maintain.
 * If using connection pooling, you can additionally pass in:
 * bindDN  The DN all connections should be bound as.
 * bindCredentials  The credentials to use with bindDN.
 * checkInterval  How often to schedule health checks.
 * maxIdleTime  How long a client can sit idle before initiating a health check (subject to the frequency set by checkInterval).
 */

module.exports.isOk = _isOk

var isOk
function _isOk () {
  return isOk
}

function createClient () {
  var client = ldap.createClient({
    url: secureConfig.ldap.uri,
    timeout: config.ldapClient.timeout,
    connectTimeout: config.ldapClient.connecttimeout,
    maxConnections: config.ldapClient.maxconnections,
    bindDN: secureConfig.ldap.username,
    bindCredentials: secureConfig.ldap.password,
    checkInterval: config.ldapClient.checkinterval,
    maxIdleTime: config.ldapClient.maxidletime,
    reconnect: true
  })

  client.on('open', function () {
    log.debug('LDAP connection OPENED')
    isOk = true
  })

  client.on('connect', function () {
    log.debug('LDAP connection CONNECTED ')
    isOk = true
  })

  client.on('error', function (err) {
    if (err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT') {
      client.connect()
      log.debug('LDAP connection reconnect requested')
    }

    if (('' + err).indexOf('InvalidCredentialsError') === 0) {
      log.info({ err: err }, 'LDAP connection failed, bad credentials')
    } else {
      log.debug({ err: err }, 'LDAP connection failed, but fear not, it will reconnect OK')
    }

    isOk = false
  })

  client.on('destroy', function (err) {
    log.debug({ err: err }, 'LDAP connection destroyed')
    isOk = false
  })

  client.on('setupError', function (err) {
    log.debug({ err: err }, 'LDAP connection failed during setup')
    isOk = false
  })

  client.on('connectError', function (err) {
    log.debug({ err: err }, 'LDAP connect error')
    isOk = false
  })

  client.on('timeout', function (err) {
    isOk = false
    log.debug({ err: err }, 'LDAP timeout')
  })

  client.on('close', function (err) {
    isOk = false
    log.debug({ err: err }, 'LDAP closed')
  })

  return client
}

var ldapClient = createClient()

/**
 * Search user using LDAPJS.
 * scope  One of base, one, or sub. Defaults to base.
 * filter  A string version of an LDAP filter (see below), or a programatically constructed Filter object. Defaults to (objectclass=*).
 * attributes  attributes to select and return (if these are set, the server will return only these attributes). Defaults to the empty set, which means all attributes.
 * attrsOnly  boolean on whether you want the server to only return the names of the attributes, and not their values. Borderline useless. Defaults to false.
 * sizeLimit  the maximum number of entries to return. Defaults to 0 (unlimited).
 * timeLimit  the maximum amount of time the server should take in responding, in seconds. Defaults to 10. Lots of servers will ignore this.
 */
module.exports.redirectAuthenticatedUser = function (kthid, res, req, pgtIou) {
  var searchFilter = config.secure.ldap.filter.replace(config.ldapClient.filterReplaceHolder, kthid)

  var searchOptions = {
    scope: config.ldapClient.scope,
    filter: searchFilter,
    attributes: config.ldapClient.userattrs,
    sizeLimits: config.ldapClient.searchlimit,
    timeLimit: config.ldapClient.searchtimeout
  }

  ldapClient.search(config.secure.ldap.base, searchOptions, function (err, users) {
    if (err) {
      log.error({ err: err }, 'LDAP search error')
      res.redirect('/')
    }

    // result received, set user in session and redirect
    users.on('searchEntry', function (entry) {
      log.debug({ searchEntry: entry.object }, 'LDAP search result')

      if (entry) {
        session.SetLdapUser(req, entry.object, pgtIou)
        if (req.query['nextUrl']) {
          log.info({ req: req }, `Logged in user (${kthid}) exist in LDAP group, redirecting to ${req.query[ 'nextUrl' ]}`)
          res.redirect(req.query[ 'nextUrl' ])
        } else {
          log.info({ req: req }, `Logged in user (${kthid}) exist in LDAP group, but is missing nextUrl. Redirecting to /`)
          res.redirect('/node')       
        }
      } else {
        log.info({ req: req }, `Logged in user (${kthid}), does not exist in required group to /`)
        res.redirect('/')
      }
    })

    // ERROR received, log error and redirect to '/' in want of better
    users.on('error', function (err) {
      log.error({ err: err }, 'LDAP error')
      res.redirect('/')
    })

    // events not used for the time being
    users.on('searchReference', function (referral) {
      log.debug('referral: ' + referral.uris.join())
    })

    users.on('end', function (result) {
      log.debug('status: ' + result.status)
    })
  })
}
