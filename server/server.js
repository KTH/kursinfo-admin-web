/* eslint-disable import/newline-after-import */
/* eslint-disable import/order */
const server = require('@kth/server')

// Now read the server config etc.
const config = require('./configuration').server
require('./api')
const AppRouter = require('kth-node-express-routing').PageRouter
const { getPaths } = require('kth-node-express-routing')
const { cortinaMiddleware } = require('@kth/cortina-block')

// Expose the server and paths
server.locals.secret = new Map()
module.exports = server
module.exports.getPaths = () => getPaths()

const _addProxy = uri => `${config.proxyPrefixPath.uri}${uri}`

/* ***********************
 * ******* LOGGING *******
 * ***********************
 */
const log = require('@kth/log')
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
  exphbs.engine({
    defaultLayout: 'publicLayout',
    layoutsDir: server.settings.layouts,
    partialsDir: server.settings.partials,
    // !!!! Extended so differ from node-web
    helpers: { isUnauthorized: statusCode => statusCode === 403 || statusCode === '403' },
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

// Removes the "X-Powered-By: Express header" that shows the underlying Express framework
server.disable('x-powered-by')

// helper
// Files/statics routes--
const staticOption = { maxAge: 365 * 24 * 3600 * 1000 } // 365 days in ms is maximum

// Expose browser configurations
server.use(_addProxy('/static/browserConfig'), browserConfigHandler)

// Files/statics routes
server.use(_addProxy('/static/kth-style'), express.static('./node_modules/kth-style/dist', staticOption))
server.use(_addProxy('/assets'), express.static('./node_modules/@kth/style/assets', staticOption))

// Map static content like images, css and js.
server.use(_addProxy('/static'), express.static('./dist', staticOption))

server.use(_addProxy('/static/icon/favicon'), express.static('./public/favicon.ico', staticOption))

// Return 404 if static file isn't found so we don't go through the rest of the pipeline
server.use(_addProxy('/static'), (req, res, next) => {
  const error = new Error('File not found: ' + req.originalUrl)
  error.status = 404
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
server.use(bodyParser.json({ limit: '50mb' }))
server.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 1000000 }))
server.use(cookieParser())

/* ***********************
 * ******* SESSION *******
 * ***********************
 */
const session = require('@kth/session')
const options = config.session
options.sessionOptions.secret = config.sessionSecret
server.use(session(options))

/* ************************
 * ******* LANGUAGE *******
 * ************************
 */
const { languageHandler } = require('@kth/kth-node-web-common/lib/language')
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

const { OpenIDConnect } = require('@kth/kth-node-passport-oidc')

const oidc = new OpenIDConnect(server, passport, {
  ...config.oidc,
  callbackLoginRoute: _addProxy('/auth/login/callback'),
  callbackLogoutRoute: _addProxy('/auth/logout/callback'),
  callbackSilentLoginRoute: _addProxy('/auth/silent/callback'),
  defaultRedirect: _addProxy(''),
  failureRedirect: _addProxy(''),
  extendUser: (user, claims) => {
    const { kthid, memberOf } = claims

    user.kthId = kthid

    user.isSuperUser = memberOf.includes(config.auth.superuserGroup)
    user.isKursinfoAdmin = memberOf.includes(config.auth.kursinfoAdmins)

    user.memberOf = typeof memberOf === 'string' ? [memberOf] : memberOf
  },
})

// eslint-disable-next-line no-unused-vars
server.get(_addProxy('/login'), oidc.login, (req, res, next) => res.redirect(_addProxy('')))

server.get(_addProxy('/logout'), oidc.logout)
/* ******************************
 * ******* CORTINA BLOCKS *******
 * ******************************
 */
server.use(
  config.proxyPrefixPath.uri,
  cortinaMiddleware({
    blockApiUrl: config.blockApi.blockUrl,
    redisConfig: config.cache.cortinaBlock.redis,
    blocksConfig: config.blockApi.addBlocks,
    redisKey: config.cache.cortinaBlock.redisKey,
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
  require('@kth/kth-node-web-common/lib/web/crawlerRedirect')({
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
const {
  NoCourseCodeCtrl,
  System,
  AdminPagesCtrl,
  ImageCtrl,
  EditCourseStartCtrl,
  DescriptionCtrl,
  OtherInformationCtrl,
  RecommendedPrerequisitesCtrl,
} = require('./controllers')
// use own requireRole because it has better error and role management
const { requireRole } = require('./requireRole')

// System routes
const systemRoute = AppRouter()
systemRoute.get('system.monitor', _addProxy('/_monitor'), System.monitor)
systemRoute.get('system.home', _addProxy('/'), NoCourseCodeCtrl.getIndex)
systemRoute.get('system.about', _addProxy('/_about'), System.about)
systemRoute.get('system.paths', _addProxy('/_paths'), System.paths)
systemRoute.get('system.robots', '/robots.txt', System.robotsTxt)
server.use('/', systemRoute.getRouter())

// App routes
const appRoute = AppRouter()

appRoute.get('course.allImagesCheck', _addProxy('/_monitor_images'), AdminPagesCtrl.monitorImages)

appRoute.get(
  'course.getAdminStart',
  _addProxy('/:courseCode'),
  oidc.login,
  requireRole(
    'isCourseCoordinator',
    'isExaminer',
    'isCourseTeacher',
    'isSuperUser',
    'isKursinfoAdmin',
    'isSchoolAdmin'
  ),
  AdminPagesCtrl.getAdminStart
)

// Start of course editing
appRoute.get(
  'course.editStartPage',
  _addProxy('/edit/:courseCode'),
  oidc.login,
  requireRole('isCourseCoordinator', 'isExaminer', 'isSuperUser', 'isKursinfoAdmin', 'isSchoolAdmin'),
  EditCourseStartCtrl.getEditCourseStart
)

// Description
appRoute.get(
  'course.editDescription',
  _addProxy('/edit/:courseCode/description'),
  oidc.login,
  requireRole('isCourseCoordinator', 'isExaminer', 'isSuperUser', 'isKursinfoAdmin', 'isSchoolAdmin'),
  DescriptionCtrl.getDescription
)
appRoute.post(
  'course.updateDescription',
  _addProxy('/edit/:courseCode/description'),
  oidc.login,
  requireRole('isCourseCoordinator', 'isExaminer', 'isSuperUser', 'isKursinfoAdmin', 'isSchoolAdmin'),
  DescriptionCtrl.updateDescription
)

// File upload for a course picture
appRoute.post(
  'storage.saveImage',
  _addProxy('/storage/saveImage/:courseCode/:published'),
  oidc.silentLogin,
  requireRole('isCourseCoordinator', 'isExaminer', 'isSuperUser', 'isKursinfoAdmin', 'isSchoolAdmin'),
  ImageCtrl.saveImageToStorage
)

// Other information
appRoute.get(
  'course.editOtherInformation',
  _addProxy('/edit/:courseCode/otherInformation'),
  oidc.login,
  requireRole('isCourseCoordinator', 'isExaminer', 'isSuperUser', 'isKursinfoAdmin', 'isSchoolAdmin'),
  OtherInformationCtrl.getOtherInformation
)
appRoute.post(
  'course.updateOtherInformation',
  _addProxy('/api/:courseCode/otherInformation'),
  oidc.login,
  requireRole('isCourseCoordinator', 'isExaminer', 'isSuperUser', 'isKursinfoAdmin', 'isSchoolAdmin'),
  OtherInformationCtrl.updateOtherInformation
)
// Recommended prerequisites
appRoute.get(
  'course.editRecommendedPrerequisites',
  _addProxy('/edit/:courseCode/recommendedPrerequisites'),
  oidc.login,
  requireRole('isCourseCoordinator', 'isExaminer', 'isSuperUser', 'isKursinfoAdmin', 'isSchoolAdmin'),
  RecommendedPrerequisitesCtrl.getRecommendedPrerequisites
)
appRoute.post(
  'course.updateRecommendedPrerequisites',
  _addProxy('/api/:courseCode/recommendedPrerequisites'),
  oidc.login,
  requireRole('isCourseCoordinator', 'isExaminer', 'isSuperUser', 'isKursinfoAdmin', 'isSchoolAdmin'),
  RecommendedPrerequisitesCtrl.updateRecommendedPrerequisites
)

server.use('/', appRoute.getRouter())

// Not found etc
server.use(System.notFound)
server.use(System.final)

// Register handlebar helpers
require('./views/helpers')
