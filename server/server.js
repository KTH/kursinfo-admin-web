const server = require('kth-node-server')
const config = require('./init/configuration')
require('./init/logging')
const log = require('kth-node-log')

server.setConfig(config)
server.setLog(log)
server.setInitCallback(function () {
  require('./init')
})

server.locals.secret = new Map()

module.exports = server
