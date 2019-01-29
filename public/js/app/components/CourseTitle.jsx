import { Component } from 'inferno'
import i18n from '../../../../i18n'
import { EMPTY } from '../util/constants'

class CourseTitle extends Component {

  render () {
    const title = this.props.courseTitleData
    title.course_credits = title.course_credits !== EMPTY && title.course_credits.toString().indexOf('.') < 0 ? title.course_credits + '.0' : title.course_credits
    const language = this.props.language === 'en' ? 0 : 1
    return (
      <div id='course-title' className='courseTitle col'>
        <h1><span property='aiiso:code'>{title.course_code}</span>
          <span property='teach:courseTitle'> {title.course_title}</span>
          <span content={title.course_credits} datatype='xsd:decimal' property='teach:ects'> {this.props.language === 'en' ? title.course_credits : title.course_credits.toString().replace('.', ',')}&nbsp;{this.props.language === 'en' ? 'credits' : 'hp'} </span>
        </h1>
        <p property='teach:courseTitle'>{title.course_other_title}</p>
      </div>
    )
  }
}

export default CourseTitle
