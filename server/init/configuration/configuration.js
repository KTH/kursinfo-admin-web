'use strict'

const configurator = require('kth-node-configuration')

const config = configurator({
  defaults: require('../../../config/commonSettings'),
  local: require('../../../config/localSettings'),
  ref: require('../../../config/refSettings'),
  prod: require('../../../config/prodSettings'),
  dev: require('../../../config/devSettings')
})

module.exports = {
  full: config.full(),
  secure: config.secure(),
  safe: config.safe(),
  env: config.env()
}
