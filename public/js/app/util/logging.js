const logging = require('kth-client-logging')
const config = require('config')

logging.setConfig(config.config)

module.exports = logging
