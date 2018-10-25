import { Component } from 'inferno'


class CoursePage extends Component {
 constructor (props) {
    super(props)

    this.state = {
      activeSubjectId: "State value"
    }
  }

  render () {
    return (
      <div  key="kursinfo-container" className="kursinfo-main-page">
        <p>
        Test: tjoho -> {this.state.activeSubjectId}  
        </p> 
      </div>
    )
  }
}

export default CoursePage