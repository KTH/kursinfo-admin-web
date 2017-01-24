'use strict'

const accessLog = require('kth-node-access-log')
const config = require('../configuration').server
const server = require('../../server')

server.use(accessLog(config.logging.accessLog))
