const logging = require('kth-client-logging')
const config = { config: window.config, paths: window.paths }

logging.setConfig(config.config)

module.exports = logging
