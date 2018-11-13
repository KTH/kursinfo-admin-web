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

  static fetchData (routerStore, params) {console.log("fetchData",routerStore)
    return routerStore.getCourseInformation("sf1624","sv")
      .then((data) => {
        console.log("data",data)
        return routerStore["coursePlanData"] = data
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
    console.log("routerStore in CoursePage", routerStore["coursePlanData"].coursePlanModel.course_code)
    //const courseInfoValues = Object.values(routerStore["coursePlanData"].coursePlanModel)
    //const courseInfoHeaders = Object.keys(routerStore["coursePlanData"].coursePlanModel)
    //console.log("routerStore["coursePlanData"].courseRoundList", routerStore["coursePlanData"].getCourseInformation("sf1624","sv"))
    const courseInformationToRounds = {
      course_code: routerStore["coursePlanData"].coursePlanModel.course_code,
      course_grade_scale: routerStore["coursePlanData"].coursePlanModel.course_grade_scale,
      course_level_code: routerStore["coursePlanData"].coursePlanModel.course_level_code,
      course_main_subject: routerStore["coursePlanData"].coursePlanModel.course_main_subject,
      course_valid_from: routerStore["coursePlanData"].coursePlanModel.course_valid_from
    }
    
    return (
      <div  key="kursinfo-container" className="kursinfo-main-page row" >


        {/* ---TITEL--- */}
        <CourseTitle key = "title"
            courseTitleData = {routerStore["coursePlanData"].courseTitleData}
            language={routerStore["coursePlanData"].language}
        />

        {/* ---INTRO TEXT--- */}
        <div id="courseIntroText"  dangerouslySetInnerHTML = {{ __html:routerStore["coursePlanData"].coursePlanModel.course_recruitment_text}}>
        </div>

        {/* ---COURSE ROUND DROPDOWN--- */}
        <label  id="roundDropDownLabel"> Välj en kursomgång ( {routerStore["coursePlanData"].courseRoundList.length} st ): </label>
        <select onChange = {linkEvent(this, handleDropdownChange)}>
          {routerStore["coursePlanData"].courseRoundList.map( (courseRound, index) =>{
            return <option > {`VT ${courseRound.round_course_term[0]}  
                                ${courseRound.round_short_name},     
                                ${courseRound.round_type}` } 
                  </option> }
          )}
        </select>

        {/* ---COURSE ROUND KEY INFORMATION--- */}
        <CourseRound
          courseRound= {routerStore["coursePlanData"].courseRoundList[this.state.activeRoundIndex]}
          index={this.state.activeRoundIndex}
          courseData = {courseInformationToRounds}
          language={routerStore["coursePlanData"].language}
        />

            <br/>
            <br/>

        {/* ---COLLAPSE CONTAINER---  */}
        <CourseCollapseList roundIndex={this.state.activeRoundIndex} courseData = {routerStore["coursePlanData"].coursePlanModel} className="ExampleCollapseContainer" isOpen={true} color="blue"/>
      
       
        {/* ---DELETE!!--- 
        <br/>
        <hr/>
        <div style="text-align:center;"><h3>All information från Kopps</h3></div>
        <hr/>
        */}
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
