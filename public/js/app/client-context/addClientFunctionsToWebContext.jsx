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

function doUpsertItem(text, courseCode, imageName) {
  return axios
    .post(this.buildApiUrl(this.paths.course.updateDescription.uri, { courseCode }), {
      sellingText: text,
      imageName,
      user: this.user,
    })
    .then(res => {
      if (safeGet(() => res.data.body.message)) {
        const { message: msg } = res.data.body
        throw new Error(msg)
      }
      return text
    })
    .catch(err => {
      if (err.response) {
        throw new Error(err.message, err.response.data)
      }
      throw err
    })
}

function addClientFunctionsToWebContext() {
  const functions = {
    buildApiUrl,
    doUpsertItem,
  }
  return functions
}

export { addClientFunctionsToWebContext }
