import React, { Component } from 'react'
import { EMPTY } from '../util/constants'
import { Alert } from 'reactstrap'
import i18n from '../../../../i18n'

class CourseTitle extends Component {

  render () {
    const title = this.props.courseTitleData
    const pageTitle = this.props.pageTitle
    const langIndex = this.props.language === 'en' ? 0 : 1
    title.course_credits = title.apiError ? '' : title.course_credits !== EMPTY && title.course_credits.toString().indexOf('.') < 0 ? title.course_credits + '.0' : title.course_credits
    return (
      <div id='course-title' className='pageTitle col'>
        <h1 data-testid='main-heading'>{pageTitle}</h1>
        {title.apiError
          ? <div><span property='aiiso:code'>{title.course_code}</span>
            <span property='teach:pageTitle'>
              <Alert color='info' aria-live='polite'>
                {i18n.messages[langIndex].pageTitles.alertMessages.kopps_api_down}
              </Alert>
            </span>
          </div>
          : <div data-testid='main-course'><span property='aiiso:code'>{title.course_code}</span>
            <span property='teach:pageTitle'> {title.course_title}</span>
            <span content={title.course_credits} datatype='xsd:decimal' property='teach:ects'>
              &nbsp;{this.props.language === 'en' ? title.course_credits : title.course_credits.toString().replace('.', ',')}&nbsp;{this.props.language === 'en' ? 'credits' : 'hp'}
            </span>
          </div>
        }
      </div>
    )
  }
}

export default CourseTitle
