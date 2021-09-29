'use strict'

// const sanitize = require('sanitize-html')
const log = require('kth-node-log')
const language = require('kth-node-web-common/lib/language')
const ReactDOMServer = require('react-dom/server')
const { filteredKoppsData } = require('../koppsApi')
const { toJS } = require('mobx')
const browserConfig = require('../configuration').browser
const serverConfig = require('../configuration').server
const i18n = require('../../i18n')
const api = require('../api')

const { getAllImagesBlobNames } = require('../blobStorage.js')

const serverPaths = require('../server').getPaths()

function hydrateStores(renderProps) {
  // This assumes that all stores are specified in a root element called Provider

  const { props } = renderProps.props.children
  const outp = {}
  for (let key in props) {
    if (typeof props[key].initializeStore === 'function') {
      outp[key] = encodeURIComponent(JSON.stringify(toJS(props[key], true)))
    }
  }
  return outp
}

function _staticRender(context, location) {
  if (process.env.NODE_ENV === 'development') {
    delete require.cache[require.resolve('../../dist/app.js')]
  }

  const { staticRender } = require('../../dist/app.js')

  return staticRender(context, location)
}

async function getAdminStart(req, res, next) {
  const courseCode = req.params.courseCode.toUpperCase()
  const lang = language.getLanguage(res) || 'sv'
  const { thisCourseUserRoles } = req.session

  try {
    // Render inferno app
    const renderProps = _staticRender()
    // setBrowserConfig should be first because of setting paths for other next functions
    // Load browserConfig and server paths for internal api
    renderProps.props.children.props.adminStore.setBrowserConfig(browserConfig, serverPaths, serverConfig.hostUrl)
    renderProps.props.children.props.adminStore.setUserRolesForThisCourse(thisCourseUserRoles)
    // Load koppsData
    renderProps.props.children.props.adminStore.koppsData = await filteredKoppsData(courseCode, lang)

    const html = ReactDOMServer.renderToString(renderProps)
    res.render('course/index', {
      debug: 'debug' in req.query,
      instrumentationKey: serverConfig.appInsights.instrumentationKey,
      title: courseCode + ' | ' + i18n.messages[lang === 'en' ? 0 : 1].messages.title,
      description: i18n.messages[lang === 'en' ? 0 : 1].messages.description,
      html,
      paths: JSON.stringify(serverPaths),
      initialState: JSON.stringify(hydrateStores(renderProps)),
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
  _staticRender()
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
