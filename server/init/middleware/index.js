'use strict'

/**
 * Initialize all our middleware. Because of how Express chains its
 * middleware and routing the ordering here is important.
 */

const log = require('kth-node-log')

require('./crawlerRedirect')
require('./accessLog')
// The standard css transpiler is Sass but you can easily switch here
// NOTE! that with the current code you can't run Sass and Less at the same time
// Static resources should be handled first to avoid doing unnecessary work 
require('./sass')
require('./staticFiles')

require('./session')
require('./parsers')
// casAuthentication should be as early as possible but needs parsers and session
require('./casAuthentication')
require('./language')

require('./cortina')

log.info('Middleware initialized')
