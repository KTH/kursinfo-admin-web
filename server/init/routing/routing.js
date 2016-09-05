'use strict'

const log = require('kth-node-log')
const server = require('../../server')
const proxyPrefixPath = require('../configuration').full.proxyPrefixPath.uri
const url = require('url')

module.exports = {
  route: route,
  prefix: prefix
}

function route (path, handler) {
  if (!path || !handler) {
    log.error('Routing called without path or handler')
    return
  }

  if (!path.method || !path.uri) {
    log.error({ path: path }, 'Path in routing is missing method or uri')
    return
  }

  const verb = path.method.toLowerCase()
  initRoute(path, verb, handler)
}

function initRoute (path, verb, handler) {
  log.debug('Routing ' + path.uri + ' with method ' + verb)
  server[ verb ](path.uri, handler)
}

function prefix (pathname, basePath) {
  basePath = basePath || proxyPrefixPath
  return url.resolve(basePath + '/', '.' + pathname)
}
