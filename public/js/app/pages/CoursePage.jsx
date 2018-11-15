import { render, Component, linkEvent } from 'inferno'
import { inject, observer } from 'inferno-mobx'

/*import Dropdown from 'kth-style-inferno-bootstrap/dist/Dropdown'
import DropdownMenu from 'kth-style-inferno-bootstrap/dist/DropdownMenu'
import DropdownItem from 'kth-style-inferno-bootstrap/dist/DropdownItem'
import DropdownToggle from 'kth-style-inferno-bootstrap/dist/DropdownToggle'


import Dropdown from 'kth-style-iinferno-bootstrap/dist/Dropdown'
import DropdownMenu from 'kth-style-iinferno-bootstrap/dist/DropdownMenu'
import DropdownItem from 'kth-style-iinferno-bootstrap/dist/DropdownItem'
import DropdownToggle from 'kth-style-iinferno-bootstrap/dist/DropdownToggle'
*/

import Dropdown from 'inferno-bootstrap/dist/Dropdown'
import DropdownMenu from 'inferno-bootstrap/dist/DropdownMenu'
import DropdownItem from 'inferno-bootstrap/dist/DropdownItem'
import DropdownToggle from 'inferno-bootstrap/dist/DropdownToggle'

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
        dropdownsIsOpen:{
          dropDown1: false,
          dropdown2: false
        }
        
      }
    this.handleDropdownChange = this.handleDropdownChange.bind(this)
    this.handleDropdownSelect = this.handleDropdownSelect.bind(this)
    this.toggle = this.toggle.bind(this)
  }

  static fetchData (routerStore, params) {
    return routerStore.getCourseInformation("sf1624","sv")
      .then((data) => {
        console.log("data",data)
        return courseData = data
      })
  }

  toggle() {
    let prevState = this.state
    const selectedInfo = event.target.id.indexOf('_') > 0 ? event.target.id.split('_')[0] : event.target.id
    prevState.dropdownsIsOpen[selectedInfo] = !prevState.dropdownsIsOpen[selectedInfo]
    this.setState({
      prevState
    })
  }

  handleDropdownSelect(){
    event.preventDefault()
    const selectInfo = event.target.id.split('_')
    this.setState({
      activeRoundIndex: selectInfo[1]
    })
  }

  handleDropdownChange(event){
    event.preventDefault();
    this.setState({
      activeRoundIndex: event.target.selectedIndex
    })
  }

  /*componentDidMount() {
    window.addEventListener("keydown", (e) => console.log(e))
  }*/

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
      <div  key="kursinfo-container" className="kursinfo-main-page col" >


        {/* ---COURSE TITEL--- */}
        <CourseTitle key = "title"
            courseTitleData = {courseData.courseTitleData}
            language={courseData.language}
        />

        {/* ---INTRO TEXT--- */}
        <div id="courseIntroText" 
          className = "col-12" 
          dangerouslySetInnerHTML = {{ __html:courseData.coursePlanModel.course_recruitment_text}}>
        </div>

         {/* ---COURSE ROUND HEADER--- */}
         {courseData.courseSemesters.length === 0 ? "" :
          <div id="courseRoundHeader" className="col-12">
                <h2> Kursinformation för kurstillfället
                {` ${courseData.courseRoundList[this.state.activeRoundIndex].round_course_term[1] === 2 ? "VT " : "HT "}
                  ${courseData.courseRoundList[this.state.activeRoundIndex].round_course_term[0]}  
                  ${courseData.courseRoundList[this.state.activeRoundIndex].round_short_name},     
                  ${courseData.courseRoundList[this.state.activeRoundIndex].round_type}` 
                } 
              </h2>
              <h4>Välj en kursomgång ( totalt {courseData.courseRoundList.length} st för denna kurs ):</h4>
          </div>
         }


        {/* ---COURSE ROUND DROPDOWN--- */}
        <div id="courseDropdownMenu" className="col">
          <div className="row" id="semesterDropdownMenue" key="semesterDropdownMenue">
            {courseData.courseSemesters.length === 0 ? <h4>Denna kursen har inga kursomgångar/kurstillfällen</h4> : courseData.courseSemesters.map((semester, index)=>{
                return <DropdownCreater 
                          courseRoundList = {courseData.courseRoundList} 
                          callerInstance = {this} 
                          year = {semester} 
                          semester={"1"} 
                          index = {index}
                      />
            })}
          </div>
        </div>  


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


        {/* ---COLLAPSE CONTAINER---  */}
        <CourseCollapseList 
            roundIndex={this.state.activeRoundIndex} 
            courseData = {courseData.coursePlanModel} 
            className="ExampleCollapseContainer" 
            isOpen={true} 
            color="blue"
          />
        <br/>
      </div>
    )
  }
}


//*******************************************************************************************************************//


const DropdownCreater = ({ courseRoundList , callerInstance, semester = "1", year = "2018", index = 0}) => {
  let listIndex = []
  const dropdownID = "dropdown"+index
  return(
    <div className = "col-2">
      <Dropdown isOpen={callerInstance.state.dropdownsIsOpen[dropdownID]} toggle={callerInstance.toggle} key={"dropD"+index}>
                <DropdownToggle id={dropdownID} caret>
                  {semester === 1 ? "VT" : "HT"} {year}
                </DropdownToggle>
                <DropdownMenu>
                {
                  courseRoundList.filter( (courseRound, index) =>{
                    if(courseRound.round_course_term[0] === year){
                      listIndex.push(index)
                      return courseRound
                    }
                  }).map( (courseRound, index) =>{
                  return (
                      <DropdownItem key ={index} id={dropdownID+"_"+listIndex[index]} onClick = {callerInstance.handleDropdownSelect}> 
                        {
                          `${courseRound.round_type} för ${courseRound.round_short_name}` 
                        } 
                      </DropdownItem>
                  )
                })}
            </DropdownMenu>
          </Dropdown>
      </div>
  )
}

export default CoursePage
