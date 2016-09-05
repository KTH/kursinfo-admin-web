'use strict'

/**
 * Selects the template mechanism to use. In this case its Handlebars.
 *
 * Adds withVersion helper which ca be used to add a version on a url
 * to help with caching.
 */

const exphbs = require('express-handlebars')
const server = require('../../server')
const packageFile = require('../../../package.json')
const config = require('../configuration')
const log = require('../logging')
const path = require('path')

let version = packageFile.version

try {
  const buildVersion = require('../../../config/version')
  version = version + '-' + buildVersion.jenkinsBuild
} catch (err) {
  log.error(err.message)
}

server.set('views', path.join(__dirname, '/../../views'))
server.set('layouts', path.join(__dirname, '/../../views/layouts'))
server.set('partials', path.join(__dirname, '/../../views/partials'))
server.engine('handlebars', exphbs({
  defaultLayout: 'publicLayout',
  layoutsDir: server.settings.layouts,
  partialsDir: server.settings.partials,
  helpers: {
    withVersion: function (url) {
      return url + '?v=' + version
    },
    withProxyPrefixPath: function (url) {
      return config.full.proxyPrefixPath.uri + url
    },
    extend: function (name, options) {
      this._blocks = this._blocks || {}
      this._blocks[ name ] = this._blocks[ name ] || []
      this._blocks[ name ].push(options.fn(this))
    },
    prefixScript: function (url, blockName) {
      blockName = typeof blockName === 'string' ? blockName : 'scripts'
      this._blocks = this._blocks || {}
      this._blocks[ blockName ] = this._blocks[ blockName ] || []
      url = `${config.full.proxyPrefixPath.uri}${url}?v=${encodeURIComponent(version)}`
      const html = `<script src="${url}"></script>`
      this._blocks[ blockName ].push(html)
    },
    prefixStyle: function (url, blockName, media) {
      blockName = typeof blockName === 'string' ? blockName : 'styles'
      media = typeof media === 'string' ? media : 'all'
      this._blocks = this._blocks || {}
      this._blocks[ blockName ] = this._blocks[ blockName ] || []
      url = `${config.full.proxyPrefixPath.uri}${url}?v=${encodeURIComponent(version)}`
      const html = `<link href="${url}" media="${media}" rel="stylesheet">`
      this._blocks[ blockName ].push(html)
    },
    render: function (name) {
      this._blocks = this._blocks || {}
      const content = this._blocks[ name ] || []
      return content.join('\n')
    }
  }
}))

server.set('view engine', 'handlebars')
