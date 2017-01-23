'use strict'

/**
 * Initialize all our middleware. Because of how Express chains its
 * middleware and routing the ordering here is important.
 */

const log = require('kth-node-log')

require('./crawlerRedirect')
require('./accessLog')
require('./staticFiles')

require('./session')
require('./parsers')
// casAuthentication should be as early as possible but needs parsers and session
require('./casAuthentication')
require('./language')

require('./cortina')

log.info('Middleware initialized')
