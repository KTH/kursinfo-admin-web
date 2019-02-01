import { Component, linkEvent } from 'inferno'
import { inject, observer } from 'inferno-mobx'
import i18n from '../../../../i18n'

import CourseTitle from '../components/CourseTitle.jsx'
import Container from 'kth-style-inferno-bootstrap/dist/Container'
import Button from 'inferno-bootstrap/lib/Button'
// import Col from 'inferno-bootstrap/lib/Col'
// import Form from 'inferno-bootstrap/lib/Form/Form'
// import Input from 'inferno-bootstrap/lib/Form/Input'
// import Row from 'inferno-bootstrap/lib/Row'
import Card from 'inferno-bootstrap/lib/Card/Card'
import CardBody from 'inferno-bootstrap/lib/Card/CardBody'
import CardTitle from 'inferno-bootstrap/lib/Card/CardTitle'
import CardText from 'inferno-bootstrap/lib/Card/CardText'
import CardFooter from 'inferno-bootstrap/lib/Card/CardFooter'

@inject(['adminStore']) @observer
class AdminStartPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isSellingText: false,
      isCoursePM: false,
      isCourseDev: false
    }
    this.doStartSellingText = this.doStartSellingText.bind(this)
    this.doStartCoursePM = this.doStartCoursePM.bind(this)
    this.doStartCourseDev = this.doStartCourseDev.bind(this)
    this.doExit = this.doExit.bind(this)
  }

  doExit (event) {
    event.preventDefault()
    this.setState({
      sellingText: this.props.adminStore.sellingText,
      editDescription: false,
      enteredEditMode: false,
      hasDoneSubmit: false,
      errorMsg: false
    })
    console.log('didExit')
  }

  render ({adminStore}) {
    const courseAdminData = adminStore['courseAdminData']

    return (
      <div key='kursinfo-container' className='kursinfo-main-page col' >
        {/* ---COURSE TITEL--- */}
        <CourseTitle key='title'
          courseTitleData={courseAdminData.courseTitleData}
          language={courseAdminData.lang}
            />

          {/* ---IF in edit mode or not--- */}

        {this.state.editDescription === true ? (
          <div className='AdminPage--EditSomething col'>
          </div>
        ) : (
          <div className='AdminPage--ShowMenu row'>
            <Card className='KursInfo--SellingText'>
              <CardBody>
                <CardTitle>Kurssäljande information</CardTitle>
                <CardText>Lägg till kurssäljande information för att tydligare förklare varför studenter behöver den kursen</CardText>
                {/* <CardText><TextBlock text={this.state.sellingText} /></CardText> */}
              </CardBody>
              <CardFooter className='text-right'><Button onClick={this.doStartSellingText} color='primary'>Lägg till kortbeskrivning</Button></CardFooter>
            </Card>
            <Card>
              <CardBody>
                <CardTitle>Kurs-PM</CardTitle>
                <CardText>Lägg till kurs-pm information som PDF</CardText>
                {/* <CardText><TextBlock text={this.state.sellingText} /></CardText> */}
              </CardBody>
              <CardFooter className='text-right'><Button onClick={this.doStartCoursePM} color='primary'>Ladda upp kurs-pm</Button></CardFooter>
            </Card>
            <Card>
              <CardBody>
                <CardTitle>Kursutveckling</CardTitle>
                <CardText>Lägg till kurssäljande information för att tydligare förklare varför studenter behöver den kursen</CardText>
                {/* <CardText><TextBlock text={this.state.sellingText} /></CardText> */}
              </CardBody>
              <CardFooter className='text-right'><Button onClick={this.doStartCourseDev} color='primary'>Lägg till kursutveckling</Button></CardFooter>
            </Card>
          </div>
        )}
      </div>
    )
  }
}

export default AdminStartPage
