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
      koppsApiBasePath
    } = this.statisticData
    const { adminStore } = this.props
    const { browserConfig } = adminStore
    const koppsUrl = `${koppsApiBasePath}courses/offerings?from=${semester}&skip_coordinator_info=true`

    const { withAnalyses, withMemos } = combinedDataPerDepartment
    const courseOfferings = [...withAnalyses, ...withMemos]

    // DEPARTMENT: HTML Rows for all course offerings for a table Per DEPARTMENT data
    const perDepartmentCourseOfferingRows = []
    courseOfferings.forEach((courseOffering) => {
      const cO = toJS(courseOffering)

      perDepartmentCourseOfferingRows.push(
        <tr>
          <td>{cO.semester}</td>
          <td>{cO.schoolMainCode}</td>
          <td>{cO.departmentName}</td>
          <td>{cO.courseCode}</td>
          <td width="300">{cO.connectedPrograms}</td>
          <td>{cO.offeringId}</td>
          <td>{cO.courseAnalysis}</td>
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

    // CSV Per department data
    const csvPerDepartmentData = []
    csvPerDepartmentData.push([
      'Semester',
      'School',
      'Department Name',
      'Course Code',
      'Connected program(s)',
      'Offering ID',
      'Course Analysis',
      'Course Memos'
    ])
    courseOfferings.forEach((courseOffering) => {
      const cO = toJS(courseOffering)
      csvPerDepartmentData.push([
        cO.semester,
        cO.schoolMainCode,
        cO.departmentName,
        cO.courseCode,
        cO.connectedPrograms,
        cO.offeringId,
        cO.courseAnalysis,
        cO.courseMemoEndPoint
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
                Course information statistics grouped by school. You can export the data to a csv
                file by clicking the button <q>Download per school statistics (csv file)</q>.
              </p>
              <details>
                <summary className="white">Data Used</summary>
                <p>
                  Data is fetched from{' '}
                  <a href="https://www.kth.se/api/kopps/v2/apiInfo/courses">
                    KOPPS API for Courses
                  </a>
                  , endpoint <code>/api/kopps/v2/courses/offerings</code>. Data for the current page
                  was fetched with{' '}
                  <a href={koppsUrl} target="_blank" rel="noreferrer">
                    <code>{koppsUrl}</code>
                  </a>
                  .
                </p>
                <p>
                  Course offerings that didn’t finish during the {semester} semester are filtered
                  out. This is done by discarding offerings that doesn’t meet the criteria:
                  <br />
                  <code>course.offered_semesters[last-element].semester == {semester}</code>
                </p>
              </details>
              <details>
                <summary className="white">Table Columns</summary>
                <p>
                  Column <q>Number of courses</q> holds the number of active courses for the
                  particular school the given semester according to Kopps.
                </p>
                <p>
                  Column <q>Number of course analysis</q> holds the number of unique published
                  course analysis for the particular school the given semester.
                </p>
                <p>
                  Column <q>Number of course memos</q> holds the number of unique published course
                  memos for the particular school the given semester.
                </p>
              </details>
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
                filename={`course-information-statistics-raw-data-${semester}.csv`}
                className="btn btn-primary btn-sm float-right mb-2"
                data={csvPerDepartmentData}
              >
                Download raw data (csv file)
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
                      <th>Course Memos</th>
                    </tr>
                  </thead>
                  <tbody>{perDepartmentCourseOfferingRows}</tbody>
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
