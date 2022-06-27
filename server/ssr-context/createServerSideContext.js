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

function setBrowserConfig(config, paths, hostUrl) {
  this.browserConfig = config
  this.paths = paths
  this.apiHost = hostUrl
  this.hostUrl = hostUrl
  this.publicHostUrl = hostUrl.replace('//app', '//www')
}

function setUser(userKthId) {
  this.user = userKthId
}

function setUserRolesForThisCourse(roles = {}) {
  this.userRoles = roles
}

function addPictureFromApi(data) {
  const { imageInfo: imageNameFromApi = '' } = data
  this.imageNameFromApi = imageNameFromApi
  this.hasImageNameFromApi = !!imageNameFromApi
  this.apiImageUrl = `${this.browserConfig.storageUri}${imageNameFromApi}`
  this.isStandardImageChosen = !this.hasImageNameFromApi
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
    newImagePath: '',
    // Default image according to school
    isStandardImageChosen: true, // true-false

    // Kursinfo-api, published image info
    imageNameFromApi: '', // name.jpg
    hasImageNameFromApi: true, // true-false
    apiImageUrl: '', // `${KURSINFO_IMAGE_BLOB_URL}${this.imageNameFromApi}`

    user: '',
    apiError: '',
    userRoles: {},
    // hosts
    apiHost: '',
    hostUrl: '',
    paths: [],
    publicHostUrl: '',
    // functions
    buildApiUrl,
    setUser,
    setUserRolesForThisCourse,
    addSellingTextFromApi,
    addPictureFromApi,
    setBrowserConfig,
  }

  return context
}

module.exports = { createServerSideContext }
