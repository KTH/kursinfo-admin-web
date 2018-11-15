import { Component } from 'inferno'
import i18n from "../../../../i18n"

class CourseTitle extends Component {
  render () {
    const title = this.props.courseTitleData
    return (
      <div id="course-title" className="col">
        <h1><span property="aiiso:code">{title.course_code}</span>
        <span property="teach:courseTitle"> {title.course_title},</span>
        <span content={title.course_credits} datatype="xsd:decimal" property="teach:ects"> {title.course_credits} {this.props.language === 0 ? " credits" : " hp"} </span>
        </h1>
        <h2 className="secondTitle">
          <span property="teach:courseTitle">{title.course_other_title}</span>
        </h2>
      </div> 
    )
  }
}

export default CourseTitle