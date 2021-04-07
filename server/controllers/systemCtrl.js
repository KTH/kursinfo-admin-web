/* eslint-disable import/order */

'use strict'

/**
 * System controller for functions such as /about and /monitor
 */
const log = require('kth-node-log')
const version = require('../../config/version')
const config = require('../configuration').server
const packageFile = require('../../package.json')
const ldapClient = require('../adldapClient')
const { getPaths } = require('kth-node-express-routing')
const language = require('kth-node-web-common/lib/language')
const i18n = require('../../i18n')
const api = require('../api')
const registry = require('component-registry').globalRegistry
const { IHealthCheck } = require('kth-node-monitor').interfaces

/**
 * Get request on not found (404)
 * Renders the view 'notFound' with the layout 'exampleLayout'.
 */
function _notFound(req, res, next) {
  const err = new Error('Not Found: ' + req.originalUrl)
  err.status = 404
  next(err)
}

function _getFriendlyErrorMessage(lang, statusCode) {
  switch (statusCode) {
    case 400:
      return i18n.message('error_bad_request', lang)
    case 403:
      return i18n.message('error_have_not_rights', lang)
    case 404:
      return i18n.message('error_not_found', lang)
    default:
      return i18n.message('error_generic', lang)
  }
}

// This function must keep this signature for it to work properly,
// see https://expressjs.com/en/guide/error-handling.html#writing-error-handlers
// eslint-disable-next-line no-unused-vars
function _final(err, req, res, next) {
  const statusCode = err.status || err.statusCode || 500

  switch (statusCode) {
    case 400:
      log.debug({ message: err }, `400 Bad request ${err.message}`)
      break
    case 403:
      // Forbidden is not an error but a message with information
      log.debug({ message: err }, `403 Forbidden ${err.message}`)
      break
    case 404:
      log.debug({ message: err }, `404 Not found ${err.message}`)
      break
    default:
      log.error({ err }, `Unhandled error ${err.message}`)
      break
  }

  const isProd = /prod/gi.test(process.env.NODE_ENV)
  const lang = language.getLanguage(res)

  res.format({
    'text/html': () => {
      res.status(statusCode).render('system/error', {
        layout: 'errorLayout',
        message: err.message,
        showMessage: err.showMessage || false,
        friendly: _getFriendlyErrorMessage(lang, statusCode),
        error: isProd ? {} : err,
        status: statusCode,
        debug: 'debug' in req.query,
      })
    },

    'application/json': () => {
      res.status(statusCode).json({
        message: err.message,
        friendly: _getFriendlyErrorMessage(lang, statusCode),
        error: isProd ? null : err.stack,
      })
    },

    default: () => {
      res
        .status(statusCode)
        .type('text')
        .send(isProd ? err.message : err.stack)
    },
  })
}

/* GET /_about
 * About page
 */
function _about(req, res) {
  res.render('system/about', {
    debug: 'debug' in req.query,
    layout: 'systemLayout',
    appName: JSON.stringify(packageFile.name),
    appVersion: JSON.stringify(packageFile.version),
    appDescription: JSON.stringify(packageFile.description),
    version: JSON.stringify(version),
    config: JSON.stringify(config.templateConfig),
    gitBranch: JSON.stringify(version.gitBranch),
    gitCommit: JSON.stringify(version.gitCommit),
    jenkinsBuild: JSON.stringify(version.jenkinsBuild),
    jenkinsBuildDate: JSON.stringify(version.jenkinsBuildDate),
    dockerName: JSON.stringify(version.dockerName),
    dockerVersion: JSON.stringify(version.dockerVersion),
    language: language.getLanguage(res),
    env: require('../server').get('env'),
  })
}

/* GET /_monitor
 * Monitor page
 */
function _monitor(req, res) {
  const apiConfig = config.nodeApi

  // Check APIs
  const subSystems = Object.keys(api).map(apiKey => {
    const apiHealthUtil = registry.getUtility(IHealthCheck, 'kth-node-api')
    return apiHealthUtil.status(api[apiKey], {
      required: apiConfig[apiKey].required,
    })
  })
  // Check LDAP
  const ldapHealthUtil = registry.getUtility(IHealthCheck, 'kth-node-ldap')
  subSystems.push(ldapHealthUtil.status(ldapClient, config.ldap))

  // If we need local system checks, such as memory or disk, we would add it here.
  // Make sure it returns a promise which resolves with an object containing:
  // {statusCode: ###, message: '...'}
  // The property statusCode should be standard HTTP status codes.
  const localSystems = Promise.resolve({ statusCode: 200, message: 'OK' })

  /* -- You will normally not change anything below this line -- */

  // Determine system health based on the results of the checks above. Expects
  // arrays of promises as input. This returns a promise
  const systemHealthUtil = registry.getUtility(IHealthCheck, 'kth-node-system-check')
  const systemStatus = systemHealthUtil.status(localSystems, subSystems)

  systemStatus
    .then(status => {
      // Return the result either as JSON or text
      if (req.headers.accept === 'application/json') {
        const outp = systemHealthUtil.renderJSON(status)
        res.status(status.statusCode).json(outp)
      } else {
        const outp = systemHealthUtil.renderText(status)
        res.type('text').status(status.statusCode).send(outp)
      }
    })
    .catch(err => {
      res.type('text').status(500).send(err)
    })
}

/* GET /robots.txt
 * Robots.txt page
 */
function _robotsTxt(req, res) {
  res.type('text').render('system/robots')
}

/* GET /_paths
 * Return all paths for the system
 */
function _paths(req, res) {
  res.json(getPaths())
}

/*
 * ----------------------------------------------------------------
 * Publicly exported functions.
 * ----------------------------------------------------------------
 */

module.exports = {
  monitor: _monitor,
  about: _about,
  robotsTxt: _robotsTxt,
  paths: _paths,
  notFound: _notFound,
  final: _final,
}
