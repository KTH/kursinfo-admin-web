'use strict'
const log = require('kth-node-log')
const config = require('./configuration').server
const redis = require('kth-node-redis')
const connections = require('kth-node-api-call').Connections
const EMPTY = {
  en: 'No information inserted',
  sv: 'Ingen information tillagd'
}

const koppsOpts = {
  log,
  https: true,
  redis,
  cache: config.cache,
  timeout: 5000,
  defaultTimeout: config.koppsApi.defaultTimeout,
  retryOnESOCKETTIMEDOUT: true,
  useApiKey: false // skip key
}

config.koppsApi.doNotCallPathsEndpoint = true // skip checking _paths, because kopps doesnt have it
config.koppsApi.connected = true
// config.koppsApi.json = true
const koppsConfig = {
  koppsApi: config.koppsApi
}
const api = connections.setup(koppsConfig, koppsConfig, koppsOpts)

const kursutvecklingConfig = {
  kursutvecklingApi: config.kursutvecklingApi
}
const kursutvecklingApi = connections.setup(kursutvecklingConfig, config.apiKey)

const koppsCourseData = async (courseCode) => {
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

function isValidData (dataObject, lang='sv') {
  return !dataObject ? EMPTY[lang] : dataObject
}

const filteredKoppsData = async (courseCode, lang='sv') => {
  try {
    const courseObj = await koppsCourseData(courseCode)
    log.debug('Got kopps data for course', courseObj.code)
    const courseTitleData = {
      course_code: isValidData(courseObj.code, lang),
      course_title: isValidData(courseObj.title[lang], lang),
      course_credits: isValidData(courseObj.credits, lang),
      apiError: false
    }
    const koppsText = { // kopps recruitmentText
      sv: courseObj.info ? isValidData(courseObj.info.sv, lang): EMPTY[lang],
      en: courseObj.info ? isValidData(courseObj.info.en, lang): EMPTY[lang]
    }
    const mainSubject = courseObj.mainSubjects ? courseObj.mainSubjects.map(s => s.name.sv).sort()[0] : ' '
    return {
      koppsText,
      mainSubject,
      courseTitleData,
      lang,
      langIndex: lang === 'en' ? 0 : 1
    }
  } catch(error) {
    log.error("Error in filteredKoppsData while trying to filter data from KOPPS", {error})
      const courseTitleData = {
        course_code: courseCode.toUpperCase(),
        apiError: true
      }
      const koppsText = { // kopps recruitmentText
        sv: ' ',
        en: ' '
      }
      return {
        courseTitleData,
        koppsText,
        mainSubject: ' ',
        lang
      }
  }
}

module.exports = { filteredKoppsData, koppsApi: api, kursutvecklingApi }


