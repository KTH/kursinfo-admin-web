const server = require('kth-node-server')
// Load .env file in development mode
const nodeEnv = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase()
if (nodeEnv === 'development' || nodeEnv === 'dev' || !nodeEnv) {
  require('dotenv').config()
}
// Now read the server config
const config = require('./init/configuration').server
const log = require('kth-node-log')

// Register handlebar helpers
require('./views/helpers')


// initialize logger
require('./init/logging')

// What is this used for?
server.locals.secret = new Map()

server.start({
  useSsl: config.useSsl,
  pfx: config.ssl.pfx,
  passphrase: config.ssl.passphrase,
  key: config.ssl.key,
  ca: config.ssl.ca,
  cert: config.ssl.cert,
  port: config.port,
  log
})

module.exports = server
