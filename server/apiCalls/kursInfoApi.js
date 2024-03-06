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

    if (!res.response.ok) {
      throwGenericError()
    }

    if (res.body) {
      return res.body
    }
  } catch (err) {
    throwGenericError()
  }
}

async function patchCourseInfo(courseCode, data) {
  try {
    const { client, paths } = api.kursinfoApi
    const uri = client.resolve(paths.patchCourseInfoByCourseCode.uri, { courseCode })
    const res = await client.patchAsync({
      uri: uri,
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
      uri: uri,
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
