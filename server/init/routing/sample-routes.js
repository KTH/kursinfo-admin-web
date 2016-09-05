'use strict'

const controllers = require('../../controllers')
const paths = require('./paths')
const routing = require('./routing')

/**
 * Routes for system functions - about/monitor/etc
 */
routing.route(paths.system.index, controllers.Sample.getIndex)
