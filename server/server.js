/* eslint-disable import/newline-after-import */
/* eslint-disable import/order */
const server = require('kth-node-server')

// Now read the server config etc.
const config = require('./configuration').server
require('./api')
const AppRouter = require('kth-node-express-routing').PageRouter
const { getPaths } = require('kth-node-express-routing')

if (config.appInsights && config.appInsights.instrumentationKey) {
  const appInsights = require('applicationinsights')
  appInsights
    .setup(config.appInsights.instrumentationKey)
    .setAutoDependencyCorrelation(true)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectConsole(true)
    .start()
}

// Expose the server and paths
server.locals.secret = new Map()
module.exports = server
module.exports.getPaths = () => getPaths()

const _addProxy = uri => `${config.proxyPrefixPath.uri}${uri}`

/* ***********************
 * ******* LOGGING *******
 * ***********************
 */
const log = require('kth-node-log')
const packageFile = require('../package.json')

const logConfiguration = {
  name: packageFile.name,
  app: packageFile.name,
  env: process.env.NODE_ENV,
  level: config.logging.log.level,
  console: config.logging.console,
  stdout: config.logging.stdout,
  src: config.logging.src,
}
log.init(logConfiguration)

/* **************************
 * ******* TEMPLATING *******
 * **************************
 */
const exphbs = require('express-handlebars')
const path = require('path')
server.set('views', path.join(__dirname, '/views'))
server.set('layouts', path.join(__dirname, '/views/layouts'))
server.set('partials', path.join(__dirname, '/views/partials'))
server.engine(
  'handlebars',
  exphbs({
    defaultLayout: 'publicLayout',
    layoutsDir: server.settings.layouts,
    partialsDir: server.settings.partials,
  })
)
server.set('view engine', 'handlebars')
// Register handlebar helpers
require('./views/helpers')

/* ******************************
 * ******* ACCESS LOGGING *******
 * ******************************
 */
const accessLog = require('kth-node-access-log')
server.use(accessLog(config.logging.accessLog))

/* ****************************
 * ******* STATIC FILES *******
 * ****************************
 */
const browserConfig = require('./configuration').browser
const browserConfigHandler = require('kth-node-configuration').getHandler(browserConfig, getPaths())
const express = require('express')
const compression = require('compression')
server.use(compression())

// helper
function setCustomCacheControl(res, extensionPath) {
  if (express.static.mime.lookup(extensionPath) === 'text/html') {
    // Custom Cache-Control for HTML files
    res.setHeader('Cache-Control', 'no-cache')
  }
}

// Files/statics routes--
// Map components HTML files as static content, but set custom cache control header, currently no-cache to force If-modified-since/Etag check.
server.use(
  _addProxy('/static/js/components'),
  express.static('./dist/js/components', { setHeaders: setCustomCacheControl })
)
// Expose browser configurations
server.use(_addProxy('/static/browserConfig'), browserConfigHandler)
// Map Bootstrap.
// server.use(_addProxy('/static/bootstrap'), express.static('./node_modules/bootstrap/dist'))
// Map kth-style.
server.use(_addProxy('/static/kth-style'), express.static('./node_modules/kth-style/dist')) // Map static content like images, css and js.
server.use(_addProxy('/static'), express.static('./dist'))
// Return 404 if static file isn't found so we don't go through the rest of the pipeline
server.use(_addProxy('/static'), (req, res, next) => {
  const error = new Error('File not found: ' + req.originalUrl)
  error.statusCode = 404
  next(error)
})

// QUESTION: Should this really be set here?
// http://expressjs.com/en/api.html#app.set
server.set('case sensitive routing', true)

/* *******************************
 * ******* REQUEST PARSING *******
 * *******************************
 */
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 1000000 }))
server.use(cookieParser())

/* ***********************
 * ******* SESSION *******
 * ***********************
 */
const session = require('kth-node-session')
const options = config.session
options.sessionOptions.secret = config.sessionSecret
server.use(session(options))

/* ************************
 * ******* LANGUAGE *******
 * ************************
 */
const { languageHandler } = require('kth-node-web-common/lib/language')
server.use(config.proxyPrefixPath.uri, languageHandler)

/* ******************************
 ***** AUTHENTICATION - OIDC ****
 ****************************** */

const passport = require('passport')

server.use(passport.initialize())
server.use(passport.session())

passport.serializeUser((user, done) => {
  if (user) {
    done(null, user)
  } else {
    done()
  }
})

passport.deserializeUser((user, done) => {
  if (user) {
    done(null, user)
  } else {
    done()
  }
})

const { OpenIDConnect, hasGroup } = require('@kth/kth-node-passport-oidc')

const oidc = new OpenIDConnect(server, passport, {
  ...config.oidc,
  callbackLoginRoute: _addProxy('/auth/login/callback'),
  callbackLogoutRoute: _addProxy('/auth/logout/callback'),
  callbackSilentLoginRoute: _addProxy('/auth/silent/callback'),
  defaultRedirect: _addProxy(''),
  failureRedirect: _addProxy(''),
  // eslint-disable-next-line no-unused-vars
  extendUser: (user, claims) => {
    const { kthid, memberOf } = claims
    // eslint-disable-next-line no-param-reassign
    user.isSuperUser = hasGroup(config.auth.superuserGroup, user)
    // eslint-disable-next-line no-param-reassign
    user.ugKthid = kthid
    // eslint-disable-next-line no-param-reassign
    user.memberOf = memberOf
  },
})

// eslint-disable-next-line no-unused-vars
server.get(_addProxy('/login'), oidc.login, (req, res, next) => res.redirect(_addProxy('')))

// eslint-disable-next-line no-unused-vars
server.get(_addProxy('/logout'), oidc.logout)
/* ******************************
 * ******* CORTINA BLOCKS *******
 * ******************************
 */
server.use(
  config.proxyPrefixPath.uri,
  require('kth-node-web-common/lib/web/cortina')({
    blockUrl: config.blockApi.blockUrl,
    proxyPrefixPath: config.proxyPrefixPath.uri,
    hostUrl: config.hostUrl,
    redisConfig: config.cache.cortinaBlock.redis,
  })
)

/* ********************************
 * ******* CRAWLER REDIRECT *******
 * ********************************
 */
const excludePath = _addProxy('(?!/static).*')
const excludeExpression = new RegExp(excludePath)
server.use(
  excludeExpression,
  require('kth-node-web-common/lib/web/crawlerRedirect')({
    hostUrl: config.hostUrl,
  })
)

/* ********************************
 * ******* FILE UPLOAD*******
 * ********************************
 */

const fileUpload = require('express-fileupload')
server.use(fileUpload())

/* **********************************
 * ******* APPLICATION ROUTES *******
 * **********************************
 */
const { System, SellingInfo, AdminPagesCtrl, StatisticPageCtrl } = require('./controllers')
// use own requireRole because it has better error and role management
const { requireRole } = require('./requireRole')

// System routes
const systemRoute = AppRouter()
systemRoute.get('system.monitor', _addProxy('/_monitor'), System.monitor)
systemRoute.get('system.about', _addProxy('/_about'), System.about)
systemRoute.get('system.paths', _addProxy('/_paths'), System.paths)
systemRoute.get('system.robots', '/robots.txt', System.robotsTxt)
server.use('/', systemRoute.getRouter())

// Statistic routes
const statisticRoute = AppRouter()
statisticRoute.get('statistic.getData', _addProxy('/statistik/:semester'), oidc.silentLogin, StatisticPageCtrl.getData)
server.use('/', statisticRoute.getRouter())

// App routes
const appRoute = AppRouter()

appRoute.get('course.myCourses', _addProxy('/:courseCode/myCourses'), oidc.silentLogin, SellingInfo.myCourses)
appRoute.get(
  'course.getAdminStart',
  _addProxy('/:courseCode'),
  oidc.login,
  requireRole('isCourseResponsible', 'isExaminator', 'isCourseTeacher', 'isSuperUser'),
  AdminPagesCtrl.getAdminStart
)
appRoute.get(
  'course.editDescription',
  _addProxy('/edit/:courseCode'),
  oidc.login,
  requireRole('isCourseResponsible', 'isExaminator', 'isSuperUser'),
  SellingInfo.getDescription
)
appRoute.post(
  'course.updateDescription',
  _addProxy('/api/:courseCode/'),
  oidc.login,
  requireRole('isCourseResponsible', 'isExaminator', 'isSuperUser'),
  SellingInfo.updateDescription
)
// File upload for a course picture
appRoute.post(
  'storage.saveImage',
  _addProxy('/storage/saveImage/:courseCode/:published'),
  SellingInfo.saveImageToStorage
)
appRoute.get(
  'system.gateway',
  _addProxy('/silent'),
  oidc.silentLogin,
  requireRole('isCourseResponsible', 'isExaminator', 'isSuperUser'),
  SellingInfo.getDescription
)

server.use('/', appRoute.getRouter())

// Not found etc
server.use(System.notFound)
server.use(System.final)

// Register handlebar helpers
require('./views/helpers')
