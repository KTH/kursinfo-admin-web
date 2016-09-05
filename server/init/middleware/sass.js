'use strict'

const sass = require('node-sass-middleware')
const path = require('path')
const server = require('../../server')
const log = require('kth-node-log')
const config = require('../configuration')
const rootPath = path.dirname(require.main.filename)

const cssPath = path.join(rootPath, 'public/css')
log.debug('Running SASS Middleware on ' + cssPath)

server.use(sass({
  src: 'public/css/',
  dest: 'public/css/',
  prefix: config.full.proxyPrefixPath.uri + '/static/css',
  debug: config.full.cssTranspiler.debug,
  force: config.full.cssTranspiler.force,
  outputStyle: 'compressed'
}))
