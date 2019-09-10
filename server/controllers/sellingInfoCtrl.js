'use strict'

const api = require('../api')
const co = require('co')
const log = require('kth-node-log')
const language = require('kth-node-web-common/lib/language')
const { safeGet } = require('safe-utils')
const { createElement } = require('inferno-create-element')
const { renderToString } = require('inferno-server')
const { StaticRouter } = require('inferno-router')
const { toJS } = require('mobx')
const { runBlobStorage, updateMetaData, deleteBlob } = require('../blobStorage.js')
const browserConfig = require('../configuration').browser
const serverConfig = require('../configuration').server
const httpResponse = require('kth-node-response')

let { appFactory, doAllAsyncBefore } = require('../../dist/js/server/app.js')

const serverPaths = require('../server').getPaths()

module.exports = {
  getDescription: co.wrap(_getDescription),
  updateDescription: co.wrap(_updateDescription),
  myCourses: co.wrap(_myCourses),
  saveFileToStorage: co.wrap(_saveFileToStorage),
  updateFileInStorage: co.wrap(_updateFileInStorage),
  deleteFileInStorage: co.wrap(_deleteFileInStorage)
}

async function _getSellingTextFromKursinfoApi (courseCode) {
  try {
    const client = api.kursinfoApi.client
    const paths = api.kursinfoApi.paths
    return await client.getAsync(client.resolve(paths.getSellingTextByCourseCode.uri, { courseCode }), { useCache: true })
  } catch (error) {
    const apiError = new Error('Redigering av säljande texten är inte tillgänlig för nu, försöker senare')
    // apiError.status = 500
    log.error('Error in _getSellingTextFromKursinfoApi', {error})
    throw apiError
  }
}

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
    const respSellDesc = await _getSellingTextFromKursinfoApi(courseCode)
    const userKthId = req.session.authUser.ugKthid
    // Render inferno app
    const context = {}
    const renderProps = createElement(StaticRouter, {
      location: req.url,
      context
    }, appFactory())
    renderProps.props.children.props.adminStore.setUser(userKthId)
    // Load browserConfig and server paths for internal api
    renderProps.props.children.props.adminStore.setBrowserConfig(browserConfig, serverPaths, serverConfig.hostUrl)
    renderProps.props.children.props.adminStore.__SSR__setCookieHeader(req.headers.cookie)
    // Load koppsData and kurinfo-api data
    await renderProps.props.children.props.adminStore.getCourseRequirementFromKopps(courseCode, lang)
    renderProps.props.children.props.adminStore.addSellingTextFromApi(respSellDesc.body)
    renderProps.props.children.props.adminStore.addPictureFromApi(respSellDesc.body)
    renderProps.props.children.props.adminStore.addChangedByLastTime(respSellDesc.body)
    await doAllAsyncBefore({
      pathname: req.originalUrl,
      query: (req.originalUrl === undefined || req.originalUrl.indexOf('?') === -1) ? undefined : req.originalUrl.substring(req.originalUrl.indexOf('?'), req.originalUrl.length),
      adminStore: renderProps.props.children.props.adminStore,
      routes: renderProps.props.children.props.children.props.children.props.children
    })
    const html = renderToString(renderProps)
    res.render('course/index', {
      // debug: 'debug' in req.query,
      instrumentationKey: serverConfig.appInsights.instrumentationKey,
      title: courseCode,
      html: html,
      initialState: JSON.stringify(hydrateStores(renderProps))
    })
  } catch (err) {
    log.error('Error in _getDescription', { error: err })
    next(err)
  }
}

async function _myCourses (req, res, next) {
  if (process.env['NODE_ENV'] === 'development') {
    delete require.cache[require.resolve('../../dist/js/server/app.js')]
    const tmp = require('../../dist/js/server/app.js')
    appFactory = tmp.appFactory
    doAllAsyncBefore = tmp.doAllAsyncBefore
  }
  try {
    const user = req.session.authUser.memberOf
    res.render('course/my_course', {
      debug: 'debug' in req.query,
      html: user,
      courseCode: req.params.courseCode
    })
  } catch (err) {
    log.error('Error in _my_courses', { error: err })
    next(err)
  }
}

async function _updateDescription (req, res, next) {
  try {
    const client = api.kursinfoApi.client
    const apipaths = api.kursinfoApi.paths
    let lang = language.getLanguage(res) || 'sv'
    const result = await client.postAsync({
      uri: client.resolve(apipaths.postSellingTextByCourseCode.uri, {courseCode: req.params.courseCode}),
      body: {sellingText: req.body.sellingText,
        sellingTextAuthor: req.body.user,
        imageInfo: req.body.imageName,
        lang},
      useCache: false
    })
    if (safeGet(() => result.body.message)) {
      log.error('Error from API: ', result.body.message)
    }
    log.info('Selling text and picture updated in kursinfo api')
    return res.json(result)
  } catch (err) {
    log.error('Error in _updateDescription', { error: err })
    next(err)
  }
}

// ------- FILES IN BLOB STORAGE: SAVE, UPDATE, DELETE ------- /
function * _saveFileToStorage (req, res, next) {
  log.info('Saving uploaded file to storage ') // + req.files.file
  console.log('===========================START=======================')
  console.log('File is ', req.body)
  console.log('===========================END=======================')
  const file = req.files.file
  console.log('file', file, req.params.courseCode, req.body)
  try {
    const fileName = yield runBlobStorage(file, req.params.courseCode, req.params.published, req.body)
    console.log('fileName', fileName)
    return httpResponse.json(res, fileName)
    // return res.status(res).json(fileName)
  } catch (error) {
    log.error('Exception from saveFileToStorage ', { error: error })
    next(error)
  }
}

function * _updateFileInStorage (req, res, next) {
  log.info('_updateFileInStorage file name:' + req.params.fileName + ', metadata:' + req.body.params.metadata)
  try {
    const response = yield updateMetaData(req.params.fileName, req.body.params.metadata)
    return res.json(res, response)
  } catch (error) {
    log.error('Exception from updateFileInStorage ', { error: error })
    next(error)
  }
}

function * _deleteFileInStorage (res, req, next) {
  log.debug('_deleteFileInStorage, id:' + req.req.params.id)
  try {
    const response = yield deleteBlob(req.req.params.id)
    log.debug('_deleteFileInStorage, id:', response)
    return res.json(res.res)
  } catch (error) {
    log.error('Exception from _deleteFileInStorage ', { error: error })
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
