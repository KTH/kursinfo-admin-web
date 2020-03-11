'use strict'

const statisticApis = require('./koppsApi')
const log = require('kth-node-log')
const config = require('./configuration').server
const redis = require('kth-node-redis')
const connections = require('kth-node-api-call').Connections
const EMPTY = {
  en: 'No information inserted',
  sv: 'Ingen information tillagd'
}
const SCHOOL_MAP = {
  ABE: 'ABE',
  CBH: 'CBH',
  STH: 'CBH',
  CHE: 'CBH',
  BIO: 'CBH',
  CSC: 'EECS',
  ECE: 'EECS',
  EECS: 'EECS',
  EES: 'EECS',
  ICT: 'EECS',
  ITM: 'ITM',
  SCI: 'SCI'
}


const kursutvecklingData = async (semester) => {
  const { client } = statisticApis.kursutvecklingApi.kursutvecklingApi
  const uri = `/api/kursutveckling/v1/courseAnalyses/${semester}`
  try {
    const response = await client.getAsync({ uri })
    const courseAnalyses = {}
    if (response.body) {
      response.body.forEach(ca => {
        courseAnalyses[ca.courseCode] = courseAnalyses[ca.courseCode] || { numberOfUniqAnalyses: 0 }
        courseAnalyses[ca.courseCode].numberOfUniqAnalyses++
        ca.roundIdList.split(',').forEach(roundId => {
          courseAnalyses[ca.courseCode][roundId] = ca.analysisFileName
        })
      })
    }
    return courseAnalyses
  } catch (err) {
    log.error(err)
    throw err
  }
}

const addCourseAnalysesPerCourseRound = async (courseOfferingsWithoutAnalysis, courseAnalyses) => {
  const courseOfferings = []
  courseOfferingsWithoutAnalysis.forEach(courseOfferingWithoutAnalysis => {
    const courseCode = courseOfferingWithoutAnalysis.courseCode
    const offeringId = Number(courseOfferingWithoutAnalysis.offeringId)
    if (courseAnalyses[courseCode] &&
      courseAnalyses[courseCode][offeringId]) {
      const courseOffering = {
        ...courseOfferingWithoutAnalysis,
        courseAnalysis: courseAnalyses[courseCode][offeringId]
      }
      courseOfferings.push(courseOffering)
    } else {
      courseOfferings.push({
        ...courseOfferingWithoutAnalysis,
        courseAnalysis: ''
      })
    }
  })
  return courseOfferings
}

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

function isValidData (dataObject, lang = 'sv') {
  return !dataObject ? EMPTY[lang] : dataObject
}

function fetchStatisticPerDepartment (courses) {
  const courseOfferingsWithoutAnalysis = []
  courses.body.forEach(course => {
    courseOfferingsWithoutAnalysis.push({
      semester: course.first_yearsemester,
      schoolMainCode: SCHOOL_MAP[course.school_code] || '---',
      departmentName: course.department_name,
      courseCode: course.course_code,
      offeringId: course.offering_id
    })
  })
  return courseOfferingsWithoutAnalysis
}

function fetchNumOfAnalyses(courseAnalyses, courseCode) {
  return courseAnalyses[courseCode] && courseAnalyses[courseCode].numberOfUniqAnalyses || 0          

}
function fetchStatisticsPerSchool (courseAnalyses, courses) {
  const schools = {}
  let totalNumberOfCourses = 0
  let totalNumberOfAnalyses = 0
  courses.body.forEach(cR => {
    const { school_code, course_code } = cR
    if (SCHOOL_MAP[school_code]) {
      const code = SCHOOL_MAP[school_code]
      if (schools[code]) {
        if (!schools[code].courseCodes.includes(course_code)) {
          schools[code].courseCodes.push(course_code)
          totalNumberOfCourses++
          schools[code].numberOfCourses += 1
          schools[code].numberOfUniqAnalyses += fetchNumOfAnalyses(courseAnalyses, course_code)
        }
      } else {
        totalNumberOfCourses++
        schools[code] = { 
          numberOfCourses: 1,
          courseCodes: [course_code], // we need to control numbers of uniqueAnalyses, totalNumbers per course code
          numberOfUniqAnalyses: fetchNumOfAnalyses(courseAnalyses, course_code)
        }
      }
    }
  })
  Object.values(schools).forEach(sc => totalNumberOfAnalyses += sc.numberOfUniqAnalyses)
  return { schools, totalNumberOfCourses, totalNumberOfAnalyses }
}

const fetchStatistic = async (courseRound) => {
  try {
    const { client } = statisticApis.koppsApi.koppsApi

    const courseAnalyses = await kursutvecklingData(courseRound)
    const courses = await client.getAsync({ uri: `${config.koppsApi.basePath}courses/offerings?from=${encodeURIComponent(courseRound)}&skip_coordinator_info=true`, useCache: true })
    const courseOfferingsWithoutAnalysis = await fetchStatisticPerDepartment(courses)
    const combinedDataPerDepartment = await addCourseAnalysesPerCourseRound(courseOfferingsWithoutAnalysis, courseAnalyses)
    const combinedDataPerSchool = await fetchStatisticsPerSchool(courseAnalyses, courses)

    return {
      totalOfferings: courses.body.length,
      courseRound,
      combinedDataPerSchool,
      courseOfferings: combinedDataPerDepartment
    }
  } catch (err) {
    log.error('Exception calling from koppsAPI in koppsApi.fetchStatistic', { error: err })
    throw err
  }
}

module.exports = { fetchStatistic }
