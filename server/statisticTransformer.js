'use strict'

const statisticApis = require('./koppsApi')
const log = require('kth-node-log')
const config = require('./configuration').server

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
      response.body.forEach((ca) => {
        courseAnalyses[ca.courseCode] = courseAnalyses[ca.courseCode] || { numberOfUniqAnalyses: 0 }
        courseAnalyses[ca.courseCode].numberOfUniqAnalyses++
        ca.roundIdList.split(',').forEach((roundId) => {
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

const kursPmDataApiData = async (semester) => {
  const { client } = statisticApis.kursPmDataApi.kursPmDataApi
  const uri = `/api/kurs-pm-data/v1/webAndPdfPublishedMemosBySemester/${semester}`
  try {
    const response = await client.getAsync({ uri })
    const memos = {}
    if (response.body) {
      response.body.forEach(
        ({ courseCode, courseMemoFileName, ladokRoundIds, memoEndPoint, isPdf }) => {
          if (ladokRoundIds) {
            memos[courseCode] = memos[courseCode] || {
              [isPdf ? 'numberOfUniqPdfMemos' : 'numberOfUniqMemos']: 0
            }
            if (isPdf) memos[courseCode].numberOfUniqPdfMemos++
            else memos[courseCode].numberOfUniqMemos++

            ladokRoundIds.forEach((roundId) => {
              memos[courseCode][roundId] = { memoId: courseMemoFileName || memoEndPoint, isPdf }
            })
          }
        }
      )
    }
    return memos
  } catch (err) {
    log.error(err)
    throw err
  }
}

const documentsPerCourseOffering = async (rawCourseOfferings, analysis, memos) => {
  const courseOfferings = []

  rawCourseOfferings.forEach((cO) => {
    const { courseCode } = cO
    const offeringId = Number(cO.offeringId)
    let courseAnalysis = ''
    let courseMemoInfo = {}
    if (analysis[courseCode] && analysis[courseCode][offeringId])
      courseAnalysis = analysis[courseCode][offeringId]
    if (memos[courseCode] && memos[courseCode][offeringId])
      courseMemoInfo = memos[courseCode][offeringId]

    const courseOffering = {
      ...cO,
      courseAnalysis,
      courseMemoInfo
    }
    courseOfferings.push(courseOffering)
  })

  return courseOfferings
}

function _getProgramList(programs) {
  const programsList =
    (programs &&
      programs.map(
        ({ code, study_year, spec_code }) =>
          `${code}${spec_code ? '-' + spec_code : ''}-${study_year}`
      )) ||
    []
  return programsList.join(', ')
}

function fetchStatisticPerDepartment(courses) {
  const courseOfferingsWithoutAnalysis = []
  courses.body.forEach((course) => {
    courseOfferingsWithoutAnalysis.push({
      semester: course.first_yearsemester,
      schoolMainCode: SCHOOL_MAP[course.school_code] || '---',
      departmentName: course.department_name,
      connectedPrograms: _getProgramList(course.connected_programs),
      courseCode: course.course_code,
      offeringId: course.offering_id
    })
  })
  return courseOfferingsWithoutAnalysis
}

function getNumOfAnalyses(courseAnalyses, courseCode) {
  return (courseAnalyses[courseCode] && courseAnalyses[courseCode].numberOfUniqAnalyses) || 0
}

function getNumOfWebMemos(memos, courseCode) {
  return (memos[courseCode] && memos[courseCode].numberOfUniqMemos) || 0
}

function getNumOfPdfMemos(memos, courseCode) {
  return (memos[courseCode] && memos[courseCode].numberOfUniqPdfMemos) || 0
}
function fetchStatisticsPerSchool(courseAnalyses, courseMemoData, courses) {
  const schools = {}
  let totalNumberOfCourses = 0
  let totalNumberOfAnalyses = 0
  let totalNumberOfWebMemos = 0
  let totalNumberOfPdfMemos = 0

  courses.body.forEach((cR) => {
    const { school_code, course_code } = cR
    if (SCHOOL_MAP[school_code]) {
      const code = SCHOOL_MAP[school_code]
      if (schools[code]) {
        if (!schools[code].courseCodes.includes(course_code)) {
          schools[code].courseCodes.push(course_code)
          totalNumberOfCourses++
          schools[code].numberOfCourses += 1
          schools[code].numberOfUniqAnalyses += getNumOfAnalyses(courseAnalyses, course_code)
          schools[code].numberOfUniqMemos += getNumOfWebMemos(courseMemoData, course_code)
          schools[code].numberOfUniqPdfMemos += getNumOfPdfMemos(courseMemoData, course_code)
        }
      } else {
        totalNumberOfCourses++
        schools[code] = {
          numberOfCourses: 1,
          courseCodes: [course_code], // we need to control numbers of uniqueAnalyses, totalNumbers per course code
          numberOfUniqAnalyses: getNumOfAnalyses(courseAnalyses, course_code),
          numberOfUniqMemos: getNumOfWebMemos(courseMemoData, course_code),
          numberOfUniqPdfMemos: getNumOfPdfMemos(courseMemoData, course_code)
        }
      }
    }
  })
  Object.values(schools).forEach((sc) => {
    totalNumberOfAnalyses += sc.numberOfUniqAnalyses
    totalNumberOfWebMemos += sc.numberOfUniqMemos
    totalNumberOfPdfMemos += sc.numberOfUniqPdfMemos
  })
  return {
    schools,
    totalNumberOfCourses,
    totalNumberOfAnalyses,
    totalNumberOfWebMemos,
    totalNumberOfPdfMemos
  }
}

const fetchStatistic = async (semester) => {
  try {
    const { client } = statisticApis.koppsApi.koppsApi

    const courseAnalyses = await kursutvecklingData(semester)
    const courses = await client.getAsync({
      uri: `${config.koppsApi.basePath}courses/offerings?from=${encodeURIComponent(
        semester
      )}&skip_coordinator_info=true`,
      useCache: true
    })
    const courseMemoData = await kursPmDataApiData(semester)

    const rawCourseOfferings = await fetchStatisticPerDepartment(courses)

    const combinedDataPerDepartment = await documentsPerCourseOffering(
      rawCourseOfferings,
      courseAnalyses,
      courseMemoData
    )

    const combinedDataPerSchool = await fetchStatisticsPerSchool(
      courseAnalyses,
      courseMemoData,
      courses
    )

    return {
      totalOfferings: courses.body.length,
      semester,
      combinedDataPerSchool,
      courseOfferings: combinedDataPerDepartment
    }
  } catch (err) {
    log.error('Exception calling from koppsAPI in koppsApi.fetchStatistic', { error: err })
    throw err
  }
}

module.exports = { fetchStatistic }
