'use strict'
const { BasicAPI } = require('kth-node-api-call')
const { server } = require('./configuration')
const log = require('kth-node-log')
const redis = require('kth-node-redis')
const EMPTY = {
  en: 'No information inserted',
  sv: 'Ingen information tillagd'
}
const koppsApi = new BasicAPI({
  hostname: server.kopps.host,
  basePath: server.kopps.basePath,
  https: server.kopps.https,
  json: true,
  defaultTimeout: server.kopps.defaultTimeout,
  options: {
    redis: {
      client: redis,
      prefix: 'course-info-admin-kopps',
      expire: 20000
    }
  }
})

const koppsCourseData = async (courseCode) => {
  try {
    const course = await koppsApi.getAsync({ uri: `course/${encodeURIComponent(courseCode)}`, useCache: true })
    return course.body
  } catch (err) {
    log.error('Exception calling from koppsAPI in koppsApi.koppsCourseData', { error: err })
    throw err
  }
}

function isValidData (dataObject, lang='sv') {
  return !dataObject ? EMPTY[lang] : dataObject
}

const fetchStatistic = async (courseRound) => {
  try {
    const course = await koppsApi.getAsync({ uri: `courses/offerings?from=${encodeURIComponent(courseRound)}`, useCache: true })

    let departments = {}
    
    course.body.forEach(cR => {
      const code = cR.department_code
      if (departments[code]) departments[code].number +=1
      else departments[code] = { number : 1, name: cR.department_name}
    })
    console.log('perDepartment ', departments)

    return {
      totalOfferings: course.body.length,
      departmentsNameArr: Object.keys(departments),
      departments,
      courseRound
    }
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
    log.info(' kopps data ', courseObj)
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

module.exports = { filteredKoppsData, fetchStatistic }


