'use strict'

const { safeGet } = require('safe-utils')

const paramRegex = /\/(:[^\/\s]*)/g

function _paramReplace(path, params) {
  let tmpPath = path
  const tmpArray = tmpPath.match(paramRegex)
  tmpArray.forEach(element => {
    tmpPath = tmpPath.replace(element, '/' + params[element.slice(2)])
  })
  return tmpPath
}

function buildApiUrl(path, params) {
  let host
  if (typeof window !== 'undefined') {
    // host = 'http://localhost:' + '3001'
    host = this.apiHost
  } else {
    host = 'http://localhost:' + this.browserConfig.port
  }
  if (host[host.length - 1] === '/') {
    host = host.slice(0, host.length - 1)
  }

  const newPath = params ? _paramReplace(path, params) : path

  return [host, newPath].join('')
}

function setBrowserConfig(config, paths, apiHost, hostUrl) {
  this.browserConfig = config
  this.paths = paths
  this.apiHost = apiHost
  this.hostUrl = hostUrl
}

function setUser(userKthId) {
  this.user = userKthId
}

function setUserRolesForThisCourse(roles = {}) {
  this.userRoles = roles
}

function addChangedByLastTime(data) {
  this.sellingTextAuthor = safeGet(() => data.sellingTextAuthor, '')
}

function addPictureFromApi(data) {
  this.imageNameFromApi = safeGet(() => data.imageInfo, '')
  this.isApiPicAvailable = this.imageNameFromApi !== ''
  this.apiImageUrl = `${this.browserConfig.storageUri}${this.imageNameFromApi}`
  this.isDefaultChosen = !this.isApiPicAvailable
}
function addSellingTextFromApi(data) {
  this.sellingText = {
    en: safeGet(() => data.sellingText.en, ''),
    sv: safeGet(() => data.sellingText.sv, ''),
  }
}

function createServerSideContext() {
  const context = {
    koppsData: {},
    statisticData: {},
    sellingText: {
      en: undefined,
      sv: undefined,
    },
    // Saving temporary state for picture between classes
    newImageFile: '',
    tempImagePath: '',
    // Default image according to school
    isDefaultChosen: true, // true-false
    // @observable defaultImageUrl

    // Kursinfo-api, published image info
    imageNameFromApi: '', // name.jpg
    isApiPicAvailable: true, // true-false
    apiImageUrl: '', // `${KURSINFO_IMAGE_BLOB_URL}${this.imageNameFromApi}`

    // info for saving who change text
    sellingTextAuthor: '',
    user: '',
    // hasDoneSubmit: false
    apiError: '',
    userRoles: {},
    buildApiUrl,
    setUser,
    setUserRolesForThisCourse,
    addSellingTextFromApi,
    addChangedByLastTime,
    addPictureFromApi,
    setBrowserConfig,
  }

  return context
}

module.exports = { createServerSideContext }
