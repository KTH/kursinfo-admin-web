import { Component } from 'inferno'
import i18n from "../../../../i18n"

class CourseRound extends Component {
 constructor (props) {
    super(props)

    this.state = {
    }
  }
  render () {
   
    //console.log("this.props.courseRound", this.props.courseRound)
    const courseRoundValues = Object.values(this.props.courseRound)
    const courseRoundHeaders = Object.keys(this.props.courseRound)
    return (
        <div  key={`round-container_${this.props.index}`} className="kursinfo-round-container"> 
         <br/>
          <hr/>
          <div key={this.props.index} style="text-align:center;"><h4>Kursomgång {this.props.index + 1}</h4></div>
          <hr/>
         
          {courseRoundValues.map((item, index) => <InformationSet label={i18n.messages[this.props.language].courseRoundInformation[courseRoundHeaders[index]]} text= {item}/>)}
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

export default CourseRound