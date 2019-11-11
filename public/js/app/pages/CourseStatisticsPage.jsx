import React, { Component } from 'react'
import { inject, observer} from 'mobx-react'
import i18n from '../../../../i18n'

import { Badge } from 'reactstrap';


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
    const { courseRound, departments, departmentsNameArr, totalOfferings } = this.statisticData
    console.log('departments.keys() ', Object.keys(departments))
    return (
      <div key='kursinfo-container' className='kursinfo-main-page col'>
          <h1>Statistic</h1>
          <h2>Totalt för KTH för terminen <b>{courseRound}</b></h2>
          <h3>Hur många kursomgångar har terminen?</h3>
          <p>{totalOfferings}</p>
          {/* <h3>Hur många kursomgångar har kurs-pm (vid kursomgångens start)?</h3>
          <h3>Hur många har laddats upp utan att genereras av systemet?</h3>
          <h3>Hur många har genererats automatiskt av systemet?</h3>
          <h3>Hur många kursomgångar har kursanalys (efter kursomgångens slut)?</h3> */}
          
          <h2>Fördelat på skola och institution (course.department i Kopps)</h2>
          <h3>Hur många kursomgångar har terminen?</h3>
          {departmentsNameArr.map((key, index) =>
             <p key={key}><Badge color='secondary'> {key} </Badge> - { departments[key].name } : { departments[key].number }</p>
            )}
          {/* <p>{statisticData.departments.AIB.numberOfCourseRound}</p> */}


  {/* *   
     *   
     *   Hur många kursomgångar har kurs-pm (vid kursomgångens start)?
        *   Hur många har laddats upp utan att genereras av systemet?
        *   Hur många har genererats automatiskt av systemet?
     *   Hur många kursomgångar har kursanalys (efter kursomgångens slut)? */}
      </div>
    )
  }

}

export default CourseStatisticsPage
