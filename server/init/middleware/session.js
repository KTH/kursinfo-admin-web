'use strict'

const session = require('kth-node-session')
const config = require('../configuration')
const server = require('../../server')
const log = require('kth-node-log')

const options = config.full.session
options.sessionOptions.secret = config.secure.sessionSecret
server.use(session(options))
log.info('Session initialized')
