'use strict'

/*
 * Middleware for redirecting crawler requests to the canonical url.
 *
 * Canonical url is current url without query string
 *
 * When to redirect
 * User-Agent contains 'kth-gsa-crawler', i.e. a crawler request
 * Accept does NOT contain 'application/json', i.e. skip ajax-calls
 * path does NOT match '/<proxyPrefixPath>/static', i.e. skip resources
 */

const log = require('kth-node-log')
const url = require('url')
const config = require('../configuration').server
const server = require('../../server')

function redirectToCanonicalUrl (req, res, next) {
  var contentType = req.get('Accept')
  if (!contentType || contentType.indexOf('application/json') >= 0) {
    next()
    return
  }

  var currentUrl = config.hostUrl + res.req.originalUrl
  var canonicalUrl = getCanonicalUrl(currentUrl)

  if (isCrawlerRequest(res.req) && shouldRedirectToCanonicalUrl(res.req, currentUrl, canonicalUrl)) {
    log.debug('Redirecting crawler ', req.get('User-Agent'), contentType, res.req.originalUrl)
    res.redirect(canonicalUrl)
    return
  }

  next()
}

function isCrawlerRequest (req) {
  var gsaUserAgent = 'kth-gsa-crawler'
  var currentUserAgent = req.get('User-Agent')

  if (currentUserAgent && currentUserAgent.toLowerCase().indexOf(gsaUserAgent) >= 0) {
    return true
  }

  return false
}

function shouldRedirectToCanonicalUrl (req, currentUrl, canonicalUrl) {
  return isCrawlerRequest(req) && currentUrl !== canonicalUrl
}

function getCanonicalUrl (aUrl) {
  var tmpUrl = url.parse(aUrl)
  tmpUrl.search = ''
  var canonicalUrl = tmpUrl.format()
  if (canonicalUrl.endsWith('/')) {
    canonicalUrl = canonicalUrl.substr(0, canonicalUrl.length - 1)
  }

  return canonicalUrl
}

const proxyPath = config.proxyPrefixPath.uri
const excludePath = proxyPath + '(?!/static).*'
const excludeExpression = new RegExp(excludePath)

log.debug('Setup redirect crawler ', excludeExpression)
server.use(excludeExpression, redirectToCanonicalUrl)
