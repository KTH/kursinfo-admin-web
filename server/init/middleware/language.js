'use strict'

const server = require('../../server')
const config = require('../configuration')
const language = require('../../util/language')

/**
 * Middleware that checks for l-flag and stores its value in the session
 */
function _setLanguage (req, res, next) {
  if (/^\/static\/.*/.test(req.url)) {
    // don't check language on static routes
    next()
    return
  }

  language.init(req, res, req.query[ 'l' ])

  next()
}

server.use(config.full.proxyPrefixPath.uri, _setLanguage)
