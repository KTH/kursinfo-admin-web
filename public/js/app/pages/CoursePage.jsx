import { render, Component, linkEvent } from 'inferno'
import { inject, observer } from 'inferno-mobx'

/*import Dropdown from 'kth-style-inferno-bootstrap/dist/Dropdown'
import DropdownMenu from 'kth-style-inferno-bootstrap/dist/DropdownMenu'
import DropdownItem from 'kth-style-inferno-bootstrap/dist/DropdownItem'
import DropdownToggle from 'kth-style-inferno-bootstrap/dist/DropdownToggle'*/

import i18n from "../../../../i18n"

//Components
import CourseRound from "../components/CourseRound.jsx"
import CourseTitle from "../components/CourseTitle.jsx"
import CourseCollapseList from "../components/CourseCollapseList.jsx"

//Delete:
import CourseRoundTemp from "../components/CourseRoundTemp.jsx"

function handleDropdownChange(thisInstance, event){
  event.preventDefault();
  console.log("!!!!!DROPDOWN!!!")
  thisInstance.setState({
    activeRoundIndex: 2
  })
}

@inject(['routerStore'])
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

  render ({ routerStore }) {

    const courseInfoValues = Object.values(routerStore.coursePlanModel)
    const courseInfoHeaders = Object.keys(routerStore.coursePlanModel)
    const courseInformationToRounds = {
      course_code: routerStore.coursePlanModel.course_code,
      course_grade_scale: routerStore.coursePlanModel.course_grade_scale,
      course_level_code: routerStore.coursePlanModel.course_level_code,
      course_main_subject: routerStore.coursePlanModel.course_main_subject,
      course_valid_from: routerStore.coursePlanModel.course_valid_from
    }
    //console.log("routerStore.courseRoundList", routerStore.courseRoundList)
    return (
      <div  key="kursinfo-container" className="kursinfo-main-page row" >
        <div onClick={() => console.log('test')}>Test</div>

        {/* ---TITEL--- */}
        <CourseTitle key = "title"
            courseTitleData = {routerStore.courseTitleData}
            language={routerStore.language}
        />

        {/* ---INTRO TEXT--- */}
        <div id="courseIntroText"  dangerouslySetInnerHTML = {{ __html:routerStore.coursePlanModel.course_recruitment_text}}>
        </div>

        {/* ---COURSE ROUND DROPDOWN--- */}
        <label  id="roundDropDownLabel"> Välj en kursomgång ( {routerStore.courseRoundList.length} st ): </label>
        <select onChange = {linkEvent(this, handleDropdownChange)}>
          {routerStore.courseRoundList.map( (courseRound, index) =>{
            return <option > VT {courseRound.round_course_term[0] },  
                                {courseRound.round_short_name},     
                                {courseRound.round_type}  
                  </option> }
          )}
        </select>

        {/* ---COURSE ROUND KEY INFORMATION--- */}
        <CourseRound
          courseRound= {routerStore.courseRoundList[this.state.activeRoundIndex]}
          index={this.state.activeRoundIndex}
          courseData = {courseInformationToRounds}
          language={routerStore.language}
        />

        {/* ---COLLAPSE CONTAINER--- */}
        <CourseCollapseList roundIndex={this.state.activeRoundIndex} courseData = {routerStore.coursePlanModel} className="ExampleCollapseContainer" isOpen={true} color="blue"/>
       
       
       
       
       
        {/* ---DELETE!!--- */}
        <br/>
        <hr/>
        <div style="text-align:center;"><h3>All information från Kopps</h3></div>
        <hr/>
        {courseInfoValues.map((item, index) => <InformationSet label={i18n.messages[routerStore.language].courseInformation[courseInfoHeaders[index]]} text= {item}/>)}
        {routerStore.courseRoundList.map((round, index) => <CourseRoundTemp courseRound= {round} index={index} language={routerStore.language} />)}

        {this.state.activeRoundIndex}
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
