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

    const courseOfferingRows = []
    courseOfferings.forEach(courseOffering => {
      const courseOfferingData = toJS(courseOffering)
      courseOfferingRows.push(<tr>
        <td>{courseOfferingData.semester}</td>
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
    perDepartmentData.push(["Semester", "Department Name", "Course Code", "Offering ID", "Course Analysis"])
    courseOfferings.forEach(courseOffering => {
      const courseOfferingData = toJS(courseOffering)
      perDepartmentData.push([
        courseOfferingData.semester,
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
        <h1>Statistics {courseRound}</h1>
        <h2>Per School</h2>
        <p>Kolumnen ”Number of courses” ska visa summan av antalet kurser med kurstillfällen som har starttermin enligt parameter från url (eller motsvarande) för skolan.</p>
        <p>Kolumnen ”Number of course analysis´” ska visa summan av antalet unika publicerade kursanalyser för skolan aktuell termin.</p>
        <CSVLink
          filename={`per-school-statistics-${courseRound}.csv`}
          className="btn btn-primary btn-sm float-right"
          data={perSchoolData}>Download Per School Statistics (CSV file)
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

        <h2>Per Department</h2>
        <CSVLink
          filename={`per-department-statistics-${courseRound}.csv`}
          className="btn btn-primary btn-sm float-right"
          data={perDepartmentData}>Download Per Department Statistics (CSV file)
        </CSVLink>
        <table>
          <thead>
            <tr>
              <th>Semester</th>
              <th>Department Name</th>
              <th>Course Code</th>
              <th>Offering ID</th>
              <th>Course Analysis</th>
            </tr>
          </thead>
          <tbody>
            { courseOfferingRows }
          </tbody>
        </table>

      </div>
    )
  }
}

export default CourseStatisticsPage
