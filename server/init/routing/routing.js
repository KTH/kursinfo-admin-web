'use strict'

const log = require('kth-node-log')
const server = require('../../server')
const proxyPrefixPath = require('../configuration').server.proxyPrefixPath.uri
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
  if (path.cas === 'gateway') {
    server[ verb ](path.uri, server.gatewayLogin(path.fallback))
  } else if (path.cas) {
    log.debug('Authentication with CAS enforced for path: ' + JSON.stringify(path))
    server[ verb ](path.uri, server.login)
  }
  log.debug('Routing ' + path.uri + ' with method ' + verb)
  server[ verb ](path.uri, handler)
}

function prefix (pathname, basePath) {
  basePath = basePath || proxyPrefixPath
  return url.resolve(basePath + '/', '.' + pathname)
}

