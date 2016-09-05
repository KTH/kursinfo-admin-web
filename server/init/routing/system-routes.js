'use strict'

const controllers = require('../../controllers')
const paths = require('./paths')
const routing = require('./routing')

/**
 * Routes for system functions - about/monitor/etc
 */
routing.route(paths.system.robots, controllers.System.robotsTxt)
routing.route(paths.system.about, controllers.System.about)
routing.route(paths.system.monitor, controllers.System.monitor)
routing.route(paths.system.paths, controllers.System.paths)
