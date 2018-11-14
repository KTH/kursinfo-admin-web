import { render, Component, linkEvent } from 'inferno'
import { inject, observer } from 'inferno-mobx'

/*import Dropdown from 'kth-style-inferno-bootstrap/dist/Dropdown'
import DropdownMenu from 'kth-style-inferno-bootstrap/dist/DropdownMenu'
import DropdownItem from 'kth-style-inferno-bootstrap/dist/DropdownItem'
import DropdownToggle from 'kth-style-inferno-bootstrap/dist/DropdownToggle'*/

import i18n from "../../../../i18n"
import { EMPTY, FORSKARUTB_URL } from "../util/constants"

//Components
import CourseRound from "../components/CourseRound.jsx"
import CourseTitle from "../components/CourseTitle.jsx"
import CourseCollapseList from "../components/CourseCollapseList.jsx"


function handleDropdownChange(thisInstance, event){
  event.preventDefault();
  thisInstance.setState({
    activeRoundIndex: event.target.selectedIndex
  })
}

@inject(['routerStore']) @observer
class CoursePage extends Component {
  constructor (props) {
    super(props)
    this.state = {
        activeRoundIndex: 0,
        dropdownOpen: false
      }
    //this.handleDropdownChange = this.handleDropdownChange.bind(this)
    //this.toggle = this.toggle.bind(this)
  }

  static fetchData (routerStore, params) {
    return routerStore.getCourseInformation("sf1624","sv")
      .then((data) => {
        console.log("data",data)
        return courseData = data
      })
  }

  /*toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    })
  }*/

  /*handleDropdownChange(event){
    console.log("!!!!!DROPDOWN!!!", event)
    this.setState({
      activeRoundIndex: 2
    })
  }*/

  componentDidMount() {
    window.addEventListener("keydown", (e) => console.log(e))
  }

  render ({ routerStore}){
    const courseData = routerStore["courseData"]
    console.log("routerStore in CoursePage", courseData)
    const courseInformationToRounds = {
      course_code: courseData.coursePlanModel.course_code,
      course_grade_scale: courseData.coursePlanModel.course_grade_scale,
      course_level_code: courseData.coursePlanModel.course_level_code,
      course_main_subject: courseData.coursePlanModel.course_main_subject,
      course_valid_from: courseData.coursePlanModel.course_valid_from
    }
    
    return (
      <div  key="kursinfo-container" className="kursinfo-main-page row" >


        {/* ---COURSE TITEL--- */}
        <CourseTitle key = "title"
            courseTitleData = {courseData.courseTitleData}
            language={courseData.language}
        />

        {/* ---INTRO TEXT--- */}
        <div id="courseIntroText"  dangerouslySetInnerHTML = {{ __html:courseData.coursePlanModel.course_recruitment_text}}>
        </div>

        {/* ---COURSE ROUND DROPDOWN--- */}
        <label  id="roundDropDownLabel"> Välj en kursomgång ( {courseData.courseRoundList.length} st ): </label>
        <select onChange = {linkEvent(this, handleDropdownChange)}>
          {courseData.courseRoundList.map( (courseRound, index) =>{
            return <option > {`VT ${courseRound.round_course_term[0]}  
                                ${courseRound.round_short_name},     
                                ${courseRound.round_type}` } 
                  </option> })
          }
        </select>

        {/* ---COURSE ROUND KEY INFORMATION--- */}
        <CourseRound
          courseRound= {courseData.courseRoundList[this.state.activeRoundIndex]}
          index={this.state.activeRoundIndex}
          courseData = {courseInformationToRounds}
          language={courseData.language}
        />

        {/* ---IF RESEARCH LEVEL: SHOW "Postgraduate course" LINK--  */}
        {courseData.coursePlanModel.course_level_code === "RESEARCH" ?
          <span>
            <h3>Forskarkurs</h3>
            <a target="_blank" href={`${FORSKARUTB_URL}/${courseData.coursePlanModel.course_department_code}`}> 
            {i18n.messages[courseData.language].courseInformationLabels.label_postgraduate_course} {courseData.coursePlanModel.course_department}
            </a> 
          </span>
          : ""}
        <br/>
        <br/>
        {/* ---COLLAPSE CONTAINER---  */}
        <CourseCollapseList roundIndex={this.state.activeRoundIndex} courseData = {courseData.coursePlanModel} className="ExampleCollapseContainer" isOpen={true} color="blue"/>
      
      </div>
    )
  }
}

const InformationSet = ({label = "Rubrik", text}) => {
  return(
    <div>
      <h2>{label}</h2>
      <p dangerouslySetInnerHTML={{ __html:text}}/>
    </div>

  )
}

export default CoursePage
