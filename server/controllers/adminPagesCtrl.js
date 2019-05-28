'use strict'

// const sanitize = require('sanitize-html')
const { koppsCourseData } = require('../koppsApi')
const co = require('co')
const log = require('kth-node-log')
const language = require('kth-node-web-common/lib/language')
const { createElement } = require('inferno-create-element')
const { renderToString } = require('inferno-server')
const { StaticRouter } = require('inferno-router')
const { toJS } = require('mobx')
const browserConfig = require('../configuration').browser
const serverConfig = require('../configuration').server

let { appFactory, doAllAsyncBefore } = require('../../dist/js/server/app.js')

module.exports = {
  getAdminStart: co.wrap(_getAdminStart),
  getKoppsCourseData: co.wrap(_getKoppsCourseData)
}

const serverPaths = require('../server').getPaths()

async function _getAdminStart (req, res, next) {
  if (process.env['NODE_ENV'] === 'development') {
    delete require.cache[require.resolve('../../dist/js/server/app.js')]
    const tmp = require('../../dist/js/server/app.js')
    appFactory = tmp.appFactory
    doAllAsyncBefore = tmp.doAllAsyncBefore
  }
  const courseCode = req.params.courseCode
  let lang = language.getLanguage(res) || 'sv'

  try {
    // Render inferno app
    const context = {}
    const renderProps = createElement(StaticRouter, {
      location: req.url,
      context
    }, appFactory())
    // setBrowserConfig should be first because of setting paths for other next functions
    // Load browserConfig and server paths for internal api
    renderProps.props.children.props.adminStore.setBrowserConfig(browserConfig, serverPaths, serverConfig.hostUrl)
    renderProps.props.children.props.adminStore.__SSR__setCookieHeader(req.headers.cookie)
    // Load koppsData
    await renderProps.props.children.props.adminStore.getCourseRequirementFromKopps(courseCode, lang)
    await doAllAsyncBefore({
      pathname: req.originalUrl,
      query: (req.originalUrl === undefined || req.originalUrl.indexOf('?') === -1) ? undefined : req.originalUrl.substring(req.originalUrl.indexOf('?'), req.originalUrl.length),
      adminStore: renderProps.props.children.props.adminStore,
      routes: renderProps.props.children.props.children.props.children.props.children
    })
    const html = renderToString(renderProps)
    res.render('course/index', {
      debug: 'debug' in req.query,
      instrumentationKey: serverConfig.appInsights.instrumentationKey,
      title: courseCode + 'ADMIN',
      html: html,
      paths: JSON.stringify(serverPaths),
      initialState: JSON.stringify(hydrateStores(renderProps))
    })
  } catch (error) {
    log.error('Error in _getAdminStart', { error })
    next(error)
  }
}

function * _getKoppsCourseData (req, res, next) {
  const courseCode = req.params.courseCode
  try {
    const apiResponse = yield koppsCourseData(courseCode)
    return res.json(apiResponse)
  } catch (error) {
    log.error('Exception calling from koppsAPI  in _getKoppsCourseData', { error })
    next(error)
  }
}

function hydrateStores (renderProps) {
  // This assumes that all stores are specified in a root element called Provider

  const props = renderProps.props.children.props
  const outp = {}
  for (let key in props) {
    if (typeof props[key].initializeStore === 'function') {
      outp[key] = encodeURIComponent(JSON.stringify(toJS(props[key], true)))
    }
  }
  return outp
}
