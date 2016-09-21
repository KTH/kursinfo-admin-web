'use strict'

const accessLog = require('kth-node-access-log')
const config = require('../configuration').full
const server = require('../../server')

server.use(accessLog(config.logging.accessLog))
