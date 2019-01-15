'use strict'

const api = require('../api')
// const sanitize = require('sanitize-html')

const co = require('co')
const log = require('kth-node-log')
const language = require('kth-node-web-common/lib/language')
const { safeGet } = require('safe-utils')
const { createElement } = require('inferno-create-element')
const { renderToString } = require('inferno-server')
const { StaticRouter, BrowserRouter } = require('inferno-router')
const { toJS } = require('mobx')
const InfernoServer = require('inferno-server')

const browserConfig = require('../configuration').browser
const serverConfig = require('../configuration').server

let { appFactory, doAllAsyncBefore } = require('../../dist/js/server/app.js')

module.exports = {
  getDescription: _getDescription,
  updateDescription: _updateDescription
  // reviewDescription: _reviewDescription
}

const paths = require('../server').getPaths()

async function _getDescription (req, res, next) {
  if (process.env['NODE_ENV'] === 'development') {
    delete require.cache[require.resolve('../../dist/js/server/app.js')]
    const tmp = require('../../dist/js/server/app.js')
    appFactory = tmp.appFactory
    doAllAsyncBefore = tmp.doAllAsyncBefore
  }
  const courseCode = req.params.courseCode
  let lang = language.getLanguage(res) || 'sv'

  try {
    // like getItem function in adminClien.JS
    const client = api.nodeApi.client
    const paths = api.nodeApi.paths
    const respSellingText = await client.getAsync(client.resolve(paths.getSellingTextByCourseCode.uri, { courseCode }), { useCache: true })
    // Render inferno app
    const context = {}
    const renderProps = createElement(StaticRouter, {
      location: req.url,
      context
    }, appFactory())

    console.log('==========================RENDER PROPS=========================', renderProps)

    await renderProps.props.children.props.adminStore.getCourseRequirementFromKopps(courseCode, lang)
    console.log('PATHPATHPATHPATH', paths)
    renderProps.props.children.props.adminStore.addSellingText(respSellingText.body.sellingText)
    renderProps.props.children.props.adminStore.setBrowserConfig(browserConfig, paths, serverConfig.hostUrl)
    renderProps.props.children.props.adminStore.__SSR__setCookieHeader(req.headers.cookie)

    // await doAllAsyncBefore({
    //   pathname: req.originalUrl,
    //   query: (req.originalUrl === undefined || req.originalUrl.indexOf('?') === -1) ? undefined : req.originalUrl.substring(req.originalUrl.indexOf('?'), req.originalUrl.length),
    //   adminStore: renderProps.props.children.props.adminStore,
    //   routes: renderProps.props.children.props.children.props.children.props.children
    // })
    const html = renderToString(renderProps)

    res.render('course/index', {
      debug: 'debug' in req.query,
      html: html,
      paths: JSON.stringify(paths),
      initialState: JSON.stringify(hydrateStores(renderProps))
      // data: respSellingText.statusCode === 200 ? safeGet(() => { return respSellingText.body.sellingText }) : ''
      // error: resp.statusCode !== 200 ? safeGet(() => { return resp.body.message }) : ''
    })
  } catch (err) {
    log.error('Error in _getDescription', { error: err })
    next(err)
  }
}

async function _updateDescription (req, res, next) {
  try {
    const client = api.nodeApi.client
    const apipaths = api.nodeApi.paths

    const result = await client.postAsync({
      uri: client.resolve(apipaths.postSellingTextByCourseCode.uri, {courseCode: req.params.courseCode}),
      body: {sellingText: req.body.sellingText},
      useCache: false
    })
    // TODO: fix what to do if there is a validation error
    if (safeGet(() => result.body.message)) {
      log.error('Error from API: ', result.body.message)
      // throw new Error(result.body.message)
    }
    log.info('Selling text updated in kursinfo api')
    return res.json(result)
  } catch (err) {
    log.error('Error in _updateDescription', { error: err })
    next(err)
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
  console.log('hydrateStores', outp)
  return outp
}
