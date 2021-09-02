/* eslint-disable react/jsx-one-expression-per-line */
import React, { Component } from 'react'
import { toJS } from 'mobx'
import { inject, observer } from 'mobx-react'
import { CSVLink } from 'react-csv'

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

const englishTexts = {
  pageHeader: semester => `Course Information Statistics ${semester}`,
  pageDescription: () => (
    <>
      <p>
        A semester is expressed as a year followed by 1 for Spring or 2 for Autumn, for example, 20191 for Spring
        semester 2019 or 20202 for Autumn semester 2020.
      </p>
      <p>Please note that this service cannot provide accurate statistics from earlier than 2019.</p>
    </>
  ),
  subHeader: 'Per School',
  subPageDescription:
    'Course information statistics grouped by the school, presented for course analyses and course memos, respectively. You also have the possibility to export data from the tables to a csv file.',
  courseAnalysesHeader: 'Course Analyses',
  courseAnalysesDescription: () => (
    <>
      <p>
        Column <q>Number of courses</q> holds the number of active courses for the particular school ending the given
        semester according to KOPPS.
      </p>
      <p>
        Column <q>Number of course analysis</q> holds the number of unique published course analysis for the particular
        school the given semester. For course offerings running over several semesters the course analysis is presented
        at the last semester of the course offerings.
      </p>
    </>
  ),
  sourceOfData: 'Source of Data',
  courseDataApiDescription: koppsApiUrl => (
    <p>
      Course data is fetched from&nbsp;
      <a href="https://www.kth.se/api/kopps/v2/apiInfo/courses">KOPPS API for Courses</a>, endpoint&nbsp;
      <code>/api/kopps/v2/courses/offerings</code>. Data for the current page was fetched from&nbsp;
      <a href={koppsApiUrl} target="_blank" rel="noreferrer">
        <code>{koppsApiUrl}</code>
      </a>
      .
    </p>
  ),
  courseAnalysesFilterDescription: semester => (
    <p>
      For course analyses, offerings that didn’t finish during the {semester} semester are filtered out. This is done by
      discarding offerings that don’t meet the criteria:
      <br />
      <code>course.offered_semesters[&#123;last-element&#125;].semester == {semester}</code>
    </p>
  ),
  courseAnalysesDataApiDescription: (kursutvecklingApiUrl, semestersInAnalyses) => (
    <p>
      Course analyses data is fetched from&nbsp;
      <a href="https://github.com/KTH/kursutveckling-api" target="_blank" rel="noreferrer">
        kursutveckling-api
      </a>
      , endpoint <code>/api/kursutveckling/v1/courseAnalyses/&#123;semester&#125;</code>. Data for the current page was
      fetched from&nbsp;
      <a href={kursutvecklingApiUrl} target="_blank" rel="noreferrer">
        <code>{kursutvecklingApiUrl}&#123;semester&#125;</code>
      </a>
      , using semester(s) <code>{semestersInAnalyses.sort().join(', ')}</code>.
    </p>
  ),
  exportCourseAnalysesData: 'Export course analyses data per school (csv file)',
  courseMemosHeader: 'Course Memos',
  courseMemosDescription: () => (
    <>
      <p>
        Column <q>Number of (#) courses</q> holds the number of active courses for the particular school starting the
        given semester according to KOPPS.
      </p>
      <p>
        Columns <q># web course memos</q> and <q># PDF course memos</q> holds the number of unique published course
        memos for the particular school in the given semester, seperated by publishing method. For course offerings
        running over several semesters, the course memo is presented at the first semester of the course offerings.
      </p>
      <p>
        Columns <q># memos published before start</q> and <q># memos published one week before start</q> holds the
        number of course memos published at specific periods of time. The calculation uses dates in KOPPS.
      </p>
    </>
  ),
  courseMemosDataApiDescription: (kursPmApiUrl, semestersInMemos) => (
    <p>
      Course memo data is fetched from&nbsp;
      <a href="https://github.com/KTH/kurs-pm-data-api" target="_blank" rel="noreferrer">
        kurs-pm-data-api
      </a>
      , endpoint <code>/api/kurs-pm-data/v1/webAndPdfPublishedMemosBySemester/&#123;semester&#125;</code>. Data for the
      current page was fetched from&nbsp;
      <a href={kursPmApiUrl} target="_blank" rel="noreferrer">
        <code>{kursPmApiUrl}&#123;semester&#125;</code>
      </a>
      , using semester(s) <code>{semestersInMemos.sort().join(', ')}</code>.
    </p>
  ),
  courseMemosFilterDescription: semester => (
    <p>
      For course memos, offerings that didn’t start during the {semester} semester are filtered out. This is done by
      discarding offerings that doesn’t meet the criteria: <code>course.first_yearsemester == {semester}</code>. Date
      used to determine if memo was published before the offering started is{' '}
      <code>course.offered_semesters[&#123;{semester}&#125;].start_date</code>.
    </p>
  ),
  exportCourseMemosData: 'Export course memos data per school (csv file)',
  rawDataHeader: 'Raw Data',
  rawDataDescription: () => (
    <p>
      Use the course information raw data to make aggregations for example departments or programs. You can export the
      data to a csv file.
    </p>
  ),
  exportRawCourseAnalysesData: 'Export raw course analyses data (csv file)',
  exportRawCourseMemosData: 'Export raw course memos data (csv file)',
}

@inject(['adminStore'])
@observer
class CourseStatisticsPage extends Component {
  constructor(props) {
    super(props)
    const { adminStore } = this.props
    this.statisticData = adminStore.statisticData
  }

  render() {
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
    } = this.statisticData
    const { adminStore } = this.props
    const { browserConfig } = adminStore
    const koppsApiUrl = `${koppsApiBasePath}courses/offerings?from=${semester}&skip_coordinator_info=true`
    const kursutvecklingApiUrl = `${kursutvecklingApiBasePath}/v1/courseAnalyses/`
    const kursPmApiUrl = `${kursPmDataApiBasePath}/v1/webAndPdfPublishedMemosBySemester/`

    const { withAnalyses, withMemos } = combinedDataPerDepartment

    // DEPARTMENT: HTML Rows for all course offerings for a table Per DEPARTMENT data
    const perDepartmentCourseOfferingRowsWithAnalyses = []
    withAnalyses.forEach(courseOffering => {
      const cO = toJS(courseOffering)

      perDepartmentCourseOfferingRowsWithAnalyses.push(
        <tr>
          <td>{cO.semester}</td>
          <td>{cO.schoolMainCode}</td>
          <td>{cO.departmentName}</td>
          <td>{cO.courseCode}</td>
          <td width="300">{cO.connectedPrograms}</td>
          <td>{cO.offeringId}</td>
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
      const cO = toJS(courseOffering)
      const m = cO.courseMemoInfo || {}
      const p = m.publishedData || {}

      perDepartmentCourseOfferingRowsWithMemos.push(
        <tr>
          <td>{cO.semester}</td>
          <td>{cO.schoolMainCode}</td>
          <td>{cO.departmentName}</td>
          <td>{cO.courseCode}</td>
          <td width="300">{cO.connectedPrograms}</td>
          <td>{cO.offeringId}</td>
          <td>{p.offeringStartTime}</td>
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
      'Course Analysis',
    ])
    withAnalyses.forEach(courseOffering => {
      const cO = toJS(courseOffering)
      csvPerDepartmentDataWithAnalyses.push([
        cO.semester,
        cO.schoolMainCode,
        cO.departmentName,
        cO.courseCode,
        cO.connectedPrograms,
        cO.offeringId,
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
      const cO = toJS(courseOffering)
      const m = cO.courseMemoInfo || {}
      const p = m.publishedData || {}
      csvPerDepartmentDataWithMemos.push([
        cO.semester,
        cO.schoolMainCode,
        cO.departmentName,
        cO.courseCode,
        cO.connectedPrograms,
        cO.offeringId,
        p.offeringStartTime,
        m.memoId,
        p.publishedTime,
      ])
    })

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
              <CSVLink
                filename={`course-information-statistics-per-school-for-analyses-${semester}.csv`}
                className="btn btn-primary float-right mb-2"
                data={analysisPerSchoolCSV(combinedAnalysesDataPerSchool)}
              >
                {englishTexts.exportCourseAnalysesData}
              </CSVLink>
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
              <CSVLink
                filename={`course-information-statistics-per-school-for-memos-${semester}.csv`}
                className="btn btn-primary float-right mb-2"
                data={memosPerSchoolCSV(combinedMemosDataPerSchool)}
              >
                {englishTexts.exportCourseMemosData}
              </CSVLink>
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
                <CSVLink
                  filename={`course-information-statistics-raw-data-with-analyses-${semester}.csv`}
                  className="btn btn-primary float-right mb-2"
                  data={csvPerDepartmentDataWithAnalyses}
                >
                  {englishTexts.exportRawCourseAnalysesData}
                </CSVLink>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Semester</th>
                      <th>School</th>
                      <th>Department Name</th>
                      <th>Course Code</th>
                      <th>Connected program(s)</th>
                      <th>Offering ID</th>
                      <th>Course Analysis</th>
                    </tr>
                  </thead>
                  <tbody>{perDepartmentCourseOfferingRowsWithAnalyses}</tbody>
                </table>
              </details>
              <details style={{ overflowX: 'auto', width: '100%' }}>
                <summary className="white">{englishTexts.courseMemosHeader}</summary>
                <CSVLink
                  filename={`course-information-statistics-raw-data-with-memos-${semester}.csv`}
                  className="btn btn-primary float-right mb-2"
                  data={csvPerDepartmentDataWithMemos}
                >
                  {englishTexts.exportRawCourseMemosData}
                </CSVLink>
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
}

export default CourseStatisticsPage
