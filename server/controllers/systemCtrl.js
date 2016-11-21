'use strict'

/**
 * System controller for functions such as /about and /monitor
 */
const log = require('kth-node-log')
const version = require('../../config/version')
const config = require('../init/configuration')
const packageFile = require('../../package.json')
const paths = require('../init/routing/paths')
const language = require('../util/language')
const i18n = require('kth-node-i18n')
const api = require('../init/api')
const ldap = require('../util/adldap')
const co = require('co')

/*
 * ----------------------------------------------------------------
 * Publicly exported functions.
 * ----------------------------------------------------------------
 */

module.exports = {
  monitor: co.wrap(_monitor),
  about: _about,
  robotsTxt: _robotsTxt,
  paths: _paths,
  notFound: _notFound,
  final: _final
}

/**
 * Get request on not found (404)
 * Renders the view 'notFound' with the layout 'exampleLayout'.
 */
function _notFound (req, res, next) {
  const err = new Error('Not Found: ' + req.originalUrl)
  err.status = 404
  next(err)
}

// this function must keep this signature for it to work properly
function _final (err, req, res, next) {
  log.error({ err: err }, 'Unhandled error')

  const statusCode = err.status || err.statusCode || 500
  const isProd = (/prod/gi).test(process.env.NODE_ENV)
  const lang = language.getLanguage(res)

  res.format({
    'text/html': () => {
      res.status(statusCode).render('system/error', {
        layout: 'errorLayout',
        message: err.message,
        friendly: _getFriendlyErrorMessage(lang, statusCode),
        error: isProd ? {} : err,
        status: statusCode,
        debug: 'debug' in req.query
      })
    },

    'application/json': () => {
      res.status(statusCode).json({
        message: err.message,
        friendly: _getFriendlyErrorMessage(lang, statusCode),
        error: isProd ? undefined : err.stack
      })
    },

    'default': () => {
      res.status(statusCode).type('text').send(isProd ? err.message : err.stack)
    }
  })
}

function _getFriendlyErrorMessage (lang, statusCode) {
  switch (statusCode) {
    case 404:
      return i18n.message('error_not_found', lang)
    default:
      return i18n.message('error_generic', lang)
  }
}

/* GET /_about
 * About page
 */
function _about (req, res) {
  res.render('system/about', {
    debug: 'debug' in req.query,
    layout: 'systemLayout',
    appName: JSON.stringify(packageFile.name),
    appVersion: JSON.stringify(packageFile.version),
    appDescription: JSON.stringify(packageFile.description),
    version: JSON.stringify(version),
    config: JSON.stringify(config.full.templateConfig),
    gitBranch: JSON.stringify(version.gitBranch),
    gitCommit: JSON.stringify(version.gitCommit),
    jenkinsBuild: JSON.stringify(version.jenkinsBuild),
    jenkinsBuildDate: JSON.stringify(version.jenkinsBuildDate),
    language: language.getLanguage(res),
    env: require('../server').get('env')
  })
}

/* GET /_monitor
 * Monitor page
 */
function * _monitor (req, res) {
  const adStatus = `\nLdap connection: ${ldap.isOk() ? 'OK' : 'ERROR'}`

  try {
    const results = yield _callAllAPIs()
    const apiStatus = results.join('\n')

    if (!apiStatus) {
      log.warn('no api configured')
    }

    let status = (/error/ig).test(apiStatus) ? 'ERROR' : 'OK'
    status += apiStatus ? '\n' : '\nAPI_STATUS: no api configured'
    const message = `APPLICATION_STATUS: ${status}${apiStatus}${adStatus}`
    res.type('text').send(message)
  } catch (err) {
    log.error({ err: err }, 'Application status error')
    const message = `APPLICATION_STATUS: ERROR ${err.message}${adStatus}`
    res.type('text').status(500).send(message)
  }
}

function _callAllAPIs () {
  const tasks = Object.keys(api).map((key) => {
    const endpoint = api[ key ]
    return endpoint.client.getAsync(endpoint.config.proxyBasePath + '/_paths')
      .then((data) => {
        if (data.statusCode === 200) {
          return `API_STATUS: ${key} is OK`
        }

        return `API_STATUS: ${key} responded with HTTP status ${data.statusCode}`
      })
      .catch((err) => {
        log.error({ err: err }, `API check failure for ${key}`)
        return `API_STATUS: ${key} threw an error: ${err.message}`
      })
  })

  return Promise.all(tasks)
}

/* GET /robots.txt
 * Robots.txt page
 */
function _robotsTxt (req, res) {
  res.type('text').render('system/robots')
}

/* GET /_paths
 * Return all paths for the system
 */
function _paths (req, res) {
  res.json(paths)
}

