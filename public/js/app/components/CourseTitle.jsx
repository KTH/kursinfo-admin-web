import { Component } from 'inferno'
import i18n from "../../../../i18n"

class CourseTitle extends Component {
  render () {
    const title = this.props.courseTitleData
    return (
      <h1 id="course-title">
        <span property="aiiso:code">{title.course_code}</span>
        <span property="teach:courseTitle"> {title.course_title},</span>
        <span content={title.course_credits} datatype="xsd:decimal" property="teach:ects"> {title.course_credits} {this.props.language === 0 ? " credits" : " hp"} </span>
        <h2 class="secondTitle">
          <span property="teach:courseTitle">{title.course_other_title}</span>
        </h2>
      </h1> 
    )
  }
}

export default CourseTitle