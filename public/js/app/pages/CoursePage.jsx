import { Component } from 'inferno'
import { inject, observer } from 'inferno-mobx'
import i18n from "../../../../i18n"

//Components
import CourseRound from "./CourseRound.jsx"

@inject(['routerStore']) @observer
class CoursePage extends Component {
 constructor (props) {
    super(props)

    this.state = {
      activeSubjectId: "State value",
      value: props.routerStore
    }
  }

  /*static fetchData (routerStore, params) {
    return routerStore.getCourseInformation()
      .then((data) => {
        return routerStore = data
      })
  }*/

  render ({ routerStore }) {
   
    const courseInfoValues = Object.values(routerStore.coursePlanModel)
    const courseInfoHeaders = Object.keys(routerStore.coursePlanModel)
    //console.log("routerStore.courseRoundList", routerStore.courseRoundList)
    return (
      <div  key="kursinfo-container" className="kursinfo-main-page"> 
        <br/>
        {courseInfoValues.map((item, index) => <InformationSet label={i18n.messages[routerStore.language].courseInformation[courseInfoHeaders[index]]} text= {item}/>)}
        {routerStore.courseRoundList.map((round, index) => <CourseRound courseRound= {round} index={index} language={routerStore.language} />)}
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