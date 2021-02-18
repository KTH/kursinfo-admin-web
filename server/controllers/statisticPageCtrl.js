'use strict'

const log = require('kth-node-log')
const ReactDOMServer = require('react-dom/server')
const { toJS } = require('mobx')
const { fetchStatistic } = require('../statisticTransformer')
const browserConfig = require('../configuration').browser
const serverConfig = require('../configuration').server
const serverPaths = require('../server').getPaths()

function _staticRender(context, location) {
  if (process.env.NODE_ENV === 'development') {
    delete require.cache[require.resolve('../../dist/app.js')]
  }

  const { staticRender } = require('../../dist/app.js')

  return staticRender(context, location)
}

function hydrateStores(renderProps) {
  // This assumes that all stores are specified in a root element called Provider

  const { props } = renderProps.props.children
  const outp = {}
  for (const key in props) {
    if (typeof props[key].initializeStore === 'function') {
      outp[key] = encodeURIComponent(JSON.stringify(toJS(props[key], true)))
    }
  }
  return outp
}

async function getData(req, res, next) {
  const { semester } = req.params
  try {
    const renderProps = _staticRender()
    // setBrowserConfig should be first because of setting paths for other next functions
    // Load browserConfig and server paths for internal api
    renderProps.props.children.props.adminStore.setBrowserConfig(
      browserConfig,
      serverPaths,
      serverConfig.hostUrl
    )
    renderProps.props.children.props.adminStore.__SSR__setCookieHeader(req.headers.cookie)
    renderProps.props.children.props.adminStore.statisticData = await fetchStatistic(semester)
    const statistic = ReactDOMServer.renderToString(renderProps)

    res.render('course/index', {
      debug: 'debug' in req.query,
      html: statistic,
      paths: JSON.stringify(serverPaths),
      initialState: JSON.stringify(hydrateStores(renderProps)),
      title: 'Course Information Statistics ' + semester
    })
  } catch (err) {
    log.debug('Error in getData', { error: err })
    next(err)
  }
}

module.exports = {
  getData
}
