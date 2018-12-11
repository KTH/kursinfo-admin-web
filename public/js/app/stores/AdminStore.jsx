'use strict'
import { globalRegistry } from 'component-registry'
import { observable, action } from 'mobx'
import axios from 'axios'
import { safeGet } from 'safe-utils'
import { EMPTY, PROGRAMME_URL } from '../util/constants'

import { IDeserialize } from '../interfaces/utils'

class AdminStore {
  @observable language = 'sv' // This won't work because primitives can't be ovserved https://mobx.js.org/best/pitfalls.html#dereference-values-as-late-as-possible
  @observable courseAdminData = undefined

  buildApiUrl (path, params) {
    let host
    if (typeof window !== 'undefined') {
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

  @action async getCourseRequirementFromKopps (courseCode, lang = 'sv', roundIndex = 0) {
    // TODO: CALL TO OUR API TO GET
    const language = lang === 'en' ? 0 : 1
    try {
      const coursePlan = await axios.get(`https://api-r.referens.sys.kth.se/api/kopps/internal/courses/${courseCode}?lang=${lang}`)
      const courseTitleData = {
        course_code: isValidData(coursePlan.data.course.courseCode),
        course_title: isValidData(coursePlan.data.course.title),
        course_other_title: isValidData(coursePlan.data.course.titleOther),
        course_credits: isValidData(coursePlan.data.course.credits)
      }
      const koppsCourseDesc = {
        course_recruitment_text: isValidData(coursePlan.data.course.recruitmentText), // kopps recruitmentText
        sellingText: isValidData(coursePlan.data.course.recruitmentText)
      }
      console.log('!!Got a kopps description of data: OK !!')

      this.courseAdminData = {
        koppsCourseDesc,
        courseTitleData,
        language
      }
    } catch (err) { // console.log(err.response);
      if (err.response) {
        throw new Error(err.message, err.response.data)
      }
      throw err
    }
  }

  @action async getCourseSellingText (courseCode, lang = 'sv', roundIndex = 0) {
    const language = lang === 'en' ? 0 : 1

  }

  // @action createSellingTextForCourse (courseCode, lang = 'sv', roundIndex = 0) {
  //   const language = lang === 'en' ? 0 : 1
  //   const res = await axios.post(`https://api-r.referens.sys.kth.se/api/kopps/internal/courses/${courseCode}?lang=${lang}`)

  // }

  // @action getLdapUserByUsername (params) {
  //   return axios.get(this.buildApiUrl(this.paths.api.searchLdapUser.uri, params), this._getOptions()).then((res) => {
  //     return res.data
  //   }).catch(err => {
  //     if (err.response) {
  //       throw new Error(err.message, err.response.data)
  //     }
  //     throw err
  //   })
  // }

  // @action clearBreadcrumbs () {
  //   this.breadcrumbs.replace([])
  // }

  // @action hasBreadcrumbs () {
  //   return this.breadcrumbs.length > 0
  // }

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

function isValidData (dataObject, language = 0) {
  return !dataObject ? EMPTY : dataObject
}

export default AdminStore

