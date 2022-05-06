'use strict'

const log = require('@kth/log')
const language = require('@kth/kth-node-web-common/lib/language')
const ReactDOMServer = require('react-dom/server')
const { fetchStatistic } = require('../statisticTransformer')
const browserConfig = require('../configuration').browser
const serverConfig = require('../configuration').server
const serverPaths = require('../server').getPaths()
const i18n = require('../../i18n')
const { getServerSideFunctions } = require('../utils/serverSideRendering')
const { createServerSideContext } = require('../ssr-context/createServerSideContext')

async function getData(req, res, next) {
  const lang = language.getLanguage(res)
  const { semester = '0' } = req.params
  try {
    const { getCompressedData, renderStaticPage } = getServerSideFunctions()
    const webContext = { lang, proxyPrefixPath: serverConfig.proxyPrefixPath, ...createServerSideContext() }
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

    webContext.setBrowserConfig(browserConfig, serverPaths, serverConfig.hostUrl)
    webContext.statisticData = await fetchStatistic(semester)

    const compressedData = getCompressedData(webContext)

    const { uri: proxyPrefix } = serverConfig.proxyPrefixPath

    const html = renderStaticPage({
      applicationStore: {},
      location: req.url,
      basename: proxyPrefix,
      context: webContext,
    })

    res.render('course/index', {
      compressedData,
      debug: 'debug' in req.query,
      html: html,
      //paths: JSON.stringify(serverPaths),
      title: 'Course Information Statistics ' + semester,
      proxyPrefix,
    })
  } catch (err) {
    log.error('Error in statisticPageCtrl.js -> in getData', { error: err })
    next(err)
  }
}

module.exports = {
  getData,
}
