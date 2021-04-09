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
  config.proxyPrefixPath.uri + '/static/js/components',
  express.static('./dist/js/components', { setHeaders: setCustomCacheControl })
)
// Expose browser configurations
server.use(config.proxyPrefixPath.uri + '/static/browserConfig', browserConfigHandler)
// Map Bootstrap.
// server.use(config.proxyPrefixPath.uri + '/static/bootstrap', express.static('./node_modules/bootstrap/dist'))
// Map kth-style.
server.use(config.proxyPrefixPath.uri + '/static/kth-style', express.static('./node_modules/kth-style/dist')) // Map static content like images, css and js.
server.use(config.proxyPrefixPath.uri + '/static', express.static('./dist'))
// Return 404 if static file isn't found so we don't go through the rest of the pipeline
server.use(config.proxyPrefixPath.uri + '/static', (req, res, next) => {
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
 * ******* AUTHENTICATION *******
 * ******************************
 */
const passport = require('passport')
// const ldapClient = require('./adldapClient')
const {
  authLoginHandler,
  authCheckHandler,
  logoutHandler,
  pgtCallbackHandler,
  serverLogin,
  getServerGatewayLogin,
} = require('kth-node-passport-cas').routeHandlers({
  casLoginUri: config.proxyPrefixPath.uri + '/login',
  casGatewayUri: config.proxyPrefixPath.uri + '/loginGateway',
  proxyPrefixPath: config.proxyPrefixPath.uri,
  server,
  cookieTimeout: config.cas.cookieTimeout,
})
const { redirectAuthenticatedUserHandler } = require('./authentication')
server.use(passport.initialize())
server.use(passport.session())

const authRoute = AppRouter()
authRoute.get('cas.login', config.proxyPrefixPath.uri + '/login', authLoginHandler, redirectAuthenticatedUserHandler)
authRoute.get(
  'cas.gateway',
  config.proxyPrefixPath.uri + '/loginGateway',
  authCheckHandler,
  redirectAuthenticatedUserHandler
)
authRoute.get('cas.logout', config.proxyPrefixPath.uri + '/logout', logoutHandler)
// Optional pgtCallback (use config.cas.pgtUrl?)
authRoute.get('cas.pgtCallback', config.proxyPrefixPath.uri + '/pgtCallback', pgtCallbackHandler)
server.use('/', authRoute.getRouter())

// Convenience methods that should really be removed
server.login = serverLogin
server.gatewayLogin = getServerGatewayLogin

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
const excludePath = config.proxyPrefixPath.uri + '(?!/static).*'
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
const { requireRole } = require('./authentication')

// System routes
const systemRoute = AppRouter()
systemRoute.get('system.monitor', config.proxyPrefixPath.uri + '/_monitor', System.monitor)
systemRoute.get('system.about', config.proxyPrefixPath.uri + '/_about', System.about)
systemRoute.get('system.paths', config.proxyPrefixPath.uri + '/_paths', System.paths)
systemRoute.get('system.robots', '/robots.txt', System.robotsTxt)
server.use('/', systemRoute.getRouter())

// Statistic routes
const statisticRoute = AppRouter()
statisticRoute.get(
  'statistic.getData',
  config.proxyPrefixPath.uri + '/statistik/:semester',
  getServerGatewayLogin(),
  StatisticPageCtrl.getData
) // requireRole('isSuperUser'),
server.use('/', statisticRoute.getRouter())

// App routes
const appRoute = AppRouter()

appRoute.get(
  'course.myCourses',
  config.proxyPrefixPath.uri + '/:courseCode/myCourses',
  getServerGatewayLogin(),
  SellingInfo.myCourses
)
appRoute.get(
  'course.getAdminStart',
  config.proxyPrefixPath.uri + '/:courseCode',
  serverLogin,
  requireRole('isCourseResponsible', 'isExaminator', 'isCourseTeacher', 'isSuperUser'),
  AdminPagesCtrl.getAdminStart
)
appRoute.get(
  'course.editDescription',
  config.proxyPrefixPath.uri + '/edit/:courseCode',
  serverLogin,
  requireRole('isCourseResponsible', 'isExaminator', 'isSuperUser'),
  SellingInfo.getDescription
)
appRoute.post(
  'course.updateDescription',
  config.proxyPrefixPath.uri + '/api/:courseCode/',
  serverLogin,
  requireRole('isCourseResponsible', 'isExaminator', 'isSuperUser'),
  SellingInfo.updateDescription
)
// File upload for a course picture
appRoute.post(
  'storage.saveImage',
  config.proxyPrefixPath.uri + '/storage/saveImage/:courseCode/:published',
  SellingInfo.saveImageToStorage
)
appRoute.get(
  'system.gateway',
  config.proxyPrefixPath.uri + '/gateway',
  getServerGatewayLogin('/'),
  requireRole('isCourseResponsible', 'isExaminator', 'isSuperUser'),
  SellingInfo.getDescription
)

server.use('/', appRoute.getRouter())

// Not found etc
server.use(System.notFound)
server.use(System.final)

// Register handlebar helpers
require('./views/helpers')
