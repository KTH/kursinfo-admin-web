'use strict'
const log = require('@kth/log')
const redis = require('kth-node-redis')
const connections = require('@kth/api-call').Connections
const EMPTY = ['No information inserted', 'Ingen information tillagd']
const config = require('./configuration').server

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

const koppsCourseData = async courseCode => {
  const { client } = api.koppsApi
  const uri = `${config.koppsApi.basePath}course/${encodeURIComponent(courseCode)}`
  try {
    const course = await client.getAsync({ uri, useCache: true })
    return course.body
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

function isValidData(dataObject, lang = 'sv') {
  const langIndex = lang === 'en' ? 0 : 1

  return !dataObject ? EMPTY[langIndex] : dataObject
}

const filteredKoppsData = async (courseCode, lang = 'sv') => {
  const langIndex = lang === 'en' ? 0 : 1
  try {
    const courseObj = await koppsCourseData(courseCode)
    log.debug('Got kopps data for course', courseObj.code)
    const { info } = courseObj
    const courseTitleData = {
      course_code: isValidData(courseObj.code, lang),
      course_title: isValidData(courseObj.title[lang], lang),
      course_credits: isValidData(courseObj.credits, lang),
      apiError: false,
    }
    const koppsText = {
      // kopps recruitmentText
      sv: info && info.sv ? isValidData(courseObj.info.sv, lang) : EMPTY[langIndex],
      en: info && info.en ? isValidData(courseObj.info.en, lang) : EMPTY[langIndex],
    }

    const mainSubject = courseObj.mainSubjects
      ? courseObj.mainSubjects.map(s => (s.name ? s.name.sv || ' ' : ' ')).sort()[0] // course AK204V
      : ' '
    return {
      koppsText,
      mainSubject,
      courseTitleData,
      lang,
      langIndex: lang === 'en' ? 0 : 1,
    }
  } catch (error) {
    log.error('Error in filteredKoppsData while trying to filter data from KOPPS', { error })
    const courseTitleData = {
      course_code: courseCode.toUpperCase(),
      apiError: true,
    }
    const koppsText = {
      // kopps recruitmentText
      sv: ' ',
      en: ' ',
    }
    return {
      courseTitleData,
      koppsText,
      mainSubject: ' ',
      lang,
    }
  }
}

module.exports = { getCourseSchool, filteredKoppsData, koppsApi: api, kursutvecklingApi, kursPmDataApi }
