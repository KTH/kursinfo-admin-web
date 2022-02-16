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
  ECE: 'ITM',
  EECS: 'EECS',
  EES: 'EECS',
  ICT: 'EECS',
  ITM: 'ITM',
  SCI: 'SCI',
}

/**
 * TODO: Write tests for this function!
 * TODO: Remove 'numberOfUniqAnalyses'.
 * Fetch course analyses for semester from '/api/kursutveckling/v1/courseAnalyses/'.
 * @param {string} semester Semester to get course analyses for
 * @returns {{}}            Course analyses collected under course codes
 */
const _kursutvecklingData = async semester => {
  const { client } = statisticApis.kursutvecklingApi.kursutvecklingApi
  const uri = `/api/kursutveckling/v1/courseAnalyses/${semester}`
  try {
    const { body } = await client.getAsync({ uri })
    const courseAnalyses = {}
    if (body === 'Unauthorized') {
      throw new Error('Error while fetching analyses, wrong key to kursutveckling-api')
    }
    if (body) {
      body.forEach(ca => {
        courseAnalyses[ca.courseCode] = courseAnalyses[ca.courseCode] || { numberOfUniqAnalyses: 0 }
        courseAnalyses[ca.courseCode].numberOfUniqAnalyses++
        courseAnalyses[ca.courseCode][semester] = courseAnalyses[ca.courseCode][semester] || {}
        ca.roundIdList.split(',').forEach(roundId => {
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
const _kursPmDataApiData = async semester => {
  const { client } = statisticApis.kursPmDataApi.kursPmDataApi
  const uri = `/api/kurs-pm-data/v1/webAndPdfPublishedMemosBySemester/${semester}`
  try {
    const response = await client.getAsync({ uri })
    const memos = {}
    if (response.body) {
      response.body.forEach(
        ({ courseCode, courseMemoFileName, ladokRoundIds, memoEndPoint, isPdf, lastChangeDate }) => {
          if (ladokRoundIds) {
            memos[courseCode] = memos[courseCode] || {
              [isPdf ? 'numberOfUniqPdfMemos' : 'numberOfUniqMemos']: 0,
            }
            if (isPdf) memos[courseCode].numberOfUniqPdfMemos++
            else memos[courseCode].numberOfUniqMemos++

            memos[courseCode][semester] = memos[courseCode][semester] || {}
            ladokRoundIds.forEach(roundId => {
              memos[courseCode][semester][roundId] = {
                memoId: courseMemoFileName || memoEndPoint,
                lastChangeDate,
                isPdf,
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
function formatTimeToLocaleDateSV(parsedTime) {
  if (!parsedTime || parsedTime === NaN) return ''
  const options = { year: 'numeric', month: 'numeric', day: 'numeric' }
  const formattedTime = new Date(parsedTime).toLocaleDateString('sv-SE', options)
  return formattedTime
}
/**
 * Calculates and compiles memo publish data.
 * @param {[]} offeringStartDate  Offering’s start date, in format accepted by Date.parse
 * @param {{}} memoChangeDate     Memo’s change date, in format accepted by Date.parse
 * @returns {{}}                  Object with publish data for memo
 */
const _publishData = (offeringStartDate, memoChangeDate) => {
  const offeringStartTime = Date.parse(offeringStartDate)
  const publishedTime = Date.parse(memoChangeDate)
  const formattedOfferingStartTime = formatTimeToLocaleDateSV(offeringStartTime)
  const formattedPublishedTime = formatTimeToLocaleDateSV(publishedTime)
  const ONE_WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000
  return {
    offeringStartTime: formattedOfferingStartTime,
    publishedTime: formattedPublishedTime,
    publishedBeforeStart: offeringStartTime >= publishedTime,
    publishedBeforeDeadline: offeringStartTime - ONE_WEEK_IN_MS >= publishedTime,
  }
}

/**
 * Matches analyses and memos with course offerings.
 * @param {[]} parsedOfferings Array of offerings’ relevant data
 * @param {{}} analysis        Collection of course analyses
 * @param {{}} memos           Collection of course memos
 * @returns {{}}               Object with two arrays, each containing offerings and their documents.
 */
const _documentsPerCourseOffering = (parsedOfferings, analysis, memos) => {
  const courseOfferings = {
    withAnalyses: [],
    withMemos: [],
  }
  const { forAnalyses: offeringsWithAnalyses, forMemos: offeringsWithMemos } = parsedOfferings

  offeringsWithAnalyses.forEach(offering => {
    const { courseCode, semester } = offering
    const offeringId = Number(offering.offeringId)
    let courseAnalysis = ''
    if (analysis[courseCode] && analysis[courseCode][semester] && analysis[courseCode][semester][offeringId])
      courseAnalysis = analysis[courseCode][semester][offeringId]

    const courseOffering = {
      ...offering,
      courseAnalysis,
    }
    courseOfferings.withAnalyses.push(courseOffering)
  })

  offeringsWithMemos.forEach(offering => {
    const { courseCode, semester } = offering
    const offeringId = Number(offering.offeringId)
    let courseMemoInfo = {}
    if (memos[courseCode] && memos[courseCode][semester] && memos[courseCode][semester][offeringId]) {
      courseMemoInfo = memos[courseCode][semester][offeringId]
      courseMemoInfo.publishedData = _publishData(offering.startDate, courseMemoInfo.lastChangeDate)
    }
    const courseOffering = {
      ...offering,
      courseMemoInfo,
    }
    courseOfferings.withMemos.push(courseOffering)
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
 * Parses offerings from Kopps and returns an object with two lists:
 * - One list containing offerings that starts with semester parameter. This is used for course memos.
 * - One list containing offerings that ends with semester parameter. This is used for course analyses.
 * @param {{}} courses      Courses as returned by '/api/kopps/v2/courses/offerings'.
 * @param {string} semester Course offering’s first or last semester, depending on use
 * @returns {{}}            Object with two arrays, each containing offerings’ relevant data
 */
function _parseOfferings(courses, semester) {
  const parsedOfferings = {
    forAnalyses: [],
    forMemos: [],
  }

  if (Array.isArray(courses.body)) {
    courses.body.forEach(course => {
      // eslint-disable-next-line camelcase
      const { first_yearsemester: firstSemester, offered_semesters } = course
      // eslint-disable-next-line camelcase
      const offeredSemesters = Array.isArray(offered_semesters) ? offered_semesters : []

      const { start_date: offeredSemesterStartDate = '' } = offeredSemesters.find(os => os.semester === semester) || {}
      const startDate = offeredSemesterStartDate ? formatTimeToLocaleDateSV(Date.parse(offeredSemesterStartDate)) : ''
      const courseOfferingLastSemester = offeredSemesters.length
        ? offeredSemesters[offeredSemesters.length - 1].semester
        : ''

      if (courseOfferingLastSemester === semester) {
        parsedOfferings.forAnalyses.push({
          semester: firstSemester,
          startDate,
          schoolMainCode: SCHOOL_MAP[course.school_code] || '---',
          departmentName: course.department_name,
          connectedPrograms: _getProgramList(course.connected_programs),
          courseCode: course.course_code,
          offeringId: course.offering_id,
        })
      }
      if (firstSemester === semester) {
        parsedOfferings.forMemos.push({
          semester: firstSemester,
          startDate,
          schoolMainCode: SCHOOL_MAP[course.school_code] || '---',
          departmentName: course.department_name,
          connectedPrograms: _getProgramList(course.connected_programs),
          courseCode: course.course_code,
          offeringId: course.offering_id,
        })
      }
    })
  }
  // log.debug('_parseOfferings returns', courseOfferingsWithoutAnalysis)
  return parsedOfferings
}

/**
 * TODO: Write tests for this function!
 * Compiles collection with statistics per school, and totals, for analyses.
 * @param {[]} courseOfferings  Array containing offerings and their analyses
 * @returns {{}}                Collection with statistics per school, and totals, for analyses
 */
function _analysesDataPerSchool(courseOfferings) {
  const schools = {}
  const uniqueCourseAnalysis = []
  let totalNumberOfCourses = 0
  let totalNumberOfAnalyses = 0

  courseOfferings.forEach(courseOffering => {
    const { schoolMainCode, courseCode, courseAnalysis } = courseOffering
    if (SCHOOL_MAP[schoolMainCode]) {
      const schoolCode = SCHOOL_MAP[schoolMainCode]
      let numberOfAnalyses = 0
      if (courseAnalysis) {
        if (!uniqueCourseAnalysis.includes(courseAnalysis)) {
          uniqueCourseAnalysis.push(courseAnalysis)
          numberOfAnalyses = 1
        }
      }
      if (schools[schoolCode]) {
        if (!schools[schoolCode].courseCodes.includes(courseCode)) {
          schools[schoolCode].courseCodes.push(courseCode)
          totalNumberOfCourses++
          schools[schoolCode].numberOfCourses += 1
          schools[schoolCode].numberOfUniqAnalyses += numberOfAnalyses
        } else {
          schools[schoolCode].numberOfUniqAnalyses += numberOfAnalyses
        }
      } else {
        totalNumberOfCourses++
        schools[schoolCode] = {
          numberOfCourses: 1,
          courseCodes: [courseCode],
          numberOfUniqAnalyses: numberOfAnalyses,
        }
      }
    }
  })

  Object.values(schools).forEach(sc => {
    totalNumberOfAnalyses += sc.numberOfUniqAnalyses
  })
  const dataPerSchool = {
    schools,
    totalNumberOfCourses,
    totalNumberOfAnalyses,
  }
  // log.debug('_dataPerSchool returns', dataPerSchool)
  return dataPerSchool
}

/**
 * TODO: Write tests for this function!
 * Compiles collection with statistics per school, and totals, for memos.
 * @param {[]} courseOfferings  Array containing offerings and their memos
 * @returns {{}}                Collection with statistics per school, and totals, for memos
 */
function _memosDataPerSchool(courseOfferings) {
  const schools = {}
  const uniqueCourseMemoPublished = []
  const uniqueCourseMemoPdf = []
  let totalNumberOfCourses = 0
  let totalNumberOfWebMemos = 0
  let totalNumberOfPdfMemos = 0
  let totalNumberOfMemosPublishedBeforeStart = 0
  let totalNumberOfMemosPublishedBeforeDeadline = 0

  courseOfferings.forEach(courseOffering => {
    const { schoolMainCode, courseCode, courseMemoInfo } = courseOffering

    if (SCHOOL_MAP[schoolMainCode]) {
      const schoolCode = SCHOOL_MAP[schoolMainCode]
      let numberOfMemoPdf = 0
      let numberOfMemoPublished = 0
      let numberOfMemosPublishedBeforeStart = 0
      let numberOfMemosPublishedBeforeDeadline = 0
      if (!_.isEmpty(courseMemoInfo)) {
        if (courseMemoInfo.isPdf) {
          if (!uniqueCourseMemoPdf.includes(courseMemoInfo.memoId)) {
            uniqueCourseMemoPdf.push(courseMemoInfo.memoId)
            numberOfMemoPdf = 1
            if (courseMemoInfo.publishedData) {
              numberOfMemosPublishedBeforeStart = courseMemoInfo.publishedData.publishedBeforeStart ? 1 : 0
              numberOfMemosPublishedBeforeDeadline = courseMemoInfo.publishedData.publishedBeforeDeadline ? 1 : 0
            }
          }
        } else if (!uniqueCourseMemoPublished.includes(courseMemoInfo.memoId)) {
          uniqueCourseMemoPublished.push(courseMemoInfo.memoId)
          numberOfMemoPublished = 1
          if (courseMemoInfo.publishedData) {
            numberOfMemosPublishedBeforeStart = courseMemoInfo.publishedData.publishedBeforeStart ? 1 : 0
            numberOfMemosPublishedBeforeDeadline = courseMemoInfo.publishedData.publishedBeforeDeadline ? 1 : 0
          }
        }
      }
      if (schools[schoolCode]) {
        if (!schools[schoolCode].courseCodes.includes(courseCode)) {
          schools[schoolCode].courseCodes.push(courseCode)
          totalNumberOfCourses++
          schools[schoolCode].numberOfCourses += 1
          schools[schoolCode].numberOfUniqMemos += numberOfMemoPublished
          schools[schoolCode].numberOfUniqPdfMemos += numberOfMemoPdf
          schools[schoolCode].numberOfMemosPublishedBeforeStart += numberOfMemosPublishedBeforeStart
          schools[schoolCode].numberOfMemosPublishedBeforeDeadline += numberOfMemosPublishedBeforeDeadline
        } else {
          schools[schoolCode].numberOfUniqMemos += numberOfMemoPublished
          schools[schoolCode].numberOfUniqPdfMemos += numberOfMemoPdf
          schools[schoolCode].numberOfMemosPublishedBeforeStart += numberOfMemosPublishedBeforeStart
          schools[schoolCode].numberOfMemosPublishedBeforeDeadline += numberOfMemosPublishedBeforeDeadline
        }
      } else {
        totalNumberOfCourses++
        schools[schoolCode] = {
          numberOfCourses: 1,
          courseCodes: [courseCode],
          numberOfUniqMemos: numberOfMemoPublished,
          numberOfUniqPdfMemos: numberOfMemoPdf,
          numberOfMemosPublishedBeforeStart,
          numberOfMemosPublishedBeforeDeadline,
        }
      }
    }
  })

  Object.values(schools).forEach(sc => {
    totalNumberOfWebMemos += sc.numberOfUniqMemos
    totalNumberOfPdfMemos += sc.numberOfUniqPdfMemos
    totalNumberOfMemosPublishedBeforeStart += sc.numberOfMemosPublishedBeforeStart
    totalNumberOfMemosPublishedBeforeDeadline += sc.numberOfMemosPublishedBeforeDeadline
  })
  const dataPerSchool = {
    schools,
    totalNumberOfCourses,
    totalNumberOfWebMemos,
    totalNumberOfPdfMemos,
    totalNumberOfMemosPublishedBeforeStart,
    totalNumberOfMemosPublishedBeforeDeadline,
  }
  // log.debug('_dataPerSchool returns', dataPerSchool)
  return dataPerSchool
}

/**
 * TODO: Remove this function!
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

  courseOfferings.forEach(courseOffering => {
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
          numberOfUniqPdfMemos: numberOfMemoPdf,
        }
      }
    }
  })

  Object.values(schools).forEach(sc => {
    totalNumberOfAnalyses += sc.numberOfUniqAnalyses
    totalNumberOfWebMemos += sc.numberOfUniqMemos
    totalNumberOfPdfMemos += sc.numberOfUniqPdfMemos
  })
  const dataPerSchool = {
    schools,
    totalNumberOfCourses,
    totalNumberOfAnalyses,
    totalNumberOfWebMemos,
    totalNumberOfPdfMemos,
  }
  // log.debug('_dataPerSchool returns', dataPerSchool)
  return dataPerSchool
}

/**
 * Finds unique semesters in object with parsed offerings.
 * @param {[]} parsedOfferings Object with two arrays, each containing offerings’ relevant data.
 * @returns {[]}               Array with found unique semesters
 */
const _semestersInParsedOfferings = parsedOfferings =>
  parsedOfferings.reduce((foundSemesters, o) => {
    if (o.semester && !foundSemesters.includes(o.semester)) {
      foundSemesters.push(o.semester)
    }
    return foundSemesters
  }, [])

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
    (key === 'numberOfUniqAnalyses' || key === 'numberOfUniqPdfMemos' || key === 'numberOfUniqMemos') &&
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
const _fetchCourseAnalyses = async semesters => {
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
const _fetchCourseMemos = async semesters => {
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
const fetchStatistic = async semester => {
  try {
    const { client } = statisticApis.koppsApi.koppsApi

    // Returns a list of course offerings valid for given semester parameter.
    const courses = await client.getAsync({
      uri: `${config.koppsApi.basePath}courses/offerings?from=${semester}&skip_coordinator_info=true`,
      useCache: true,
    })

    // Object with two arrays, each containing offerings’ relevant data.
    const parsedOfferings = _parseOfferings(courses, semester)

    // Semesters found in parsed offerings.
    const semestersInAnalyses = _semestersInParsedOfferings(parsedOfferings.forAnalyses)
    const semestersInMemos = _semestersInParsedOfferings(parsedOfferings.forMemos)

    // Course analyses for semesters
    const courseAnalyses = await _fetchCourseAnalyses(semestersInAnalyses)
    // Course memos for semesters
    const courseMemoData = await _fetchCourseMemos(semestersInMemos)

    // Matches analyses and memos with course offerings.
    // Returns an object with two arrays, each containing offerings and their documents.
    const combinedDataPerDepartment = _documentsPerCourseOffering(parsedOfferings, courseAnalyses, courseMemoData)

    // Compiles statistics per school, including totals, for analyses.
    const combinedAnalysesDataPerSchool = _analysesDataPerSchool(combinedDataPerDepartment.withAnalyses)

    // Compiles statistics per school, including totals, for memos.
    const combinedMemosDataPerSchool = _memosDataPerSchool(combinedDataPerDepartment.withMemos)

    return {
      totalOfferings: courses.body.length,
      koppsApiBasePath: `${config.koppsApi.https ? 'https' : 'http'}://${config.koppsApi.host}${
        config.koppsApi.basePath
      }`,
      kursutvecklingApiBasePath: `${config.kursutvecklingApi.https ? 'https' : 'http'}://${
        config.kursutvecklingApi.host
      }${config.kursutvecklingApi.proxyBasePath}`,
      kursPmDataApiBasePath: `${config.kursPmDataApi.https ? 'https' : 'http'}://${config.kursPmDataApi.host}${
        config.kursPmDataApi.proxyBasePath
      }`,
      semester,
      combinedDataPerDepartment,
      combinedAnalysesDataPerSchool,
      combinedMemosDataPerSchool,
      semestersInAnalyses,
      semestersInMemos,
      combinedDataPerSchool: {}, // TODO: Remove this!
      courseOfferings: [], // TODO: Remove this!
    }
  } catch (err) {
    log.error('Exception in statisticsTransformer.fetchStatistic', { error: err })
    throw err
  }
}

// "Internal" functions exported for test purposes
module.exports = {
  fetchStatistic,
  _parseOfferings,
  _semestersInParsedOfferings,
  _fetchCourseAnalyses,
  _fetchCourseMemos,
  _documentsPerCourseOffering,
  _dataPerSchool,
  _publishData,
}
