import { Component } from 'inferno'
import Collapse from 'inferno-bootstrap/dist/Collapse'
import Card from 'inferno-bootstrap/dist/Card/Card'
import CardBody from 'inferno-bootstrap/dist/Card/CardBody'
import Button from 'inferno-bootstrap/dist/Button'
import i18n from "../../../../i18n"

class CourseCollapse extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isOpen: props.isOpen,
      class: 'collapseBtn'
    }
    this.doToggle = this.doToggle.bind(this)
  }

  /*test = () => {
    console.log('test')
    this.setState({
      isOpen: !this.state.isOpen,
      class: 'testtesttest'
    })
  }*/

  doToggle(e) {
    e.preventDefault()
    console.log("!!!!!")
    this.setState({
      isOpen: !this.state.isOpen,
      class: 'testtesttest'
    })
  }

  render() {
    //console.log(this.props)
    return (
      <div>
        <Button className={this.state.class} onClick={this.test}>{this.props.header}</Button>
        <Collapse isOpen={this.state.isOpen}>
          <Card className="ExampleCollapseContainer">
            <CardBody>
              {this.props.courseData.map((data)=>
              <span>
                 <h2>{data.header}</h2> 
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