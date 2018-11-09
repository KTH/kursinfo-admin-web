import { Component } from 'inferno'
import { renderString } from 'inferno-formlib/lib/widgets/common'
import Row from 'inferno-bootstrap/dist/Row'
import Col from 'inferno-bootstrap/dist/Col'
import Button from 'inferno-bootstrap/dist/Button'
import { EMPTY } from "../util/constants"
import i18n from "../../../../i18n"

class CourseRound extends Component {
 constructor (props) {
    super(props)

    this.state = {
    }
  }
  render () {
   
    //console.log("this.props.courseRound", this.props.courseRound)
    const translate = i18n.messages[this.props.language].courseRoundInformation
    const round = this.props.courseRound
    return (
      <div id="RoundContainer" className="key-info">
        <Row>
          <Col sm="4" id="imageContainer">
            <img src="//www.kth.se/polopoly_fs/1.841226!/image/f9520503_335_200.jpg" alt="" height="" width=""/>
          </Col>
          <Col sm="7" id="roundKeyInformation">
            <Row id="firstRow">
                <Col sm="4">
                  <h4>{i18n.messages[this.props.language].courseInformation.course_level_code}</h4>
                  <p>{this.props.courseData.course_level_code}</p>
                </Col>
                <Col sm="4">
                  <h4>{i18n.messages[this.props.language].courseInformation.course_main_subject}</h4>
                  <p>{this.props.courseData.course_main_subject}</p>
                </Col>
                <Col sm="4">
                  <h4>{i18n.messages[this.props.language].courseInformation.course_grade_scale}</h4>
                  <p>{this.props.courseData.course_grade_scale}</p>
                </Col>
              </Row>
              <Row id="secondRow">
              <Col sm="4">
              <h4>{translate.round_start_date}</h4>
                <p>{round ? round.round_start_date : ""}</p>
              </Col>
              <Col sm="4">
              <h4>{translate.round_course_place}</h4>
                <p>{round ? round.round_course_place : ""}</p>
              </Col>
              <Col sm="4">
              <h4>{translate.round_tutoring_form}</h4>
                <p>{round ? round.round_tutoring_form : ""}, {round ? round.round_tutoring_time : ""}</p>
              </Col>
            </Row> 
            <Row id="thirdRow">
              <Col sm="4">
              <h4>{translate.round_tutoring_language}</h4>
                <p>{round ? round.round_tutoring_language : ""}</p>
              </Col>
              <Col sm="4">
              <h4>{translate.round_application_code}</h4>
                <p>{round ? round.round_application_code : ""}</p>
              </Col>
              <Col sm="4">
                <h4></h4> 
                <Button color="primery" >
                    {i18n.messages[this.props.language].courseInformationLabels.label_course_syllabus}
                </Button>
                <p className="small-text" >
                  {i18n.messages[this.props.language].courseInformationLabels.label_course_syllabus_valid_from }&nbsp; 
                  {this.props.courseData.course_valid_from[0]}
                </p>
              </Col>
            </Row> 
          </Col>
       </Row>
     
    </div>
  )
    
  }
} 

/*{round.round_part_of_programme.map( (programme, index) =>
  <p> <a target="_blank" key={index} href={programme.url}>
       {programme.title}, 
       {i18n.messages[this.props.language].courseInformationLabels.label_programme_year} {programme.studyYear},
       {programme.electiveCondition}
   </a></p>)}*/

const RoundProgrammeLinks = ({programmeList = [], language = 0}) => {
    let programmeString = ""
    return(
       
     <div></div>
    )
}

const InformationSet = ({label = "Rubrik", text}) => {
  return(
    <div>
      <h2>{label}</h2>
      <p dangerouslySetInnerHTML={{ __html:text}}/>
    </div>

  )
}

export default CourseRound