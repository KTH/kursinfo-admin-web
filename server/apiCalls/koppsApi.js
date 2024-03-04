'use strict'

const log = require('@kth/log')
const redis = require('kth-node-redis')
const connections = require('@kth/api-call').Connections
const config = require('../configuration').server

const koppsOpts = {
  log,
  https: true,
  redis,
  cache: config.cache,
  timeout: 5000,
  defaultTimeout: config.koppsApi.defaultTimeout,
  retryOnESOCKETTIMEDOUT: true,
  useApiKey: false, // skip key
}

config.koppsApi.doNotCallPathsEndpoint = true // skip checking _paths, because kopps doesnt have it
config.koppsApi.connected = true
// config.koppsApi.json = true
const koppsConfig = {
  koppsApi: config.koppsApi,
}
const api = connections.setup(koppsConfig, koppsConfig, koppsOpts)

const kursutvecklingConfig = {
  kursutvecklingApi: config.kursutvecklingApi,
}
const kursutvecklingApi = connections.setup(kursutvecklingConfig, config.apiKey)

const kursPmDataApiConfig = {
  kursPmDataApi: config.kursPmDataApi,
}
const kursPmDataApi = connections.setup(kursPmDataApiConfig, config.apiKey)

const getKoppsCourseData = async courseCode => {
  const { client } = api.koppsApi
  const uri = `${config.koppsApi.basePath}course/${encodeURIComponent(courseCode)}`
  try {
    const resp = await client.getAsync({ uri, useCache: true })

    const { body, statusCode } = resp
    if (!body || statusCode !== 200) {
      log.debug(`Failed response ${statusCode} from KOPPS API calling ${uri}`)
    }

    return { body, statusCode }
  } catch (err) {
    log.error('Exception calling from koppsAPI in koppsApi.koppsCourseData', { error: err })
    throw err
  }
}

async function getCourseSchool(courseCode) {
  const { client } = api.koppsApi
  const uri = `${config.koppsApi.basePath}course/${encodeURIComponent(courseCode)}`
  try {
    const { body: course, statusCode } = await client.getAsync({ uri, useCache: true })
    if (!course || statusCode !== 200) return 'kopps_get_fails'

    const { school } = course
    if (!school) return 'missing_school_code'
    const { code } = school
    if (!code) return 'missing_school_code'
    return code
  } catch (err) {
    return err
  }
}

function parseOrSetEmpty(value, lang = 'sv') {
  const langIndex = lang === 'en' ? 0 : 1
  const EMPTY = ['No information inserted', 'Ingen information tillagd']

  return value ? value : EMPTY[langIndex]
}

const filteredKoppsData = async (courseCode, lang = 'sv') => {
  try {
    const { body: course, statusCode } = await getKoppsCourseData(courseCode)

    if (statusCode !== 200) {
      return {
        apiError: true,
        statusCode,
        courseTitleData: {
          course_code: courseCode.toUpperCase(),
        },
      }
    }

    const { code, credits, mainSubjects, title } = course
    log.debug('Got kopps data for course', courseCode, code)

    const courseTitleData = {
      courseCode: parseOrSetEmpty(code, lang),
      courseTitle: parseOrSetEmpty(title[lang], lang),
      courseCredits: parseOrSetEmpty(credits, lang),
    }

    const mainSubject = mainSubjects
      ? mainSubjects.map(({ name: subjectName }) => (subjectName ? subjectName.sv || ' ' : ' ')).sort()[0] // course AK204V
      : ' '

    return {
      apiError: false,
      mainSubject,
      courseTitleData,
      statusCode,
    }
  } catch (error) {
    log.error('Error in filteredKoppsData while trying to filter data from KOPPS', { error })

    return {
      apiError: true,
      mainSubject: ' ',
      courseTitleData: {
        courseCode: courseCode.toUpperCase(),
      },
    }
  }
}

module.exports = { getCourseSchool, filteredKoppsData, koppsApi: api, kursutvecklingApi, kursPmDataApi }
