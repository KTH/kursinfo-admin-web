const i18n = require('../../i18n')
const serverConfig = require('../configuration.js').server
const { getServerSideFunctions } = require('../utils/serverSideRendering')
const { getLangIndex } = require('./langUtil')

function renderCoursePage(req, res, context) {
  const courseCode = context?.routeData?.courseData?.courseCode
  const langIndex = getLangIndex(context.lang)
  const messages = i18n.messages[langIndex].messages
  const { getCompressedData, renderStaticPage } = getServerSideFunctions()
  const html = renderStaticPage({
    applicationStore: {},
    location: req.url,
    basename: context.proxyPrefixPath.uri,
    context,
  })
  const compressedData = getCompressedData(context)
  res.render('course/index', {
    html,
    compressedData,
    title: `${messages.title} | ${courseCode}`,
    description: messages.description,
    instrumentationKey: serverConfig.appInsights.instrumentationKey,
  })
}

module.exports = {
  renderCoursePage,
}
