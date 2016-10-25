'use strict'

/**
 * Run all initialization.
 * Because of how Express chains middleware and routing, the ordering
 * here is important.
 */

const log = require('kth-node-log')
const server = require('../server')
const controllers = require('../controllers')

/**
 * Initialization of configuration is handled by fetching the return value.
 * This is done because we need the configuration to be loaded to be able
 * to initialize everything else and to be able to start the server.
 * By fetching the return value we are making sure that the loading of
 * the configuration has been completed before moving on.
 */

require('./logging')
require('./authentication')
require('./templating')
require('./languages')
require('./middleware')
require('./routing')
require('./api')

/**
 * Final fallback when all routes fail. This needs to be the last middleware added
 * so it doesn't replace valid routing.
 */
server.use(controllers.System.notFound)
server.use(controllers.System.final)

log.info('Server initialization done')
