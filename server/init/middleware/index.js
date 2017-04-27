'use strict'

/**
 * Initialize all our middleware. Because of how Express chains its
 * middleware and routing the ordering here is important.
 */

const log = require('kth-node-log')

require('./accessLog')

require('./session')
require('./parsers')
// casAuthentication should be as early as possible but needs parsers and session
require('./casAuthentication')

log.info('Middleware initialized')
