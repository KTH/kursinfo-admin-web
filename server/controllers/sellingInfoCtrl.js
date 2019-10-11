'use strict'

const api = require('../api')
const co = require('co')
const log = require('kth-node-log')
const language = require('kth-node-web-common/lib/language')
const { safeGet } = require('safe-utils')
const ReactDOMServer = require('react-dom/server')
const { toJS } = require('mobx')
const { runBlobStorage } = require('../blobStorage.js')
const { filteredKoppsData } = require('../koppsApi')
const browserConfig = require('../configuration').browser
const serverConfig = require('../configuration').server
const httpResponse = require('kth-node-response')
const i18n = require('../../i18n')
const serverPaths = require('../server').getPaths()

module.exports = {
  getDescription: co.wrap(_getDescription),
  updateDescription: co.wrap(_updateDescription),
  myCourses: co.wrap(_myCourses),
  saveFileToStorage: co.wrap(_saveFileToStorage)
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

function _staticRender (context, location) {
  if (process.env.NODE_ENV === 'development') {
    delete require.cache[require.resolve('../../dist/app.js')]
  }
  const { staticRender } = require('../../dist/app.js')
  return staticRender(context, location)
}

async function _getDescription (req, res, next) {

  const courseCode = req.params.courseCode
  let lang = language.getLanguage(res) || 'sv'
  const langIndex = lang === 'en' ? 0 : 1

  try {
    const renderProps = _staticRender()
    const respSellDesc = await _getSellingTextFromKursinfoApi(courseCode)
    const userKthId = req.session.authUser.ugKthid
    renderProps.props.children.props.adminStore.setUser(userKthId)
    // Load browserConfig and server paths for internal api
    renderProps.props.children.props.adminStore.setBrowserConfig(browserConfig, serverPaths, serverConfig.hostUrl)
    renderProps.props.children.props.adminStore.__SSR__setCookieHeader(req.headers.cookie)
    // Load koppsData and kurinfo-api data
    renderProps.props.children.props.adminStore.koppsData = await filteredKoppsData(courseCode, lang)
    renderProps.props.children.props.adminStore.addSellingTextFromApi(respSellDesc.body)
    renderProps.props.children.props.adminStore.addPictureFromApi(respSellDesc.body)
    renderProps.props.children.props.adminStore.addChangedByLastTime(respSellDesc.body)
    const html = ReactDOMServer.renderToString(renderProps)
    res.render('course/index', {
      // debug: 'debug' in req.query,
      description: i18n.messages[langIndex].messages.description,
      instrumentationKey: serverConfig.appInsights.instrumentationKey,
      html: html,
      initialState: JSON.stringify(hydrateStores(renderProps)),
      title: i18n.messages[langIndex].messages.title + ' | ' + courseCode
    })
  } catch (err) {
    log.error('Error in _getDescription', { error: err })
    next(err)
  }
}

// This function to see which groups user is in
async function _myCourses (req, res, next) {
  _staticRender()
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

// ------- FILES IN BLOB STORAGE: CREATE A NEW FILE OR REPLACE EXISTED ONE ------- /
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
    log.info('Selling text and picture updated in kursinfo api for course:', req.params.courseCode)
    return res.json(result)
  } catch (err) {
    log.error('Error in _updateDescription', { error: err })
    next(err)
  }
}

// ------- FILES IN BLOB STORAGE: CREATE A NEW FILE OR REPLACE EXISTED ONE ------- /
function * _saveFileToStorage (req, res, next) {
  log.info('Saving uploaded file to storage ', req.body) // + req.files.file
  const file = req.files.file
  log.info('file', file, req.params.courseCode, req.body)
  try {
    const savedImageName = yield runBlobStorage(file, req.params.courseCode, req.body)
    return httpResponse.json(res, savedImageName)
  } catch (error) {
    log.error('Exception from saveFileToStorage ', { error: error })
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
