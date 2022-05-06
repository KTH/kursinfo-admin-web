'use strict'

import axios from 'axios'
import { safeGet } from 'safe-utils'

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

function tempSaveText(data) {
  this.sellingText = {
    en: data.en,
    sv: data.sv,
  }
}

function doUpsertItem(text, courseCode, imageName) {
  return axios
    .post(this.buildApiUrl(this.paths.course.updateDescription.uri, { courseCode }), {
      sellingText: text,
      imageName,
      user: this.user,
    })
    .then(res => {
      let msg = null
      if (safeGet(() => res.data.body.message)) {
        msg = res.data.body.message
        throw new Error(res.data.body.message)
      } else {
        this.sellingText = text
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

function setBrowserConfig(config, paths, apiHost, hostUrl) {
  this.browserConfig = config
  this.paths = paths
  this.apiHost = apiHost
  this.hostUrl = hostUrl
}

function addClientFunctionsToWebContext() {
  const functions = {
    buildApiUrl,
    tempSaveText,
    doUpsertItem,
    setBrowserConfig,
  }
  return functions
}

export { addClientFunctionsToWebContext }
