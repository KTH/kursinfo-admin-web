import React, { Component } from 'react'
import { toJS } from 'mobx'
import { inject, observer} from 'mobx-react'
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
    const { courseRound, departments, departmentsNameArr, totalOfferings, courseOfferings } = this.statisticData

    const courseOfferingRows = []
    courseOfferings.forEach(courseOffering => {
      const courseOfferingData = toJS(courseOffering)
      courseOfferingRows.push(<tr>
        <td>{courseOfferingData.semester}</td>
        <td>{courseOfferingData.departmentName}</td>
        <td>{courseOfferingData.courseCode}</td>
        <td>{courseOfferingData.offeringId}</td>
        <td>{Object.values(courseOfferingData.courseAnalysis).join(', ')}</td>
      </tr>)
    })

    return (
      <div key='kursinfo-container' className='kursinfo-main-page col'>
        <h1>Statistics {courseRound}</h1>
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
