'use strict'

const log = require('@kth/log')
const language = require('@kth/kth-node-web-common/lib/language')
const { safeGet } = require('safe-utils')
const httpResponse = require('@kth/kth-node-response')
const api = require('../api')
const { runBlobStorage } = require('../blobStorage.js')
const { filteredKoppsData } = require('../koppsApi')
const browserConfig = require('../configuration').browser
const serverConfig = require('../configuration').server
const i18n = require('../../i18n')
const serverPaths = require('../server').getPaths()
const { getServerSideFunctions } = require('../utils/serverSideRendering')
const { createServerSideContext } = require('../ssr-context/createServerSideContext')

async function _getSellingTextFromKursinfoApi(courseCode) {
  try {
    const { client, paths } = api.kursinfoApi

    return await client.getAsync(client.resolve(paths.getSellingTextByCourseCode.uri, { courseCode }), {
      useCache: false,
    })
  } catch (error) {
    const apiError = new Error('Redigering av säljande texten är inte tillgänlig för nu, försöker senare')
    // apiError.status = 500
    log.error('Error in _getSellingTextFromKursinfoApi', { error })
    throw apiError
  }
}

async function getDescription(req, res, next) {
  const { courseCode } = req.params
  const lang = language.getLanguage(res) || 'sv'
  const langIndex = lang === 'en' ? 0 : 1

  try {
    const { getCompressedData, renderStaticPage } = getServerSideFunctions()
    const webContext = { lang, proxyPrefixPath: serverConfig.proxyPrefixPath, ...createServerSideContext() }
    const { uri: proxyPrefix } = serverConfig.proxyPrefixPath

    const respSellDesc = await _getSellingTextFromKursinfoApi(courseCode)
    const userKthId = req.session.passport.user.ugKthid
    webContext.setUser(userKthId)
    // Load browserConfig and server paths for internal api
    webContext.setBrowserConfig(browserConfig, serverPaths, serverConfig.hostUrl)
    // Load koppsData and kurinfo-api data
    webContext.koppsData = await filteredKoppsData(courseCode, lang)
    webContext.addSellingTextFromApi(respSellDesc.body)
    webContext.addPictureFromApi(respSellDesc.body)
    webContext.addChangedByLastTime(respSellDesc.body)

    const compressedData = getCompressedData(webContext) // this has to be AFTER all webContext is ready

    const view = renderStaticPage({
      applicationStore: {},
      location: req.url,
      basename: proxyPrefix,
      context: webContext,
    })

    res.render('course/index', {
      // debug: 'debug' in req.query,
      compressedData,
      description: i18n.messages[langIndex].messages.description,
      instrumentationKey: serverConfig.appInsights.instrumentationKey,
      html: view,
      title: i18n.messages[langIndex].messages.title + ' | ' + courseCode,
    })
  } catch (err) {
    log.error('Error in sellingInfoCrtl -> getDescription', { error: err })
    next(err)
  }
}

// This function to see which groups user is in
async function myCourses(req, res, next) {
  try {
    const user = req.session.passport.user.memberOf
    res.render('course/my_course', {
      debug: 'debug' in req.query,
      html: user,
      courseCode: req.params.courseCode,
    })
  } catch (err) {
    log.error('Error in myCourses', { error: err })
    next(err)
  }
}

// ------- FILES IN BLOB STORAGE: CREATE A NEW FILE OR REPLACE EXISTED ONE ------- /
async function updateDescription(req, res, next) {
  try {
    const { client } = api.kursinfoApi
    const apipaths = api.kursinfoApi.paths
    const lang = language.getLanguage(res) || 'sv'
    const result = await client.postAsync({
      uri: client.resolve(apipaths.postSellingTextByCourseCode.uri, {
        courseCode: req.params.courseCode,
      }),
      body: {
        sellingText: req.body.sellingText,
        sellingTextAuthor: req.body.user,
        imageInfo: req.body.imageName,
        lang,
      },
      useCache: false,
    })
    if (safeGet(() => result.body.message)) {
      log.error('Error while updateDescription from API: ', result.body.message)
    }
    log.info('Selling text and picture updated in kursinfo api for course:', req.params.courseCode)
    return res.json(result)
  } catch (err) {
    log.error('Error in updateDescription', { error: err })
    next(err)
  }
}

// ------- FILES IN BLOB STORAGE: CREATE A NEW FILE OR REPLACE EXISTED ONE ------- /
async function saveImageToStorage(req, res, next) {
  log.info('Saving uploaded file to storage ', req.body) // + req.files.file
  const { file } = req.files
  log.info('file', file, req.params.courseCode, req.body)
  try {
    const savedImageNameObj = await runBlobStorage(file, req.params.courseCode, req.body)
    return httpResponse.json(res, savedImageNameObj)
  } catch (error) {
    log.error('Exception from saveImageToStorage ', { error })
    next(error)
  }
}

module.exports = {
  getDescription,
  updateDescription,
  myCourses,
  saveImageToStorage,
}
