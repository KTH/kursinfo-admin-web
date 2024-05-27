'use strict'

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
const { getLangIndex } = require('../utils/langUtil')
const { createServerSideContext } = require('../ssr-context/createServerSideContext')
const { HttpError } = require('../HttpError')

async function getAdminStart(req, res, next) {
  const courseCode = req.params.courseCode.toUpperCase()
  const lang = language.getLanguage(res) || 'sv'
  const { roles: userRoles } = req.session.passport.user

  try {
    const { getCompressedData, renderStaticPage } = getServerSideFunctions()
    const langIndex = getLangIndex(lang)
    const { messages } = i18n.messages[langIndex]
    const webContext = {
      lang,
      langIndex,
      proxyPrefixPath: serverConfig.proxyPrefixPath,
      ...createServerSideContext(),
    }
    /* ------- Settings ------- */
    webContext.setBrowserConfig(browserConfig, serverPaths, serverConfig.hostUrl)
    webContext.setUserRolesForThisCourse(userRoles)
    // Load koppsData
    const koppsData = await filteredKoppsData(courseCode, lang)
    if (koppsData.apiError && koppsData.statusCode === 404) {
      throw new HttpError(404, messages.error_not_found)
    }
    webContext.koppsApiError = koppsData.apiError
    webContext.koppsData = koppsData
    webContext.courseCode = courseCode

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
      title: `${courseCode} | ${messages.title}`,
      description: messages.description,
      html: view,
      lang,
      paths: JSON.stringify(serverPaths), // don't remove it, it's needed for handlebars
      toolbarUrl: serverConfig.toolbar.url,
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

    return res.render('course/monitor_images', {
      debug: 'debug' in req.query,
      missingImagesHeader: missingImagesInBlob.length > 0,
      missingImagesInBlob,
      unusedImagesInBlob,
      unusedImagesInBlobHeader: unusedImagesInBlob.length > 0,
    })
  } catch (err) {
    log.error('Error in monitorImages', { error: err })
    return next(err)
  }
}

module.exports = {
  getAdminStart,
  monitorImages,
}
