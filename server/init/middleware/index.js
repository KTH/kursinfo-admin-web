'use strict'

/**
 * Initialize all our middleware. Because of how Express chains its
 * middleware and routing the ordering here is important.
 */

const log = require('kth-node-log')

require('./crawlerRedirect')
require('./session')
require('./parsers')
require('./language')
require('./accessLog')

// The standard css transpiler is Sass but you can easily switch here
// OBS that with the current code you can't run Sass and Less at the same time
require('./sass')

require('./routing')
require('./casAuthentication')
require('./cortina')

log.info('Middleware initialized')
