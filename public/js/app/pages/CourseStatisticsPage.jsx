/* eslint-disable react/jsx-one-expression-per-line */
import React, { Component } from 'react'
import { toJS } from 'mobx'
import { inject, observer } from 'mobx-react'
import { CSVLink } from 'react-csv'

const analysisPerSchoolRows = (combinedAnalysesDataPerSchool) => {
  // SCHOOL: HTML Rows of a table Per SCHOOL data
  const rows = []
  const {
    schools = {},
    totalNumberOfCourses,
    totalNumberOfAnalyses
  } = combinedAnalysesDataPerSchool
  Object.keys(schools).forEach((sC) => {
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

const memosPerSchoolRows = (combinedMemosDataPerSchool) => {
  const rows = []
  const {
    schools = {},
    totalNumberOfCourses,
    totalNumberOfWebMemos,
    totalNumberOfPdfMemos
  } = combinedMemosDataPerSchool
  Object.keys(schools).forEach((sC) => {
    const { numberOfCourses, numberOfUniqMemos, numberOfUniqPdfMemos } = schools[sC]
    rows.push(
      <tr key={sC}>
        <td>{sC}</td>
        <td>{numberOfCourses}</td>
        <td>{numberOfUniqMemos}</td>
        <td>{numberOfUniqPdfMemos}</td>
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
    </tr>
  )
  return rows
}

const analysisPerSchoolCSV = (combinedAnalysesDataPerSchool) => {
  const {
    schools = {},
    totalNumberOfCourses,
    totalNumberOfAnalyses
  } = combinedAnalysesDataPerSchool
  const csvPerSchoolData = []
  csvPerSchoolData.push(['School', 'Number of courses', 'Number of course analyses'])
  Object.keys(schools).forEach((sC) => {
    csvPerSchoolData.push([sC, schools[sC].numberOfCourses, schools[sC].numberOfUniqAnalyses])
  })
  csvPerSchoolData.push(['Total', totalNumberOfCourses, totalNumberOfAnalyses])
  return csvPerSchoolData
}

const memosPerSchoolCSV = (combinedMemosDataPerSchool) => {
  const {
    schools = {},
    totalNumberOfCourses,
    totalNumberOfWebMemos,
    totalNumberOfPdfMemos
  } = combinedMemosDataPerSchool
  const csvPerSchoolData = []
  csvPerSchoolData.push([
    'School',
    'Number of courses',
    'Number of web course memos',
    'Number of PDF course memos'
  ])
  Object.keys(schools).forEach((sC) => {
    csvPerSchoolData.push([
      sC,
      schools[sC].numberOfCourses,
      schools[sC].numberOfUniqMemos,
      schools[sC].numberOfUniqPdfMemos
    ])
  })
  csvPerSchoolData.push([
    'Total',
    totalNumberOfCourses,
    totalNumberOfWebMemos,
    totalNumberOfPdfMemos
  ])
  return csvPerSchoolData
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
      semestersInMemos
    } = this.statisticData
    const { adminStore } = this.props
    const { browserConfig } = adminStore
    const koppsApiUrl = `${koppsApiBasePath}courses/offerings?from=${semester}&skip_coordinator_info=true`
    const kursutvecklingApiUrl = `${kursutvecklingApiBasePath}/v1/courseAnalyses/`
    const kursPmApiUrl = `${kursPmDataApiBasePath}/v1/webAndPdfPublishedMemosBySemester/`

    const { withAnalyses, withMemos } = combinedDataPerDepartment

    // DEPARTMENT: HTML Rows for all course offerings for a table Per DEPARTMENT data
    const perDepartmentCourseOfferingRowsWithAnalyses = []
    withAnalyses.forEach((courseOffering) => {
      const cO = toJS(courseOffering)

      perDepartmentCourseOfferingRowsWithAnalyses.push(
        <tr>
          <td>{cO.semester}</td>
          <td>{cO.schoolMainCode}</td>
          <td>{cO.departmentName}</td>
          <td>{cO.courseCode}</td>
          <td width="300">{cO.connectedPrograms}</td>
          <td>{cO.offeringId}</td>
          <td>{cO.courseAnalysis}</td>
        </tr>
      )
    })

    const perDepartmentCourseOfferingRowsWithMemos = []
    withMemos.forEach((courseOffering) => {
      const cO = toJS(courseOffering)

      perDepartmentCourseOfferingRowsWithMemos.push(
        <tr>
          <td>{cO.semester}</td>
          <td>{cO.schoolMainCode}</td>
          <td>{cO.departmentName}</td>
          <td>{cO.courseCode}</td>
          <td width="300">{cO.connectedPrograms}</td>
          <td>{cO.offeringId}</td>
          <td>
            <a
              href={
                cO.courseMemoInfo && cO.courseMemoInfo.isPdf
                  ? `${browserConfig.memoStorageUri}${cO.courseMemoInfo.memoId}`
                  : `${browserConfig.hostUrl}/kurs-pm/${cO.courseCode}/${
                      cO.courseMemoInfo && cO.courseMemoInfo.memoId
                    }`
              }
            >
              {cO.courseMemoInfo && cO.courseMemoInfo.memoId}
            </a>
          </td>
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
      'Course Analysis'
    ])
    withAnalyses.forEach((courseOffering) => {
      const cO = toJS(courseOffering)
      csvPerDepartmentDataWithAnalyses.push([
        cO.semester,
        cO.schoolMainCode,
        cO.departmentName,
        cO.courseCode,
        cO.connectedPrograms,
        cO.offeringId,
        cO.courseAnalysis
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
      'Course Memo'
    ])
    withMemos.forEach((courseOffering) => {
      const cO = toJS(courseOffering)
      csvPerDepartmentDataWithMemos.push([
        cO.semester,
        cO.schoolMainCode,
        cO.departmentName,
        cO.courseCode,
        cO.connectedPrograms,
        cO.offeringId,
        cO.courseMemoInfo && cO.courseMemoInfo.memoId
      ])
    })

    return (
      <div className="container standard department" style={{ paddingTop: '30px' }}>
        <div className="row">
          <div className="col">
            <header>
              <h1>Course Information Statistics {semester}</h1>
            </header>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <main id="mainContent">
              <h2>Per School</h2>
              <p>
                Course information statistics grouped by school, presented for course analyses and
                course memos, respectively. You can export the data to a csv file by clicking{' '}
                <q>Download per school statistics for analyses (csv file)</q> or{' '}
                <q>Download per school statistics for memos (csv file)</q>.
              </p>
              <details>
                <summary className="white">Data Used</summary>
                <h3>Course Data</h3>
                <p>
                  Course data is fetched from&nbsp;
                  <a href="https://www.kth.se/api/kopps/v2/apiInfo/courses">
                    KOPPS API for Courses
                  </a>
                  , endpoint <code>/api/kopps/v2/courses/offerings</code>. Data for the current page
                  was fetched from&nbsp;
                  <a href={koppsApiUrl} target="_blank" rel="noreferrer">
                    <code>{koppsApiUrl}</code>
                  </a>
                  .
                </p>
                <p>
                  For course analyses, offerings that didn’t finish during the {semester} semester
                  are filtered out. This is done by discarding offerings that doesn’t meet the
                  criteria:
                  <br />
                  <code>
                    course.offered_semesters[&#123;last-element&#125;].semester == {semester}
                  </code>
                </p>
                <p>
                  For course memos, offerings that didn’t start during the {semester} semester are
                  filtered out. This is done by discarding offerings that doesn’t meet the criteria:
                  <br />
                  <code>course.first_yearsemester == {semester}</code>
                </p>
                <h3>Course Analyses Data</h3>
                <p>
                  Course analyses data is fetched from&nbsp;
                  <a
                    href="https://github.com/KTH/kursutveckling-api"
                    target="_blank"
                    rel="noreferrer"
                  >
                    kursutveckling-api
                  </a>
                  , endpoint <code>/api/kursutveckling/v1/courseAnalyses/&#123;semester&#125;</code>
                  . Data for the current page was fetched from&nbsp;
                  <a href={kursutvecklingApiUrl} target="_blank" rel="noreferrer">
                    <code>{kursutvecklingApiUrl}&#123;semester&#125;</code>
                  </a>
                  , using semester(s) <code>{semestersInAnalyses.sort().join(', ')}</code>.
                </p>
                <h3>Course Memo Data</h3>
                <p>
                  Course memo data is fetched from&nbsp;
                  <a
                    href="https://github.com/KTH/kurs-pm-data-api"
                    target="_blank"
                    rel="noreferrer"
                  >
                    kurs-pm-data-api
                  </a>
                  , endpoint{' '}
                  <code>
                    /api/kurs-pm-data/v1/webAndPdfPublishedMemosBySemester/&#123;semester&#125;
                  </code>
                  . Data for the current page was fetched from&nbsp;
                  <a href={kursPmApiUrl} target="_blank" rel="noreferrer">
                    <code>{kursPmApiUrl}&#123;semester&#125;</code>
                  </a>
                  , using semester(s) <code>{semestersInMemos.sort().join(', ')}</code>.
                </p>
              </details>
              <details>
                <summary className="white">Table Columns</summary>
                <h3>School</h3>
                Schools from course data, mapped with abbreviations:&nbsp;
                <code>
                  ABE: ABE, CBH: CBH, STH: CBH, CHE: CBH, BIO: CBH, CSC: EECS, ECE: EECS, EECS:
                  EECS, EES: EECS, ICT: EECS, ITM: ITM, SCI: SCI
                </code>
                .<h3>Number of Courses</h3>
                <p>
                  Column <q>Number of courses</q> holds the number of active courses for the
                  particular school the given semester according to Kopps.
                </p>
                <h3>Number of course analysis</h3>
                <p>
                  Column <q>Number of course analysis</q> holds the number of unique published
                  course analysis for the particular school the given semester.
                </p>
                <h3>Number of course memos</h3>
                <p>
                  Column <q>Number of course memos</q> holds the number of unique published course
                  memos for the particular school the given semester.
                </p>
                <h3>Number of PDF course memos</h3>
                <p>
                  Column <q>Number of PDF course memos</q> holds the number of unique uploaded
                  course memos for the particular school the given semester.
                </p>
              </details>
              <h3>Course Analyses</h3>
              <CSVLink
                filename={`course-information-statistics-per-school-for-analyses-${semester}.csv`}
                className="btn btn-primary btn-sm float-right mb-2"
                data={analysisPerSchoolCSV(combinedAnalysesDataPerSchool)}
              >
                Download per school statistics for analyses (csv file)
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
              <h3>Course Memos</h3>
              <CSVLink
                filename={`course-information-statistics-per-school-for-memos-${semester}.csv`}
                className="btn btn-primary btn-sm float-right mb-2"
                data={memosPerSchoolCSV(combinedMemosDataPerSchool)}
              >
                Download per school statistics for memos (csv file)
              </CSVLink>
              <table className="table">
                <thead>
                  <tr>
                    <th>School</th>
                    <th>Number of courses</th>
                    <th>Number of web course memos</th>
                    <th>Number of PDF course memos</th>
                  </tr>
                </thead>
                <tbody>{memosPerSchoolRows(combinedMemosDataPerSchool)}</tbody>
              </table>
              <h2>Raw Data</h2>
              <p>
                Use the course information raw data to make own aggregations for example departments
                or programmes. You can export the data to a csv file by clicking on the button{' '}
                <q>Download raw data (csv file)</q>.
              </p>
              <CSVLink
                filename={`course-information-statistics-raw-data-with-analyses-${semester}.csv`}
                className="btn btn-primary btn-sm float-right mb-2"
                data={csvPerDepartmentDataWithAnalyses}
              >
                Download raw data with analyses (csv file)
              </CSVLink>
              <div style={{ overflowX: 'auto', width: '100%' }}>
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
              </div>
              <CSVLink
                filename={`course-information-statistics-raw-data-with-memos-${semester}.csv`}
                className="btn btn-primary btn-sm float-right mb-2"
                data={csvPerDepartmentDataWithMemos}
              >
                Download raw data with memos (csv file)
              </CSVLink>
              <div style={{ overflowX: 'auto', width: '100%' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Semester</th>
                      <th>School</th>
                      <th>Department Name</th>
                      <th>Course Code</th>
                      <th>Connected program(s)</th>
                      <th>Offering ID</th>
                      <th>Course Memos</th>
                    </tr>
                  </thead>
                  <tbody>{perDepartmentCourseOfferingRowsWithMemos}</tbody>
                </table>
              </div>
            </main>
          </div>
        </div>
      </div>
    )
  }
}

export default CourseStatisticsPage
