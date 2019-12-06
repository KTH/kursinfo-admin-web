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

const kursutvecklingData = async (semester) => {
  const { client } = kursutvecklingApi.kursutvecklingApi
  const uri = `/api/kursutveckling/v1/courseAnalyses/${semester}`  
  try {
    const response = await client.getAsync({uri})
    let courseAnalyses = {}
    if (response.body) {
      response.body.forEach(courseAnalysis => {
        courseAnalyses[courseAnalysis.courseCode] = {}
        courseAnalysis.roundIdList.split(',').forEach(roundId => {
          courseAnalyses[courseAnalysis.courseCode][roundId] = courseAnalysis.analysisFileName
        })
      });
    }
    return courseAnalyses
  } catch (err) {
    log.error(err)
    throw err
  }
}

// const addCourseAnalyses = async (courseOfferingsWithoutAnalysis) => {
//   const courseOfferings = await Promise.all(courseOfferingsWithoutAnalysis.map(async courseOfferingWithoutAnalysis => {
//     const courseAnalyses = await kursutvecklingData(courseOfferingWithoutAnalysis.courseCode, courseOfferingWithoutAnalysis.semester)
//     return {
//       ...courseOfferingWithoutAnalysis,
//       courseAnalysis: courseAnalyses[courseOfferingWithoutAnalysis.offeringId] ? courseAnalyses[courseOfferingWithoutAnalysis.offeringId] : ''
//     }
//   }))
//   return courseOfferings
// }

const addCourseAnalyses = async (courseRound, courseOfferingsWithoutAnalysis) => {
  const courseOfferings = []
  const courseAnalyses = await kursutvecklingData(courseRound)
  courseOfferingsWithoutAnalysis.forEach(courseOfferingWithoutAnalysis => {
    if (courseAnalyses[courseOfferingWithoutAnalysis.courseCode] &&
      courseAnalyses[courseOfferingWithoutAnalysis.courseCode][Number(courseOfferingWithoutAnalysis.offeringId)]) {
        courseOfferings.push({
          ...courseOfferingWithoutAnalysis,
          courseAnalysis: courseAnalyses[courseOfferingWithoutAnalysis.courseCode][Number(courseOfferingWithoutAnalysis.offeringId)]
        })
    } else {
      courseOfferings.push({
        ...courseOfferingWithoutAnalysis,
        courseAnalysis: ''
       })
    }
  })
  log.debug("Course Offerings: ", courseOfferings)
  return courseOfferings
}

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

function isValidData (dataObject, lang='sv') {
  return !dataObject ? EMPTY[lang] : dataObject
}

const fetchStatistic = async (courseRound) => {
  try {
    const { client } = api.koppsApi

    const courses = await client.getAsync({ uri: `${config.koppsApi.basePath}courses/offerings?from=${encodeURIComponent(courseRound)}`, useCache: true })

    if (courses.statusCode !== 200) {
      return {
        totalOfferings: 0,
        departmentsNameArr: [],
        departments: [],
        courseRound: '',
        courseOfferingsWithoutAnalysis: [{
          semester: 'HT2019',
          departmentName: 'EECS/Matematik',
          courseCode: 'SF1624',
          offeringId: '1'
        },
        {
          semester: 'HT2019',
          departmentName: 'EECS/Matematik',
          courseCode: 'SF1624',
          offeringId: '2'
        },
        {
          semester: 'HT2019',
          departmentName: 'EECS/Matematik',
          courseCode: 'SF1624',
          offeringId: '3'
        },
        {
          semester: 'HT2019',
          departmentName: 'EECS/Matematik',
          courseCode: 'SF1624',
          offeringId: '4'
        }]
      }
    }

    const courseOfferingsWithoutAnalysis = []  
    courses.body.forEach(course => {
      courseOfferingsWithoutAnalysis.push({
        semester: course.first_yearsemester,
        departmentName: course.department_name,
        courseCode: course.course_code,
        offeringId: course.offering_id
      })      
    })

    const courseOfferings = await addCourseAnalyses(courseRound, courseOfferingsWithoutAnalysis)

    let departments = {}
    courses.body.forEach(cR => {
      const code = cR.department_code
      if (departments[code]) departments[code].number +=1
      else departments[code] = { number : 1, name: cR.department_name}
    })

    return {
      totalOfferings: courses.body.length,
      departmentsNameArr: Object.keys(departments),
      departments,
      courseRound,
      courseOfferings
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

module.exports = { filteredKoppsData, fetchStatistic }


