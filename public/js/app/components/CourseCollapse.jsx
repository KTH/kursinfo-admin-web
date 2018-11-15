import { Component } from 'inferno'
import Collapse from 'inferno-bootstrap/dist/Collapse'
import Card from 'inferno-bootstrap/dist/Card/Card'
import CardBody from 'inferno-bootstrap/dist/Card/CardBody'
import Button from 'inferno-bootstrap/dist/Button'
//import i18n from "../../../../i18n"

class CourseCollapse extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isOpen: props.isOpen,
      class: 'collapseBtn',
      iconClass: props.isOpen ? "icon-chevron-down":"icon-chevron-right"
    }
    this.doToggle = this.doToggle.bind(this)
  }

  doToggle(e) {
    e.preventDefault()
    this.setState({
      isOpen: !this.state.isOpen,
      iconClass: !this.state.isOpen ? "icon-chevron-down":"icon-chevron-right"
    })
  }

  render() {
    return (
      <div className="col-12"> 
        <Button className={this.state.class} 
                onClick={this.doToggle}>
                <i class={this.state.iconClass}></i>&nbsp; 
                {this.props.header}
        </Button>
        <Collapse isOpen={this.state.isOpen}>
          <Card className="collapseContainer">
            <CardBody>
              {this.props.courseData.map((data)=>
              <span>
                 <h3>{data.header}</h3> 
                <p dangerouslySetInnerHTML={{ __html:data.text}}/>
               </span>
              )}
            </CardBody>
          </Card>
        </Collapse>  
      </div>  
    )
  }
}

export default CourseCollapse