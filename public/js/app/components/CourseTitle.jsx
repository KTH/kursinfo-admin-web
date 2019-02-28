import { Component } from 'inferno'
import { EMPTY } from '../util/constants'

class CourseTitle extends Component {

  render () {
    const title = this.props.courseTitleData
    const pageTitle = this.props.pageTitle
    title.course_credits = title.course_credits !== EMPTY && title.course_credits.toString().indexOf('.') < 0 ? title.course_credits + '.0' : title.course_credits
    return (
      <div id='course-title' className='courseTitle col'>
        <h1><span property='aiiso:code'>{title.course_code}</span>
          <span property='teach:courseTitle'> {title.course_title}</span>
          <span content={title.course_credits} datatype='xsd:decimal' property='teach:ects'>
            &nbsp;{this.props.language === 'en' ? title.course_credits : title.course_credits.toString().replace('.', ',')}&nbsp;{this.props.language === 'en' ? 'credits' : 'hp'}
          </span>
        </h1>
        <h2>{pageTitle}</h2>
      </div>
    )
  }
}

export default CourseTitle
