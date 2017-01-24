const server = require('kth-node-server')
// Load .env file in development mode
const nodeEnv = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase()
if (nodeEnv === 'development' || nodeEnv === 'dev' || !nodeEnv) {
  require('dotenv').config()
}
// Now read the server config
const config = require('./init/configuration').server

require('./init/logging')
const log = require('kth-node-log')

// Register handlebar helpers
require('./views/helpers')

server.setConfig({ full: config })
server.setLog(log)
server.setInitCallback(function () {
  require('./init')
})

server.locals.secret = new Map()

module.exports = server
