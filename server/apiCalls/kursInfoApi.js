'use strict'

const api = require('../api')
const i18n = require('../../i18n')

function throwGenericError() {
  throw new Error(i18n.messages[1].messages.error_generic)
}

async function getCourseInfo(courseCode) {
  try {
    const { client, paths } = api.kursinfoApi
    const uri = client.resolve(paths.getCourseInfoByCourseCode.uri, { courseCode })
    const res = await client.getAsync({ uri })

    if (res.response.statusCode === 404) {
      return {
        notFound: true,
      }
    }

    if (!res.response.ok || !res.body) {
      return throwGenericError()
    } else {
      return res.body
    }
  } catch (err) {
    return throwGenericError()
  }
}

async function patchCourseInfo(courseCode, data) {
  try {
    const { client, paths } = api.kursinfoApi
    const uri = client.resolve(paths.patchCourseInfoByCourseCode.uri, { courseCode })
    const res = await client.patchAsync({
      uri,
      body: { courseCode, ...data },
    })

    if (!res.response.ok) {
      throwGenericError()
    }
  } catch (err) {
    throwGenericError()
  }
}

async function postCourseInfo(courseCode, data) {
  try {
    const { client, paths } = api.kursinfoApi
    const uri = client.resolve(paths.postCourseInfo.uri, { courseCode })
    const res = await client.postAsync({
      uri,
      body: { courseCode, ...data },
    })

    if (!res.response.ok) {
      throwGenericError()
    }
  } catch (err) {
    throwGenericError()
  }
}

module.exports = {
  getCourseInfo,
  patchCourseInfo,
  postCourseInfo,
}
