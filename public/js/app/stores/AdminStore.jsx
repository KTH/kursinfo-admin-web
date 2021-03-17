'use strict'
import { observable, action } from 'mobx'
import axios from 'axios'
import { safeGet } from 'safe-utils'

const paramRegex = /\/(:[^\/\s]*)/g

function _paramReplace(path, params) {
  let tmpPath = path
  const tmpArray = tmpPath.match(paramRegex)
  tmpArray.forEach((element) => {
    tmpPath = tmpPath.replace(element, '/' + params[element.slice(2)])
  })
  return tmpPath
}

function _webUsesSSL(url) {
  return url.startsWith('https:')
}
class AdminStore {
  @observable koppsData
  @observable statisticData
  @observable sellingText = {
    en: undefined,
    sv: undefined
  }
  // Saving temporary state for picture between classes
  @observable newImageFile
  @observable tempImagePath

  // Default image according to school
  @observable isDefaultChosen // true-false
  // @observable defaultImageUrl

  // Kursinfo-api, published image info
  @observable imageNameFromApi // name.jpg
  @observable isApiPicAvailable // true-false
  @observable apiImageUrl // `${KURSINFO_IMAGE_BLOB_URL}${this.imageNameFromApi}`

  // info for saving who change text
  @observable sellingTextAuthor = ''
  @observable user = ''
  // @observable hasDoneSubmit = false
  @observable apiError = ''
  @observable userRoles = {}

  buildApiUrl(path, params) {
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

  @action setUser(userKthId) {
    this.user = userKthId
  }


  @action setUserRolesForThisCourse(roles={}) {
    const {isCourseResponsible, isExaminator, isSuperUser} = roles
    const visibilityLevel =  (isCourseResponsible || isExaminator || isSuperUser) ? 'all' : 'onlyMemo'
    this.userRoles = {...roles, visibilityLevel}
  }

  @action addChangedByLastTime(data) {
    this.sellingTextAuthor = safeGet(() => data.sellingTextAuthor, '')
  }
  @action addPictureFromApi(data) {
    this.imageNameFromApi = safeGet(() => data.imageInfo, '')
    this.isApiPicAvailable = this.imageNameFromApi !== ''
    this.apiImageUrl = `${this.browserConfig.storageUri}${this.imageNameFromApi}`
    this.isDefaultChosen = !this.isApiPicAvailable
  }
  @action addSellingTextFromApi(data) {
    this.sellingText = {
      en: safeGet(() => data.sellingText.en, ''),
      sv: safeGet(() => data.sellingText.sv, '')
    }
  }
  @action tempSaveText(data) {
    this.sellingText = {
      en: data.en,
      sv: data.sv
    }
  }
  @action tempSaveNewImage(imageFile, tempImagePath, isDefaultChosen) {
    this.newImageFile = imageFile
    this.tempImagePath = tempImagePath
    this.isDefaultChosen = isDefaultChosen
  }

  @action doUpsertItem(text, courseCode, imageName) {
    return axios
      .post(this.buildApiUrl(this.paths.course.updateDescription.uri, { courseCode }), {
        sellingText: text,
        imageName,
        user: this.user
      })
      .then((res) => {
        let msg = null
        if (safeGet(() => res.data.body.message)) {
          msg = res.data.body.message
          throw new Error(res.data.body.message)
        } else {
          this.sellingText = text
          this.sellingTextAuthor = this.user
        }
        return msg
      })
      .catch((err) => {
        if (err.response) {
          throw new Error(err.message, err.response.data)
        }
        throw err
      })
  }

  @action setBrowserConfig(config, paths, apiHost, hostUrl) {
    this.browserConfig = config
    this.paths = paths
    this.apiHost = apiHost
    this.hostUrl = hostUrl
  }

  initializeStore(storeName) {
    const store = this

    if (
      typeof window !== 'undefined' &&
      window.__initialState__ &&
      window.__initialState__[storeName]
    ) {

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
