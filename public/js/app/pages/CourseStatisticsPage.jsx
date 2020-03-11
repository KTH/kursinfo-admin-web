import React, { Component } from 'react'
import { toJS } from 'mobx'
import { inject, observer} from 'mobx-react'
import { CSVLink } from "react-csv";
import i18n from '../../../../i18n'

@inject(['adminStore']) @observer
class CourseStatisticsPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      progress: 1
    }
    this.statisticData = this.props.adminStore.statisticData
  }

  render () {
    const { courseRound, totalOfferings, combinedDataPerSchool, courseOfferings } = this.statisticData

    const perDepartmentCourseOfferingRows = []
    courseOfferings.forEach(courseOffering => {
      const courseOfferingData = toJS(courseOffering)
      perDepartmentCourseOfferingRows.push(<tr>
        <td>{courseOfferingData.semester}</td>
        <td>{courseOfferingData.schoolMainCode}</td>
        <td>{courseOfferingData.departmentName}</td>
        <td>{courseOfferingData.courseCode}</td>
        <td>{courseOfferingData.offeringId}</td>
        <td>{courseOfferingData.courseAnalysis}</td>
      </tr>)
    })

    const perSchoolRows = []
    const { schools, totalNumberOfCourses, totalNumberOfAnalyses } = combinedDataPerSchool
    Object.keys(schools).forEach(sC => {
      perSchoolRows.push(<tr>
        <td>{sC}</td>
        <td>{schools[sC].numberOfCourses}</td>
        <td>{schools[sC].numberOfUniqAnalyses}</td>
      </tr>)
    })
    perSchoolRows.push(<tr>
        <td><b><i>Total</i></b></td>
        <td><b>{totalNumberOfCourses}</b></td>
        <td><b>{totalNumberOfAnalyses}</b></td>
    </tr>)

    const perDepartmentData = []
    perDepartmentData.push(["Semester", "School", "Department Name", "Course Code", "Offering ID", "Course Analysis"])
    courseOfferings.forEach(courseOffering => {
      const courseOfferingData = toJS(courseOffering)
      perDepartmentData.push([
        courseOfferingData.semester,
        courseOfferingData.schoolMainCode,
        courseOfferingData.departmentName,
        courseOfferingData.courseCode,
        courseOfferingData.offeringId,
        courseOfferingData.courseAnalysis
      ])
    })

    const perSchoolData = []
    perSchoolData.push(["School", "Number of courses", "Number of course analyses"])
    Object.keys(schools).forEach(sC => {
      perSchoolData.push([
        sC,
        schools[sC].numberOfCourses,
        schools[sC].numberOfUniqAnalyses
      ])
    })
    perSchoolData.push([
      "Total",
      totalNumberOfCourses,
      totalNumberOfAnalyses
    ])

    return (
      <div key='kursinfo-container' className='kursinfo-main-page col'>
        <h1>Course Information Statistics {courseRound}</h1>
        <h2>Per School</h2>
        <p>Column <q>Number of courses</q> holds the number of active courses for the particular school the given semester according to Kopps.</p>
        <p>Column <q>Number of course analysis</q> holds the number of unique published course analysis for the particular school the given semester.</p>
        <p>You can export the data to a CSV file by clicking on the button <q>Download raw data (CSV file)</q>.</p>
        <CSVLink
          filename={`course-information-statistics-per-school-${courseRound}.csv`}
          className="btn btn-primary btn-sm float-right"
          data={perSchoolData}>Download per school statistics (CSV file)
        </CSVLink>
        <table >
          <thead>
            <tr>
              <th>School</th>
              <th>Number of courses</th>
              <th>Number of course analyses</th>
            </tr>
          </thead>
          <tbody>
            { perSchoolRows }
          </tbody>
        </table>

        <h2>Raw Data</h2>
        <p>Use the course information raw data to make own aggregations for example departments or programmes. You can export the data to a CSV file by clicking on the button <q>Download raw data (CSV file)</q>.</p>
        <CSVLink
          filename={`course-information-statistics-raw-data-${courseRound}.csv`}
          className="btn btn-primary btn-sm float-right"
          data={perDepartmentData}>Download raw data (CSV file)
        </CSVLink>
        <table>
          <thead>
            <tr>
              <th>Semester</th>
              <th>School</th>
              <th>Department Name</th>
              <th>Course Code</th>
              <th>Offering ID</th>
              <th>Course Analysis</th>
            </tr>
          </thead>
          <tbody>
            { perDepartmentCourseOfferingRows }
          </tbody>
        </table>

      </div>
    )
  }
}

export default CourseStatisticsPage
