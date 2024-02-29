'use strict'

// const sanitize = require('sanitize-html')
const log = require('@kth/log')
const language = require('@kth/kth-node-web-common/lib/language')
const { filteredKoppsData } = require('../apiCalls/koppsApi')
const browserConfig = require('../configuration').browser
const serverConfig = require('../configuration').server
const i18n = require('../../i18n')
const api = require('../api')
const { getAllImagesBlobNames } = require('../blobStorage.js')
const serverPaths = require('../server').getPaths()
const { getServerSideFunctions } = require('../utils/serverSideRendering')
const { createServerSideContext } = require('../ssr-context/createServerSideContext')

async function getAdminStart(req, res, next) {
  const courseCode = req.params.courseCode.toUpperCase()
  const lang = language.getLanguage(res) || 'sv'
  const { roles: userRoles } = req.session.passport.user

  try {
    const { getCompressedData, renderStaticPage } = getServerSideFunctions()
    const webContext = { lang, proxyPrefixPath: serverConfig.proxyPrefixPath, ...createServerSideContext() }
    /* ------- Settings ------- */
    webContext.setBrowserConfig(browserConfig, serverPaths, serverConfig.hostUrl)
    webContext.setUserRolesForThisCourse(userRoles)
    // Load koppsData
    webContext.koppsData = await filteredKoppsData(courseCode, lang)

    const compressedData = getCompressedData(webContext)

    const { uri: proxyPrefix } = serverConfig.proxyPrefixPath

    const view = renderStaticPage({
      applicationStore: {},
      location: req.url,
      basename: proxyPrefix,
      context: webContext,
    })

    res.render('course/index', {
      compressedData,
      debug: 'debug' in req.query,
      instrumentationKey: serverConfig.appInsights.instrumentationKey,
      title: courseCode + ' | ' + i18n.messages[lang === 'en' ? 0 : 1].messages.title,
      description: i18n.messages[lang === 'en' ? 0 : 1].messages.description,
      html: view,
      lang,
      paths: JSON.stringify(serverPaths), // don't remove it, it's needed for handlebars
      proxyPrefix,
    })
  } catch (error) {
    log.error('Error in adminPagesCtrl -> in getAdminStart', { error })
    next(error)
  }
}

async function _getImagesNamesFromKursinfoApi() {
  try {
    const { client, paths } = api.kursinfoApi

    return await client.getAsync(client.resolve(paths.getUploadedImagesNames.uri), {
      useCache: false,
    })
  } catch (error) {
    const apiError = new Error('Fetching of images from kursinfo api is not available')
    // apiError.status = 500
    log.error('Error in _getImagesNamesFromKursinfoApi', { error })
    throw apiError
  }
}

async function monitorImages(req, res, next) {
  try {
    const allImagesInContainer = await getAllImagesBlobNames()
    const { body: allImagesNamesInApiDb } = await _getImagesNamesFromKursinfoApi()
    if (!allImagesInContainer || !allImagesNamesInApiDb)
      return res.send('Blob storage or kursinfo-api is not available')
    const missingImagesInBlob =
      allImagesInContainer && allImagesNamesInApiDb
        ? allImagesNamesInApiDb.filter(imageName => !allImagesInContainer.includes(imageName))
        : []

    const unusedImagesInBlob =
      allImagesInContainer && allImagesNamesInApiDb
        ? allImagesInContainer.filter(
            fileName => fileName.match(/Picture_by_own_choice_*/) && !allImagesNamesInApiDb.includes(fileName)
          )
        : []

    res.render('course/monitor_images', {
      debug: 'debug' in req.query,
      missingImagesHeader: missingImagesInBlob.length > 0,
      missingImagesInBlob,
      unusedImagesInBlob,
      unusedImagesInBlobHeader: unusedImagesInBlob.length > 0,
    })
  } catch (err) {
    log.error('Error in monitorImages', { error: err })
    next(err)
  }
}

module.exports = {
  getAdminStart,
  monitorImages,
}
