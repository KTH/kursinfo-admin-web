import React, { Component } from 'react'
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
    const { statisticData } = this
    console.log("statisticData", statisticData)
    return (
      <div key='kursinfo-container' className='kursinfo-main-page col'>
          <h1>Statistic</h1>
          <h2>Totalt för KTH</h2>
          <h3>Hur många kursomgångar har terminen?</h3>
          <p>{statisticData.length}</p>
      </div>
    )
  }

}

export default CourseStatisticsPage
