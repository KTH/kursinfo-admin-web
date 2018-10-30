import { Component } from 'inferno'
import { inject, observer } from 'inferno-mobx'
import i18n from "../../../../i18n"


@inject(['routerStore']) @observer
class CoursePage extends Component {
 constructor (props) {
    super(props)

    this.state = {
      activeSubjectId: "State value",
      value: props.routerStore,
    }
  }

  static fetchData (routerStore, params) {
    return routerStore.getCourseInformation()
      .then((data) => {
        return routerStore = data
      })
  }

  render ({ routerStore }) {
   
    const courseInfoValues = Object.values(routerStore.RouterStore)
    const courseInfoHeaders = Object.keys(routerStore.RouterStore)
    return (
      <div  key="kursinfo-container" className="kursinfo-main-page"> 
        <br/>
        {courseInfoValues.map((item, index) => <InformationSet label={i18n.messages[1].courseInformation[courseInfoHeaders[index]]} text= {item}/>)}
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