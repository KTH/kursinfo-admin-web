'use strict'

const log = require('@kth/log')
const redis = require('kth-node-redis')
const connections = require('@kth/api-call').Connections
const config = require('./configuration').server

const opts = {
  log,
  redis,
  cache: config.cache,
  retryOnESOCKETTIMEDOUT: true,
  timeout: 5000,
  checkAPIs: true, // performs api-key checks against the apis, if a "required" check fails, the app will exit. Required apis are specified in the config
}

module.exports = connections.setup(config.nodeApi, config.apiKey, opts)
