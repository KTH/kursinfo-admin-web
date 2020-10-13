import React, { Component } from 'react'
import { toJS } from 'mobx'
import { inject, observer } from 'mobx-react'
import { CSVLink } from 'react-csv'
import i18n from '../../../../i18n'

@inject(['adminStore'])
@observer
class CourseStatisticsPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      progress: 1
    }
    this.statisticData = this.props.adminStore.statisticData
  }

  render() {
    const { courseRound, combinedDataPerSchool, courseOfferings } = this.statisticData
    const { browserConfig } = this.props.adminStore

    // HTML Rows for all course offerings for a table Per Department data

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
                cO.courseMemoInfo.isPdf
                  ? `${browserConfig.memoStorageUri}${cO.courseMemoInfo.memoId}`
                  : `${browserConfig.hostUrl}/kurs-pm/${cO.courseMemoInfo.memoId}`
              }
            >
              {cO.courseMemoInfo.memoId}
            </a>
          </td>
        </tr>
      )
    })

    // HTML Rows of a table Per school data

    const perSchoolRows = []
    const {
      schools,
      totalNumberOfCourses,
      totalNumberOfAnalyses,
      totalNumberOfWebMemos,
      totalNumberOfPdfMemos
    } = combinedDataPerSchool
    Object.keys(schools).forEach((sC) => {
      const {
        numberOfCourses,
        numberOfUniqAnalyses,
        numberOfUniqMemos,
        numberOfUniqPdfMemos
      } = schools[sC]
      perSchoolRows.push(
        <tr>
          <td>{sC}</td>
          <td>{numberOfCourses}</td>
          <td>{numberOfUniqAnalyses}</td>
          <td>{numberOfUniqMemos}</td>
          <td>{numberOfUniqPdfMemos}</td>
        </tr>
      )
    })
    perSchoolRows.push(
      <tr>
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
        <td>
          <b>{totalNumberOfWebMemos}</b>
        </td>
        <td>
          <b>{totalNumberOfPdfMemos}</b>
        </td>
      </tr>
    )

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

    // CSV for table per school data

    const csvPerSchoolData = []
    csvPerSchoolData.push([
      'School',
      'Number of courses',
      'Number of course analyses',
      'Number of web course memos',
      'Number of PDF course memos'
    ])
    Object.keys(schools).forEach((sC) => {
      csvPerSchoolData.push([
        sC,
        schools[sC].numberOfCourses,
        schools[sC].numberOfUniqAnalyses,
        schools[sC].numberOfUniqMemos,
        schools[sC].numberOfUniqPdfMemos
      ])
    })
    csvPerSchoolData.push([
      'Total',
      totalNumberOfCourses,
      totalNumberOfAnalyses,
      totalNumberOfWebMemos,
      totalNumberOfPdfMemos
    ])

    return (
      <div key="kursinfo-container" className="kursinfo-main-page col">
        <h1>Course Information Statistics {courseRound}</h1>
        <h2>Per School</h2>
        <p>
          Column <q>Number of courses</q> holds the number of active courses for the particular
          school the given semester according to Kopps.
        </p>
        <p>
          Column <q>Number of course analysis</q> holds the number of unique published course
          analysis for the particular school the given semester.
        </p>
        <p>
          Column <q>Number of course memos</q> holds the number of unique published course memos for
          the particular school the given semester.
        </p>
        <p>
          You can export the data to a CSV file by clicking on the button{' '}
          <q>Download per school statistics (CSV file)</q>.
        </p>
        <CSVLink
          filename={`course-information-statistics-per-school-${courseRound}.csv`}
          className="btn btn-primary btn-sm float-right"
          data={csvPerSchoolData}
        >
          Download per school statistics (CSV file)
        </CSVLink>
        <table>
          <thead>
            <tr>
              <th>School</th>
              <th>Number of courses</th>
              <th>Number of course analyses</th>
              <th>Number of web course memos</th>
              <th>Number of PDF course memos</th>
            </tr>
          </thead>
          <tbody>{perSchoolRows}</tbody>
        </table>

        <h2>Raw Data</h2>
        <p>
          Use the course information raw data to make own aggregations for example departments or
          programmes. You can export the data to a CSV file by clicking on the button{' '}
          <q>Download raw data (CSV file)</q>.
        </p>
        <CSVLink
          filename={`course-information-statistics-raw-data-${courseRound}.csv`}
          className="btn btn-primary btn-sm float-right"
          data={csvPerDepartmentData}
        >
          Download raw data (CSV file)
        </CSVLink>
        <table>
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
    )
  }
}

export default CourseStatisticsPage
