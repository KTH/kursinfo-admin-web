'use strict'

const api = require('../api')
const co = require('co')
const log = require('kth-node-log')
const language = require('kth-node-web-common/lib/language')
const { safeGet } = require('safe-utils')
const { createElement } = require('inferno-create-element')
const { renderToString } = require('inferno-server')
const { StaticRouter, BrowserRouter } = require('inferno-router')
const { toJS } = require('mobx')

const browserConfig = require('../configuration').browser
const serverConfig = require('../configuration').server

let { appFactory, doAllAsyncBefore } = require('../../dist/js/server/app.js')


module.exports = {
  getIndex: getIndex
}

const paths = require('../server').getPaths()

 async function  getIndex (req, res, next) {
  /*if (process.env['NODE_ENV'] === 'development') {
    delete require.cache[require.resolve('../../dist/js/server/app.js')]
    const tmp = require('../../dist/js/server/app.js')
    appFactory = tmp.appFactory
    doAllAsyncBefore = tmp.doAllAsyncBefore
  }
  const courseCode = req.params.courseCode
  let lang = language.getLanguage(res) || 'sv'

  try {
    const client = api.nodeApi.client
    const paths = api.nodeApi.paths
   // const resp = yield client.getAsync(client.resolve(paths.getDataById.uri, { id: '123' }), { useCache: true })

  // Render inferno app
  const context = {}
  const renderProps = createElement(StaticRouter, {
    location: req.url,
    context
  }, appFactory())

  await renderProps.props.children.props.routerStore.getCourseInformation(courseCode, lang)
  renderProps.props.children.props.routerStore.setBrowserConfig(browserConfig, paths, serverConfig.hostUrl)
  renderProps.props.children.props.routerStore.__SSR__setCookieHeader(req.headers.cookie)

  // console.log("!!renderProps!!", renderProps)
  await doAllAsyncBefore({
    pathname: req.originalUrl,
    query: (req.originalUrl === undefined || req.originalUrl.indexOf('?') === -1) ? undefined : req.originalUrl.substring(req.originalUrl.indexOf('?'), req.originalUrl.length),
    routerStore: renderProps.props.children.props.routerStore,
    routes: renderProps.props.children.props.children.props.children.props.children
  })
  const html = renderToString(renderProps)*/
  const html = "Kurskod saknas."

    res.render('noCourse/index', {
      debug: 'debug' in req.query,
      html:html
    ,initialState: "Ingen kurskod"//JSON.stringify(hydrateStores(renderProps))
      //data: resp.statusCode === 200 ? safeGet(() => { return resp.body.name }) : '',
      //error: resp.statusCode !== 200 ? safeGet(() => { return resp.body.message }) : ''
    })
  /*} catch (err) {
    log.error('Error in getIndex', { error: err })
    next(err)
  }*/
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
  console.log("hydrateStores", outp)
  return outp
}
