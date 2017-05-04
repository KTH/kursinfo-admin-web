'use strict'
const { generateConfig } = require('kth-node-configuration')

// These settings are used by the server
const serverConfig = generateConfig([
  require('../config/commonSettings'),
  require('../config/serverSettings')
])

module.exports.server = serverConfig

// These settings are passed to the browser
const browserConfig = generateConfig([
  require('../config/commonSettings'),
  require('../config/browserSettings')
])

module.exports.browser = browserConfig
