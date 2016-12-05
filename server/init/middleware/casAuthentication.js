'use strict'

const passport = require('passport')
const config = require('../configuration')
const log = require('kth-node-log')
const ldap = require('../../util/adldap')
const server = require('../../server')
const paths = require('../routing/paths')

/**
 * In a Express-based application, passport.initialize() middleware is required to initialize Passport.
 * If your application uses persistent login sessions, passport.session() middleware must also be used.
 */
server.use(passport.initialize())

/**
 * In a typical web application, the credentials used to authenticate a user will only be transmitted during the
 * login request. If authentication succeeds, a session will be established and maintained via a cookie set
 * in the user's browser.

 * Each subsequent request will not contain credentials, but rather the unique cookie that identifies the session.
 * In order to support login sessions, Passport will serialize and deserialize user instances to and from the session.
 */
server.use(passport.session())

/**
 * GET request to the login path E.g /login
 */
server.use(paths.cas.login.uri, function (req, res, next) {
  log.debug({ req: req }, '/login called, user: ' + req.user)

  /**
   * Authenticating requests is as simple as calling passport.authenticate() and specifying which strategy to employ.
   * authenticate()'s function signature is standard Connect middleware, which makes it convenient to use as
   * route middleware in Express applications.
   */
  passport.authenticate('cas',

    /*
     * Custom Callback for success. If the built-in options are not sufficient for handling an authentication request,
     * a custom callback can be provided to allow the application to handle success or failure.
     */
    function (err, user, info) {
      if (err) {
        return next(err)
      }

      if (!user) {
        log.debug('No user found, redirecting to /login')
        return res.redirect(paths.cas.login.uri)
      }

      req.logIn(user, function (err) {
        if (err) {
          return next(err)
        }
        try {
          // Redirects the authenticated user based on the user group membership.
          log.debug('Redirects the authenticated user based on the user group membership')
          ldap.redirectAuthenticatedUser(user, res, req, info.pgtIou)
        } catch (err) {
          log.debug('Could not redirect the authenticated user based on the user group membership')
          return next(err)
        }
      })
    }
  )(req, res, next)
})

server.get(paths.cas.gateway.uri, function (req, res, next) {
  passport.authenticate('cas-gateway', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/error'
  }, function (err, user, info) {
    if (err) {
      return next(err)
    }

    req.logIn(user, function (err) {
      if (err) {
        return next(err)
      }

      if (user === 'anonymous-user') {
        res.redirect(req.query['nextUrl'])
        return
      }

      try {
        ldap.redirectAuthenticatedUser(user, res, req, info && info.pgtIou)
      } catch (err) {
        next(err)
      }
    })
  })(req, res, next)
})

/**
 * Logout from application.
 */
server.get(paths.cas.logout.uri, function (req, res) {
  req.logout()

  try {
    delete req.session.ldapDisplayName
    delete req.session.ldapUserName
    delete req.session.ldapEmail
    log.info({ req: req }, 'Log out, destroying session on logout')
  } catch (error) {
    log.info({ req: req, err: error }, 'Error destroying session on logout')
  }

  res.redirect('/')
})

// setup handler for pgtCallback
if (paths.cas.pgtCallback && paths.cas.pgtCallback.uri) {
  log.debug('Adding CAS pgtCallback')
  server.get(paths.cas.pgtCallback.uri, function (req, res) {
    log.debug('CAS pgtCallback')
    if (req.query.pgtIou !== undefined) {
      server.locals.secret[ req.query.pgtIou ] = req.query.pgtId
    }
    res.end('OK')
  })
}

/**
 * Check if the user is logged in. If logged in, pass to next,
 * else redirect to the login server.
 *
 * Setting config value ldap.authorizeUser to false will disable
 * authorization, any logged in user will gain access
 */
server.login = function (req, res, next) {
  log.debug({ session: req.session }, 'Login function called. User: ' + req.user)

  if (req.user && req.user === 'anonymous-user') {
    req.user = undefined
  }

  if (req.user) {
    log.debug('req.user: ' + JSON.stringify(req.user))
    if (req.session.ldapUserName) {
      log.info({ req: req }, 'User logged in, found ldap user: ' + req.session.ldapUserName)
      next()
    } else {
      log.info('unable to find ldap user: ' + req.user)
      res.statusCode = 403
      res.send('403 Not authorized for this resource')
    }
  } else {
    req.nextUrl = req.url
    log.debug('Next url: ' + req.nextUrl)
    return res.redirect(paths.cas.login.uri + '?nextUrl=' + encodeURIComponent(req.nextUrl))
  }
}

server.gatewayLogin = function (fallback) {
  return (req, res, next) => {
    if (req.session === undefined) {
      log.error('gatewayLogin: sessions unavailable')
      return next(new Error('sessions unavailable'))
    }

    if (req.session.gatewayAttempts >= 2) {
      log.debug('gatewayLogin: exhausted gateway attempts, allow access as anonymous user')
      log.debug({ session: req.session }, 'gatewayLogin: session')
      req.session.gatewayAttempts = 0 // reset gateway attempts to fix authentication for users not logged in the first time a cookie is set
      next()
      return
    }

    if (req.user) {
      log.debug('gatewayLogin: found user ' + req.user)
      next()
    } else {
      log.debug('gatewayLogin: no user, attempt gateway login')
      req.session.redirectTo = req.originalUrl
      req.session.fallbackTo = fallback
      res.redirect(paths.cas.gateway.uri + '?nextUrl=' + encodeURIComponent(req.originalUrl))
    }
  }
}

/**
 * Set up CAS authentication middleware for our protected routes
 */
for (let module in paths) {
  if (paths.hasOwnProperty(module)) {
    for (let route in paths[ module ]) {
      if (paths[ module ].hasOwnProperty(route)) {
        const path = paths[ module ][ route ]
        const verb = path.method.toLowerCase()

        if (path.cas === 'gateway') {
          server[ verb ](path.uri, server.gatewayLogin(path.fallback))
        } else if (path.cas) {
          log.debug('Authentication with CAS enforced for path: ' + JSON.stringify(path))
          server[ verb ](path.uri, server.login)
        }
      }
    }
  }
}
