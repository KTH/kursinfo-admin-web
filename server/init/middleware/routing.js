'use strict'

/**
 * Various routing initialization.
 */

const server = require('../../server')
const config = require('../configuration')
const express = require('express')
const log = require('kth-node-log')

// helper
function setCustomCacheControl (res, path) {
  log.debug('custom header for path: ' + express.static.mime.lookup(path))

  if (express.static.mime.lookup(path) === 'text/html') {
    // Custom Cache-Control for HTML files
    res.setHeader('Cache-Control', 'no-cache')
  }
}

function getEnv () {
  const env = process.env.NODE_ENV

  if (!env) {
    return 'dev'
  }

  if (/^prod/i.test(env)) {
    return 'prod'
  }

  if (/^ref/i.test(env)) {
    return 'ref'
  }

  return 'dev'
}

// Files/statics routes--
// Map components HTML files as static content, but set custom cache control header, currently no-cache to force If-modified-since/Etag check.
server.use(config.full.proxyPrefixPath.uri + '/static/js/components', express.static('./public/js/components', { setHeaders: setCustomCacheControl }))
// Map bundles build folder to static URL
server.use(config.full.proxyPrefixPath.uri + '/static/js', express.static(`./bundles/${getEnv()}`))
// Map static content like images, css and js.
server.use(config.full.proxyPrefixPath.uri + '/static', express.static('./public'))
// Return 404 if static file isn't found so we don't go through the rest of the pipeline
server.use(config.full.proxyPrefixPath.uri + '/static', function (req, res, next) {
  var error = new Error('File not found: ' + req.originalUrl)
  error.statusCode = 404
  next(error)
})


// "case sensitive routing" tells Express whether /my-path is the same as /My-PaTH/
// This is default false but I think better for SEO purposes, creating one canonical url.
server.set('case sensitive routing', true)
