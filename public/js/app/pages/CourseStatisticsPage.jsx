/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react'
import { CSVLink } from 'react-csv'
import { useWebContext } from '../context/WebContext'
import { englishTexts } from '../components/statistic/StatisticsTexts'
import { replaceAdminUrlWithPublicUrl } from '../util/links'

const analysisPerSchoolRows = combinedAnalysesDataPerSchool => {
  // SCHOOL: HTML Rows of a table Per SCHOOL data
  const rows = []
  const { schools = {}, totalNumberOfCourses, totalNumberOfAnalyses } = combinedAnalysesDataPerSchool
  Object.keys(schools).forEach(sC => {
    const { numberOfCourses, numberOfUniqAnalyses } = schools[sC]
    rows.push(
      <tr key={sC}>
        <td>{sC}</td>
        <td>{numberOfCourses}</td>
        <td>{numberOfUniqAnalyses}</td>
      </tr>
    )
  })
  rows.push(
    <tr key="totals">
      <td>
        <b>
          <i>Total</i>
        </b>
      </td>
      <td>
        <b>{totalNumberOfCourses}</b>
      </td>
      <td>
        <b>{totalNumberOfAnalyses}</b>
      </td>
    </tr>
  )
  return rows
}

const memosPerSchoolRows = combinedMemosDataPerSchool => {
  const rows = []
  const {
    schools = {},
    totalNumberOfCourses,
    totalNumberOfWebMemos,
    totalNumberOfPdfMemos,
    totalNumberOfMemosPublishedBeforeStart,
    totalNumberOfMemosPublishedBeforeDeadline,
  } = combinedMemosDataPerSchool
  Object.keys(schools).forEach(sC => {
    const {
      numberOfCourses,
      numberOfUniqMemos,
      numberOfUniqPdfMemos,
      numberOfMemosPublishedBeforeStart,
      numberOfMemosPublishedBeforeDeadline,
    } = schools[sC]
    rows.push(
      <tr key={sC}>
        <td>{sC}</td>
        <td>{numberOfCourses}</td>
        <td>{numberOfUniqMemos}</td>
        <td>{numberOfUniqPdfMemos}</td>
        <td>{numberOfMemosPublishedBeforeStart}</td>
        <td>{numberOfMemosPublishedBeforeDeadline}</td>
      </tr>
    )
  })
  rows.push(
    <tr key="totals">
      <td>
        <b>
          <i>Total</i>
        </b>
      </td>
      <td>
        <b>{totalNumberOfCourses}</b>
      </td>
      <td>
        <b>{totalNumberOfWebMemos}</b>
      </td>
      <td>
        <b>{totalNumberOfPdfMemos}</b>
      </td>
      <td>
        <b>{totalNumberOfMemosPublishedBeforeStart}</b>
      </td>
      <td>
        <b>{totalNumberOfMemosPublishedBeforeDeadline}</b>
      </td>
    </tr>
  )
  return rows
}

const analysisPerSchoolCSV = combinedAnalysesDataPerSchool => {
  const { schools = {}, totalNumberOfCourses, totalNumberOfAnalyses } = combinedAnalysesDataPerSchool
  const csvPerSchoolData = []
  csvPerSchoolData.push(['School', 'Number of courses', 'Number of course analyses'])
  Object.keys(schools).forEach(sC => {
    csvPerSchoolData.push([sC, schools[sC].numberOfCourses, schools[sC].numberOfUniqAnalyses])
  })
  csvPerSchoolData.push(['Total', totalNumberOfCourses, totalNumberOfAnalyses])
  return csvPerSchoolData
}

const memosPerSchoolCSV = combinedMemosDataPerSchool => {
  const {
    schools = {},
    totalNumberOfCourses,
    totalNumberOfWebMemos,
    totalNumberOfPdfMemos,
  } = combinedMemosDataPerSchool
  const csvPerSchoolData = []
  csvPerSchoolData.push([
    'School',
    'Number of (#) courses',
    '# web course memos',
    '# PDF course memos',
    '# memos published before start',
    '# memos published one week before start',
  ])
  Object.keys(schools).forEach(sC => {
    csvPerSchoolData.push([
      sC,
      schools[sC].numberOfCourses,
      schools[sC].numberOfUniqMemos,
      schools[sC].numberOfUniqPdfMemos,
      schools[sC].numberOfMemosPublishedBeforeStart,
      schools[sC].numberOfMemosPublishedBeforeDeadline,
    ])
  })
  csvPerSchoolData.push(['Total', totalNumberOfCourses, totalNumberOfWebMemos, totalNumberOfPdfMemos])
  return csvPerSchoolData
}

function CourseStatisticsPage() {
  const [context] = useWebContext()
  const [finishedServerSideRendering, setFinishedServerSideRendering] = React.useState(false) // to make sure csv can use blob href and work properly

  const {
    semester,
    combinedDataPerDepartment,
    combinedAnalysesDataPerSchool,
    combinedMemosDataPerSchool,
    koppsApiBasePath,
    kursutvecklingApiBasePath,
    semestersInAnalyses,
    kursPmDataApiBasePath,
    semestersInMemos,
  } = context.statisticData

  const { browserConfig } = context
  const koppsApiUrl = `${koppsApiBasePath}courses/offerings?from=${semester}&skip_coordinator_info=true`
  const kursutvecklingApiUrl = `${kursutvecklingApiBasePath}/v1/courseAnalyses/`
  const kursPmApiUrl = `${kursPmDataApiBasePath}/v1/webAndPdfPublishedMemosBySemester/`
  const { withAnalyses, withMemos } = combinedDataPerDepartment

  // DEPARTMENT: HTML Rows for all course offerings for a table Per DEPARTMENT data
  const perDepartmentCourseOfferingRowsWithAnalyses = []
  withAnalyses.forEach(courseOffering => {
    const cO = courseOffering
    const _key = `${cO.courseCode}-${cO.semester}-${cO.offeringId}-${cO.startDate}`
    perDepartmentCourseOfferingRowsWithAnalyses.push(
      <tr key={_key}>
        <td>{cO.semester}</td>
        <td>{cO.schoolMainCode}</td>
        <td>{cO.departmentName}</td>
        <td>{cO.courseCode}</td>
        <td width="300">{cO.connectedPrograms}</td>
        <td>{cO.offeringId}</td>
        <td>{cO.startDate}</td>
        <td>
          {cO.courseAnalysis && (
            <a href={`${browserConfig.analysesStorageUri}${cO.courseAnalysis}`}>{cO.courseAnalysis}</a>
          )}
        </td>
      </tr>
    )
  })

  const perDepartmentCourseOfferingRowsWithMemos = []
  withMemos.forEach(courseOffering => {
    const cO = courseOffering
    const { courseMemoInfo: m = {} } = cO
    const { publishedData: p = {} } = m
    const _key = `${cO.courseCode}-${cO.semester}-${cO.offeringId}-${cO.startDate}`

    perDepartmentCourseOfferingRowsWithMemos.push(
      <tr key={_key}>
        <td>{cO.semester}</td>
        <td>{cO.schoolMainCode}</td>
        <td>{cO.departmentName}</td>
        <td>{cO.courseCode}</td>
        <td width="300">{cO.connectedPrograms}</td>
        <td>{cO.offeringId}</td>
        <td>{cO.startDate}</td>
        <td>
          <a
            href={
              cO.courseMemoInfo && cO.courseMemoInfo.isPdf
                ? `${browserConfig.memoStorageUri}${cO.courseMemoInfo.memoId}`
                : `${browserConfig.hostUrl}/kurs-pm/${cO.courseCode}/${cO.courseMemoInfo && cO.courseMemoInfo.memoId}`
            }
          >
            {cO.courseMemoInfo && cO.courseMemoInfo.memoId}
          </a>
        </td>
        <td>{p.publishedTime}</td>
      </tr>
    )
  })

  const csvPerDepartmentDataWithAnalyses = []
  csvPerDepartmentDataWithAnalyses.push([
    'Semester',
    'School',
    'Department Name',
    'Course Code',
    'Connected program(s)',
    'Offering ID',
    'Offering Start Date',
    'Course Analysis',
  ])
  withAnalyses.forEach(courseOffering => {
    const cO = courseOffering
    csvPerDepartmentDataWithAnalyses.push([
      cO.semester,
      cO.schoolMainCode,
      cO.departmentName,
      cO.courseCode,
      cO.connectedPrograms,
      cO.offeringId,
      cO.startDate,
      cO.courseAnalysis,
    ])
  })

  const csvPerDepartmentDataWithMemos = []
  csvPerDepartmentDataWithMemos.push([
    'Semester',
    'School',
    'Department Name',
    'Course Code',
    'Connected program(s)',
    'Offering ID',
    'Offering Start Date',
    'Course Memo',
    'Publishing Date',
  ])
  withMemos.forEach(courseOffering => {
    const cO = courseOffering
    const m = cO.courseMemoInfo || {}
    const p = m.publishedData || {}
    csvPerDepartmentDataWithMemos.push([
      cO.semester,
      cO.schoolMainCode,
      cO.departmentName,
      cO.courseCode,
      cO.connectedPrograms,
      cO.offeringId,
      cO.startDate,
      m.memoId,
      p.publishedTime,
    ])
  })

  React.useEffect(() => {
    let isMounted = true
    if (isMounted) setFinishedServerSideRendering(true)
    if (isMounted && typeof window !== 'undefined') replaceAdminUrlWithPublicUrl()
    return () => (isMounted = false)
  }, [])

  return (
    <div className="container standard department" style={{ paddingTop: '30px' }}>
      <div className="row">
        <div className="col">
          <header>
            <h1>{englishTexts.pageHeader(semester)}</h1>
            {englishTexts.pageDescription()}
          </header>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <main id="mainContent">
            <h2>{englishTexts.subHeader}</h2>
            <p>{englishTexts.subPageDescription}</p>
            <h3>{englishTexts.courseAnalysesHeader}</h3>
            {englishTexts.courseAnalysesDescription()}
            <details>
              <summary className="white">{englishTexts.sourceOfData}</summary>
              {englishTexts.courseDataApiDescription(koppsApiUrl)}
              {englishTexts.courseAnalysesFilterDescription(semester)}
              {englishTexts.courseAnalysesDataApiDescription(kursutvecklingApiUrl, semestersInAnalyses)}
            </details>
            {finishedServerSideRendering && (
              <CSVLink
                filename={`course-information-statistics-per-school-for-analyses-${semester}.csv`}
                className="btn btn-primary float-right mb-2"
                data={analysisPerSchoolCSV(combinedAnalysesDataPerSchool)}
              >
                {englishTexts.exportCourseAnalysesData}
              </CSVLink>
            )}

            <table className="table">
              <thead>
                <tr>
                  <th>School</th>
                  <th>Number of courses</th>
                  <th>Number of course analyses</th>
                </tr>
              </thead>
              <tbody>{analysisPerSchoolRows(combinedAnalysesDataPerSchool)}</tbody>
            </table>
            <h3>{englishTexts.courseMemosHeader}</h3>
            {englishTexts.courseMemosDescription()}
            <details>
              <summary className="white">{englishTexts.sourceOfData}</summary>
              {englishTexts.courseDataApiDescription(koppsApiUrl)}
              {englishTexts.courseMemosFilterDescription(semester)}
              {englishTexts.courseMemosDataApiDescription(kursPmApiUrl, semestersInMemos)}
            </details>
            {finishedServerSideRendering && (
              <CSVLink
                filename={`course-information-statistics-per-school-for-memos-${semester}.csv`}
                className="btn btn-primary float-right mb-2"
                data={memosPerSchoolCSV(combinedMemosDataPerSchool)}
              >
                {englishTexts.exportCourseMemosData}
              </CSVLink>
            )}
            <table className="table">
              <thead>
                <tr>
                  <th>School</th>
                  <th>Number of (#) courses</th>
                  <th># web course memos</th>
                  <th># PDF course memos</th>
                  <th># memos published before start</th>
                  <th># memos published one week before start</th>
                </tr>
              </thead>
              <tbody>{memosPerSchoolRows(combinedMemosDataPerSchool)}</tbody>
            </table>
            <h2>{englishTexts.rawDataHeader}</h2>
            {englishTexts.rawDataDescription()}
            <details style={{ overflowX: 'auto', width: '100%' }}>
              <summary className="white">{englishTexts.courseAnalysesHeader}</summary>
              {finishedServerSideRendering && (
                <CSVLink
                  filename={`course-information-statistics-raw-data-with-analyses-${semester}.csv`}
                  className="btn btn-primary float-right mb-2"
                  data={csvPerDepartmentDataWithAnalyses}
                >
                  {englishTexts.exportRawCourseAnalysesData}
                </CSVLink>
              )}
              <table className="table">
                <thead>
                  <tr>
                    <th>Semester</th>
                    <th>School</th>
                    <th>Department Name</th>
                    <th>Course Code</th>
                    <th>Connected program(s)</th>
                    <th>Offering ID</th>
                    <th>Offering Start Date</th>
                    <th>Course Analysis</th>
                  </tr>
                </thead>
                <tbody>{perDepartmentCourseOfferingRowsWithAnalyses}</tbody>
              </table>
            </details>
            <details style={{ overflowX: 'auto', width: '100%' }}>
              <summary className="white">{englishTexts.courseMemosHeader}</summary>
              {finishedServerSideRendering && (
                <CSVLink
                  filename={`course-information-statistics-raw-data-with-memos-${semester}.csv`}
                  className="btn btn-primary float-right mb-2"
                  data={csvPerDepartmentDataWithMemos}
                >
                  {englishTexts.exportRawCourseMemosData}
                </CSVLink>
              )}
              <table className="table">
                <thead>
                  <tr>
                    <th>Semester</th>
                    <th>School</th>
                    <th>Department Name</th>
                    <th>Course Code</th>
                    <th>Connected program(s)</th>
                    <th>Offering ID</th>
                    <th>Offering Start Date</th>
                    <th>Course Memos</th>
                    <th>Publishing Date</th>
                  </tr>
                </thead>
                <tbody>{perDepartmentCourseOfferingRowsWithMemos}</tbody>
              </table>
            </details>
          </main>
        </div>
      </div>
    </div>
  )
}

export default CourseStatisticsPage
