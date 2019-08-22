'use strict'
import { globalRegistry } from 'component-registry'
import { observable, action } from 'mobx'
import axios from 'axios'
import { safeGet } from 'safe-utils'
import { EMPTY } from '../util/constants'
import { IDeserialize } from '../interfaces/utils'

const paramRegex = /\/(:[^\/\s]*)/g

function _paramReplace (path, params) {
  let tmpPath = path
  const tmpArray = tmpPath.match(paramRegex)
  tmpArray.forEach(element => {
    tmpPath = tmpPath.replace(element, '/' + params[element.slice(2)])
  })
  return tmpPath
}

function _webUsesSSL (url) {
  return url.startsWith('https:')
}
class AdminStore {
  // This won't work because primitives can't be ovserved https://mobx.js.org/best/pitfalls.html#dereference-values-as-late-as-possible
  @observable courseAdminData = undefined
  @observable enteredUploadMode = true
  // @observable sellingText = undefined
  @observable sellingText = {
    en: undefined,
    sv: undefined
  }
  @observable imageInfo = undefined
  @observable isUploadedImageInApi = false
  @observable sellingTextAuthor = ''
  @observable user = ''
  @observable hasDoneSubmit = false
  @observable apiError = ''

  buildApiUrl (path, params) {
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

  _getOptions (params) {
    // Pass Cookie header on SSR-calls
    let options
    if (typeof window === 'undefined') {
      options = {
        headers: {
          Cookie: this.cookieHeader,
          Accept: 'application/json',
          'X-Forwarded-Proto': (_webUsesSSL(this.apiHost) ? 'https' : 'http')
        },
        timeout: 10000,
        params: params
      }
    } else {
      options = {
        params: params
      }
    }
    return options
  }
  @action setUser (userKthId) {
    this.user = userKthId
  }
  @action addChangedByLastTime (data) {
    this.sellingTextAuthor = safeGet(() => data.sellingTextAuthor, '')
  }
  @action addSellingText (data) {
    this.sellingText = {
      en: safeGet(() => data.sellingText.en, ''),
      sv: safeGet(() => data.sellingText.sv, '')
    }
  }

  @action addPicture (data) {
    this.imageInfo = safeGet(() => data.imageInfo, '')
    this.isUploadedImage = this.imageInfo && this.imageInfo !== ''
    // /remove next
    this.imageInfo = 'Picture_by_MainFieldOfStudy_02_Biotechnology.jpg'
  }

  isValidData (dataObject, language = 0) {
    return !dataObject ? EMPTY : dataObject
  }

  @action getCourseRequirementFromKopps (courseCode, lang = 'sv') {
    return axios.get(this.buildApiUrl(this.paths.api.koppsCourseData.uri, {courseCode}), this._getOptions())
    .then(res => {
      const course = res.data
      const courseTitleData = {
        course_code: this.isValidData(course.code),
        course_title: this.isValidData(course.title[lang]),
        course_credits: this.isValidData(course.credits),
        apiError: false
      }
      const koppsCourseDesc = { // kopps recruitmentText
        sv: this.isValidData(course.info.sv),
        en: this.isValidData(course.info.en)
      }
      this.courseAdminData = {
        koppsCourseDesc,
        imageFileName: course.mainSubjects && course.mainSubjects.length > 0 ? course.mainSubjects[0].name[lang] : EMPTY,
        courseTitleData,
        lang
      }
    }).catch(err => {
      const courseTitleData = {
        course_code: courseCode.toUpperCase(),
        apiError: true
      }
      const koppsCourseDesc = { // kopps recruitmentText
        sv: EMPTY,
        en: EMPTY
      }
      this.courseAdminData = {
        courseTitleData,
        koppsCourseDesc,
        imageFileName: EMPTY,
        lang
      }
    })
  }

  @action doUpsertItem (text, courseCode) {
    return axios.post(this.buildApiUrl(this.paths.course.updateDescription.uri, {courseCode}), {sellingText: text, user: this.user}, this._getOptions())
    .then(res => {
      let msg = null
      if (safeGet(() => res.data.body.message)) {
        console.log('We got error from api', res.data.body.message)
        msg = res.data.body.message
        throw new Error(res.data.body.message)
      } else {
        this.sellingText = text
        this.sellingTextAuthor = this.user
      }
      return msg
    })
    .catch(err => {
      if (err.response) {
        throw new Error(err.message, err.response.data)
      }
      throw err
    })
  }

  @action getLdapUserByUsername (params) {
    return axios.get(this.buildApiUrl(this.paths.api.searchLdapUser.uri, params), this._getOptions())
    .then((res) => {
      return res.data
    }).catch(err => {
      if (err.response) {
        throw new Error(err.message, err.response.data)
      }
      throw err
    })
  }

  @action clearBreadcrumbs () {
    this.breadcrumbs.replace([])
  }

  @action hasBreadcrumbs () {
    return this.breadcrumbs.length > 0
  }

  @action setBrowserConfig (config, paths, apiHost, profileBaseUrl) {
    this.browserConfig = config
    this.paths = paths
    this.apiHost = apiHost
    this.profileBaseUrl = profileBaseUrl
  }

  @action __SSR__setCookieHeader (cookieHeader) {
    if (typeof window === 'undefined') {
      this.cookieHeader = cookieHeader
    }
  }

  @action doSetLanguage (lang) {
    this.language = lang
  }

  @action getBrowserInfo () {
    var navAttrs = ['appCodeName', 'appName', 'appMinorVersion', 'cpuClass',
      'platform', 'opsProfile', 'userProfile', 'systemLanguage',
      'userLanguage', 'appVersion', 'userAgent', 'onLine', 'cookieEnabled']
    var docAttrs = ['referrer', 'title', 'URL']
    var value = {document: {}, navigator: {}}

    for (let i = 0; i < navAttrs.length; i++) {
      if (navigator[navAttrs[i]] || navigator[navAttrs[i]] === false) {
        value.navigator[navAttrs[i]] = navigator[navAttrs[i]]
      }
    }

    for (let i = 0; i < docAttrs.length; i++) {
      if (document[docAttrs[i]]) {
        value.document[docAttrs[i]] = document[docAttrs[i]]
      }
    }
    return value
  }

  initializeStore (storeName) {
    const store = this

    if (typeof window !== 'undefined' && window.__initialState__ && window.__initialState__[storeName]) {
      /* TODO:
      const util = globalRegistry.getUtility(IDeserialize, 'kursinfo-admin-web')
      const importData = JSON.parse(decodeURIComponent(window.__initialState__[storeName]))
      console.log("importData",importData, "util",util)
      for (let key in importData) {
        // Deserialize so we get proper ObjectPrototypes
        // NOTE! We need to escape/unescape each store to avoid JS-injection
        store[key] = util.deserialize(importData[key])
      }
      delete window.__initialState__[storeName]*/

      const tmp = JSON.parse(decodeURIComponent(window.__initialState__[storeName]))
      for (let key in tmp) {
        store[key] = tmp[key]
        delete tmp[key]
      }

      // Just a nice helper message
      if (Object.keys(window.__initialState__).length === 0) {
        window.__initialState__ = 'Mobx store state initialized'
      }
    }
  }
}

export default AdminStore

