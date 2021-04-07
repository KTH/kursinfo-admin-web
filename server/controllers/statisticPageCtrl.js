'use strict'

const log = require('kth-node-log')
const language = require('kth-node-web-common/lib/language')
const ReactDOMServer = require('react-dom/server')
const { toJS } = require('mobx')
const { fetchStatistic } = require('../statisticTransformer')
const browserConfig = require('../configuration').browser
const serverConfig = require('../configuration').server
const serverPaths = require('../server').getPaths()
const i18n = require('../../i18n')

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
  const lang = language.getLanguage(res)
  const { semester = '0' } = req.params
  try {
    const validSemester = /^(19|20)\d{2}[1|2]$/
    if (!semester.match(validSemester)) {
      const error = new Error(i18n.message('error_invalid_semester', lang))
      error.status = 400
      throw error
    }
    const semesterAsNumber = parseInt(semester, 10)
    if (semesterAsNumber < 20191) {
      const error = new Error(i18n.message('error_invalid_semester_for_statistics', lang))
      error.status = 400
      throw error
    }
    const renderProps = _staticRender()
    // setBrowserConfig should be first because of setting paths for other next functions
    // Load browserConfig and server paths for internal api
    renderProps.props.children.props.adminStore.setBrowserConfig(browserConfig, serverPaths, serverConfig.hostUrl)
    renderProps.props.children.props.adminStore.statisticData = await fetchStatistic(semester)
    const statistic = ReactDOMServer.renderToString(renderProps)

    res.render('course/index', {
      debug: 'debug' in req.query,
      html: statistic,
      paths: JSON.stringify(serverPaths),
      initialState: JSON.stringify(hydrateStores(renderProps)),
      title: 'Course Information Statistics ' + semester,
    })
  } catch (err) {
    log.error('Error in statisticPageCtrl.js -> in getData', { error: err })
    next(err)
  }
}

module.exports = {
  getData,
}
