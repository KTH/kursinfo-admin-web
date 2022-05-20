'use strict'

require('dotenv').config()

const fs = require('fs')
const log = require('@kth/log')
const config = require('./server/configuration').server
const server = require('./server/server')

const packageFile = require('./package.json')

// catches uncaught exceptions
process.on('uncaughtException', (err, origin) => {
  log.error('APPLICATION EXIT - uncaught exception in ', packageFile.name)
  log.error(`Uncaught Exception, origin (${origin})`, { err })
  process.exit(1)
})
// catches unhandled promise rejections
process.on('unhandledRejection', reason => {
  // This line below provokes an uncaughtException and will be caught few lines
  // above
  log.error(`unhandledRejection  ${packageFile.name}`, reason)
  // throw reason
})

/* ****************************
 * ******* SERVER START *******
 * ****************************
 */
module.exports = server.start({
  useSsl: config.useSsl,
  pfx: config.ssl.pfx,
  passphrase: config.ssl.passphrase,
  key: config.ssl.key,
  ca: config.ssl.ca,
  cert: config.ssl.cert,
  port: config.port,
  logger: log,
})
