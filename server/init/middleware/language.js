'use strict'

const server = require('../../server')
const config = require('../configuration')
const language = require('../../util/language')

/**
 * Middleware that checks for l-flag and stores its value in the session
 */
function _setLanguage (req, res, next) {
  // Set locale if not already done by other middleware
  // You can customise behaviour by adding middleware before this one
  if (!res.locals.locale) {
    language.init(req, res, req.query[ 'l' ])
  }
  next()
}

// Match all routes that aren't under the static directory
const langRouteRegex = new RegExp('^' + config.full.proxyPrefixPath.uri + '/(?!static).*$', 'g')
server.use(langRouteRegex, _setLanguage)
