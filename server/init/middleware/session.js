'use strict'

const session = require('kth-node-session')
const config = require('../configuration').server
const server = require('../../server')
const log = require('kth-node-log')

const options = config.session
options.sessionOptions.secret = config.sessionSecret
server.use(session(options))
log.info('Session initialized')
