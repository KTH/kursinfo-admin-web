'use strict'

const _ = require('lodash')
const log = require('kth-node-log')

const statisticApis = require('./koppsApi')
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

/**
 * TODO: Write tests for this function!
 * TODO: Remove 'numberOfUniqAnalyses'.
 * Fetch course analyses for semester from '/api/kursutveckling/v1/courseAnalyses/'.
 * @param {string} semester Semester to get course analyses for
 * @returns {{}}            Course analyses collected under course codes
 */
const _kursutvecklingData = async (semester) => {
  const { client } = statisticApis.kursutvecklingApi.kursutvecklingApi
  const uri = `/api/kursutveckling/v1/courseAnalyses/${semester}`
  try {
    const response = await client.getAsync({ uri })
    const courseAnalyses = {}
    if (response.body) {
      response.body.forEach((ca) => {
        courseAnalyses[ca.courseCode] = courseAnalyses[ca.courseCode] || { numberOfUniqAnalyses: 0 }
        courseAnalyses[ca.courseCode].numberOfUniqAnalyses++
        courseAnalyses[ca.courseCode][semester] = courseAnalyses[ca.courseCode][semester] || {}
        ca.roundIdList.split(',').forEach((roundId) => {
          courseAnalyses[ca.courseCode][semester][roundId] = ca.analysisFileName
        })
      })
    }
    // log.debug('_kursutvecklingData returns', courseAnalyses)
    return courseAnalyses
  } catch (err) {
    log.error(err)
    throw err
  }
}

/**
 * TODO: Write tests for this function!
 * TODO: Remove 'numberOfUniqPdfMemos' and 'numberOfUniqMemos'.
 * Fetch course memos for semester from '/api/kurs-pm-data/v1/webAndPdfPublishedMemosBySemester/'.
 * @param {string} semester Semester to get course analyses for
 * @returns {{}}            Course memos collected under course codes
 */
const _kursPmDataApiData = async (semester) => {
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

            memos[courseCode][semester] = memos[courseCode][semester] || {}
            ladokRoundIds.forEach((roundId) => {
              memos[courseCode][semester][roundId] = {
                memoId: courseMemoFileName || memoEndPoint,
                isPdf
              }
            })
          }
        }
      )
    }
    // log.debug('_kursPmDataApiData returns', memos)
    return memos
  } catch (err) {
    log.error(err)
    throw err
  }
}

/**
 * Matches analyses and memos with course offerings.
 * @param {[]} rawCourseOfferings Array of offerings’ relevant data
 * @param {{}} analysis           Collection of course analyses
 * @param {{}} memos              Collection of course memos
 * @returns {[]}                  Array of course offerings, and their documents
 */
const _documentsPerCourseOffering = (rawCourseOfferings, analysis, memos) => {
  const courseOfferings = []

  rawCourseOfferings.forEach((cO) => {
    const { courseCode, semester } = cO
    const offeringId = Number(cO.offeringId)
    let courseAnalysis = ''
    let courseMemoInfo = {}
    if (
      analysis[courseCode] &&
      analysis[courseCode][semester] &&
      analysis[courseCode][semester][offeringId]
    )
      courseAnalysis = analysis[courseCode][semester][offeringId]
    if (memos[courseCode] && memos[courseCode][semester] && memos[courseCode][semester][offeringId])
      courseMemoInfo = memos[courseCode][semester][offeringId]

    const courseOffering = {
      ...cO,
      courseAnalysis,
      courseMemoInfo
    }
    courseOfferings.push(courseOffering)
  })

  // log.debug('_documentsPerCourseOffering returns', courseOfferings)
  return courseOfferings
}

/**
 * Creates string of programs in list.
 * @param {[]} programs   Programs as returned by '/api/kopps/v2/courses/offerings' in 'connected_programs'.
 * @returns {string}      String with program data, separated by comma
 */
function _getProgramList(programs) {
  const programsList =
    (programs &&
      programs.map(
        ({ code, study_year: studyYear, spec_code: specCode }) =>
          `${code}${specCode ? '-' + specCode : ''}-${studyYear}`
      )) ||
    []
  const programsString = programsList.join(', ')
  // log.debug('_getProgramList returns', programsString)
  return programsString
}

/**
 * Compiles list of offerings’ relevant data.
 * @param {{}} courses      Courses as returned by '/api/kopps/v2/courses/offerings'.
 * @param {string} semester Course offering’s last semester
 * @returns {[]}            Array of offerings’ relevant data
 */
function _getOfferingsWithoutAnalysis(courses, semester) {
  const courseOfferingsWithoutAnalysis = []
  courses.body.forEach((course) => {
    const { offered_semesters: offeredSemesters } = course
    const courseOfferingLastSemester =
      Array.isArray(offeredSemesters) && offeredSemesters.length
        ? offeredSemesters[offeredSemesters.length - 1].semester
        : ''
    if (courseOfferingLastSemester === semester) {
      courseOfferingsWithoutAnalysis.push({
        semester: course.first_yearsemester,
        schoolMainCode: SCHOOL_MAP[course.school_code] || '---',
        departmentName: course.department_name,
        connectedPrograms: _getProgramList(course.connected_programs),
        courseCode: course.course_code,
        offeringId: course.offering_id
      })
    }
  })
  // log.debug('_getOfferingsWithoutAnalysis returns', courseOfferingsWithoutAnalysis)
  return courseOfferingsWithoutAnalysis
}

/**
 * TODO: Write tests for this function!
 * Compiles collection with statistics per school, and totals.
 * @param {{}} courseAnalyses   Collection of course analyses
 * @param {{}} courseMemoData   Collection of course memos
 * @param {{}} courses          Courses as returned by '/api/kopps/v2/courses/offerings'
 * @returns {{}}                Collection with statistics per school, and totals
 */
function _dataPerSchool(courseAnalyses, courseMemoData, courses, courseOfferings = []) {
  const schools = {}
  const uniqueCourseAnalysis = []
  const uniqueCourseMemoPublished = []
  const uniqueCourseMemoPdf = []
  let totalNumberOfCourses = 0
  let totalNumberOfAnalyses = 0
  let totalNumberOfWebMemos = 0
  let totalNumberOfPdfMemos = 0

  courseOfferings.forEach((courseOffering) => {
    const { schoolMainCode, courseCode, courseAnalysis, courseMemoInfo } = courseOffering
    if (SCHOOL_MAP[schoolMainCode]) {
      const schoolCode = SCHOOL_MAP[schoolMainCode]
      let numberOfAnalyses = 0
      if (courseAnalysis) {
        if (!uniqueCourseAnalysis.includes(courseAnalysis)) {
          uniqueCourseAnalysis.push(courseAnalysis)
          numberOfAnalyses = 1
        }
      }
      let numberOfMemoPdf = 0
      let numberOfMemoPublished = 0
      if (!_.isEmpty(courseMemoInfo)) {
        if (courseMemoInfo.isPdf) {
          if (!uniqueCourseMemoPdf.includes(courseMemoInfo.memoId)) {
            uniqueCourseMemoPdf.push(courseMemoInfo.memoId)
            numberOfMemoPdf = 1
          }
        } else if (!uniqueCourseMemoPublished.includes(courseMemoInfo.memoId)) {
          uniqueCourseMemoPublished.push(courseMemoInfo.memoId)
          numberOfMemoPublished = 1
        }
      }
      if (schools[schoolCode]) {
        if (!schools[schoolCode].courseCodes.includes(courseCode)) {
          schools[schoolCode].courseCodes.push(courseCode)
          totalNumberOfCourses++
          schools[schoolCode].numberOfCourses += 1
          schools[schoolCode].numberOfUniqAnalyses += numberOfAnalyses
          schools[schoolCode].numberOfUniqMemos += numberOfMemoPublished
          schools[schoolCode].numberOfUniqPdfMemos += numberOfMemoPdf
        } else {
          schools[schoolCode].numberOfUniqAnalyses += numberOfAnalyses
          schools[schoolCode].numberOfUniqMemos += numberOfMemoPublished
          schools[schoolCode].numberOfUniqPdfMemos += numberOfMemoPdf
        }
      } else {
        totalNumberOfCourses++
        schools[schoolCode] = {
          numberOfCourses: 1,
          courseCodes: [courseCode],
          numberOfUniqAnalyses: numberOfAnalyses,
          numberOfUniqMemos: numberOfMemoPublished,
          numberOfUniqPdfMemos: numberOfMemoPdf
        }
      }
    }
  })

  Object.values(schools).forEach((sc) => {
    totalNumberOfAnalyses += sc.numberOfUniqAnalyses
    totalNumberOfWebMemos += sc.numberOfUniqMemos
    totalNumberOfPdfMemos += sc.numberOfUniqPdfMemos
  })
  const dataPerSchool = {
    schools,
    totalNumberOfCourses,
    totalNumberOfAnalyses,
    totalNumberOfWebMemos,
    totalNumberOfPdfMemos
  }
  // log.debug('_dataPerSchool returns', dataPerSchool)
  return dataPerSchool
}

/**
 * Finds earliest semester in list of offerings.
 * @param {[]} rawCourseOfferings  Array of offerings’ relevant data
 * @returns {number}               Earliest semester found
 */
const _earliestSemesterInRawCourseOfferings = (rawCourseOfferings) => {
  const maxEarliestSemester = '21001'
  const earliestSemester = rawCourseOfferings.reduce((foundSemester, courseOffering) => {
    return courseOffering.semester && foundSemester.localeCompare(courseOffering.semester) > 0
      ? courseOffering.semester
      : foundSemester
  }, maxEarliestSemester)
  if (earliestSemester === maxEarliestSemester) {
    throw new Error(
      '_earliestSemesterInRawCourseOfferings - No semesters found in course offerings',
      rawCourseOfferings
    )
  }
  return earliestSemester
}

/**
 * Create list of semesters between two semesters, including start and end semesters.
 * @param {string} startSemester  First semester in span
 * @param {string} endSemester    Last semester in span
 * @returns {[]}                  Array with span of semesters
 */
const _spanOfSemesters = (startSemester, endSemester) => {
  const start = parseInt(startSemester, 10)
  const end = parseInt(endSemester, 10)
  const semesters = []
  for (let semester = start; semester <= end; semester % 10 === 2 ? (semester += 9) : semester++) {
    semesters.push(semester.toString())
  }
  return semesters
}

/**
 * TODO: Can probably remove when 'numberOfUniqAnalyses', 'numberOfUniqPdfMemos', and 'numberOfUniqMemos', are removed.
 * Customizer for Lodash mergeWidth, which is invoked to produce the merged values of the destination and source properties.
 * Custom merge of 'numberOfUniqAnalyses', 'numberOfUniqPdfMemos', or 'numberOfUniqMemos'.
 * @param {{}} objValue Object to merge with
 * @param {{}} srcValue Object to merge from
 * @param {string} key  Current property key
 */
// eslint-disable-next-line consistent-return
const _customizer = (objValue, srcValue, key) => {
  if (
    (key === 'numberOfUniqAnalyses' ||
      key === 'numberOfUniqPdfMemos' ||
      key === 'numberOfUniqMemos') &&
    Number.isInteger(objValue) &&
    Number.isInteger(srcValue)
  ) {
    return objValue + srcValue
  }
}

/**
 * Fetch course analyses for each semester in list of semesters.
 * @param {[]} semesters Array of semesters
 */
const _fetchCourseAnalyses = async (semesters) => {
  let courseAnalyses = {}
  for await (const semester of semesters) {
    const courseAnalysesForSemester = await _kursutvecklingData(semester)
    courseAnalyses = _.mergeWith({}, courseAnalyses, courseAnalysesForSemester, _customizer)
  }
  // log.debug('_fetchCourseAnalyses returns', courseAnalyses)
  return courseAnalyses
}

/**
 * Fetch course memos for each semester in list of semesters.
 * @param {[]} semesters Array of semesters
 */
const _fetchCourseMemos = async (semesters) => {
  let courseMemos = {}
  for await (const semester of semesters) {
    const courseMemosForSemester = await _kursPmDataApiData(semester)
    courseMemos = _.mergeWith({}, courseMemos, courseMemosForSemester, _customizer)
  }
  // log.debug('_fetchCourseMemos returns', courseMemos)
  return courseMemos
}

/**
 * TODO: Write tests for this function!
 * Compile statistics for given semester.
 * Semester is in format {year}{1 for spring||2 for fall}, e.g. 20192 for fall semester of 2019.
 * @param {number} semester Semester to compile statistics for
 * @returns {{}}            Statistics data formatted for state store
 */
const fetchStatistic = async (semester) => {
  try {
    const { client } = statisticApis.koppsApi.koppsApi

    // Returns a list of course rounds valid for given semester parameter.
    const courses = await client.getAsync({
      uri: `${config.koppsApi.basePath}courses/offerings?from=${encodeURIComponent(
        semester
      )}&skip_coordinator_info=true`,
      useCache: true
    })

    // Array of offerings’ relevant data.
    const rawCourseOfferings = _getOfferingsWithoutAnalysis(courses, semester)

    // Earliest semester found in offerings.
    // TODO: Rework this and use of function _spanOfSemesters to only included needed semesters.
    const earliestSemester = _earliestSemesterInRawCourseOfferings(rawCourseOfferings)

    // For each semester in span of earliest and choosen semester,
    // fetch course analyses and course memos.
    const semesters = _spanOfSemesters(earliestSemester, semester)

    const courseAnalyses = await _fetchCourseAnalyses(semesters)
    const courseMemoData = await _fetchCourseMemos([semester])

    // Matches analyses and memos with course offerings.
    const combinedDataPerDepartment = _documentsPerCourseOffering(
      rawCourseOfferings,
      courseAnalyses,
      courseMemoData
    )

    // Compiles statistics per school, including totals.
    const combinedDataPerSchool = _dataPerSchool(
      courseAnalyses,
      courseMemoData,
      courses,
      combinedDataPerDepartment
    )

    return {
      totalOfferings: courses.body.length,
      semester,
      combinedDataPerSchool,
      courseOfferings: combinedDataPerDepartment
    }
  } catch (err) {
    log.error('Exception in statisticsTransformer.fetchStatistic', { error: err })
    throw err
  }
}

// "Internal" functions exported for test purposes
module.exports = {
  fetchStatistic,
  _getOfferingsWithoutAnalysis,
  _earliestSemesterInRawCourseOfferings,
  _spanOfSemesters,
  _fetchCourseAnalyses,
  _fetchCourseMemos,
  _documentsPerCourseOffering,
  _dataPerSchool
}
