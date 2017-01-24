'use strict'
const { generateConfig } = require('kth-node-configuration')
// The ldapDefaultSettings contains ldapClient defaults object
const ldapDefaultSettings = require('kth-node-configuration').unpackLDAPConfig.defaultSettings

// These settings are used by the server
const serverConfig = generateConfig([
  ldapDefaultSettings,
  require('../../../config/commonSettings'),
  require('../../../config/serverSettings')
])

module.exports.server = serverConfig

// These settings are passed to the browser
const browserConfig = generateConfig([
  require('../../../config/commonSettings'),
  require('../../../config/browserSettings')
])

module.exports.browser = browserConfig
