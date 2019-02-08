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
import CardLink from 'inferno-bootstrap/lib/Card/CardLink'
import {Link} from 'inferno-router'
import Alert from 'inferno-bootstrap/lib/Alert'

@inject(['adminStore']) @observer
class AdminStartPage extends Component {

  render ({adminStore}) {
    const courseAdminData = adminStore['courseAdminData']
    const lang = courseAdminData.lang === 'en' ? 0 : 1
    const courseCode = courseAdminData.courseTitleData.course_code
    console.log('windowddd', this.props.location.data)
    return (
      <div key='kursinfo-container' className='kursinfo-main-page col' >
        {/* ---COURSE TITEL--- */}
        <CourseTitle key='title'
          courseTitleData={courseAdminData.courseTitleData}
          language={courseAdminData.lang}
        />
        {this.props.location.data === 'success' ?
          <Alert color='success' aria-live='polite'>
            {i18n.messages[lang].alertMessages.success}
          </Alert>
        : ''
        }
        <div>
          <span className='Header--Button'>
            <a href={`/student/kurser/kurs/${courseCode}?l=${courseAdminData.lang}`} class='link-back'>{i18n.messages[lang].sellingTextButtons.button_course_info}</a>
          </span>
          <span className='AdminPage--ShowDescription row'>
            <Card className='KursInfo--SellingText'>
              <CardBody>
                <CardTitle>{i18n.messages[lang].startCards.sellingText_hd}</CardTitle>
                <CardText>{i18n.messages[lang].startCards.sellingText_desc}</CardText>
                {/* <CardText><TextBlock text={this.state.sellingText} /></CardText> */}
              </CardBody>
              <CardFooter className='text-right'>
                <a href={`/admin/kurser/kurs/edit/${courseCode}?l=${courseAdminData.lang}`} className='btn btn-primary'>{i18n.messages[lang].startCards.sellingText_btn}</a>
                {/* <Link to={{ pathname: `/admin/kurser/kurs/edit/${courseCode}?l=${courseAdminData.lang}`,
                data: 'hello'
                }} className='btn btn-primary' onClick={this.doStartSellingText}>{i18n.messages[lang].startCards.sellingText_btn}</Link> */}
                {/* <Button onClick={this.doStartSellingText} color='primary'>{i18n.messages[lang].startCards.sellingText_btn}</Button> */}
              </CardFooter>
            </Card>
            <Card>
              <CardBody>
                <CardTitle>{i18n.messages[lang].startCards.coursePM_hd}</CardTitle>
                <CardText>{i18n.messages[lang].startCards.coursePM_desc}</CardText>
                {/* <CardText><TextBlock text={this.state.sellingText} /></CardText> */}
              </CardBody>
              <CardFooter className='text-right'>
                <Link to='#' className='btn btn-primary'>{i18n.messages[lang].startCards.coursePM_btn}</Link>
              </CardFooter>
            </Card>
            <Card>
              <CardBody>
                <CardTitle>{i18n.messages[lang].startCards.courseDev_hd}</CardTitle>
                <CardText>{i18n.messages[lang].startCards.courseDev_decs}</CardText>
                {/* <CardText><TextBlock text={this.state.sellingText} /></CardText> */}
              </CardBody>
              <CardFooter className='text-right'>
                <Link to='#' className='btn btn-primary'>{i18n.messages[lang].startCards.courseDev_btn}</Link>
                {/* <Button onClick={this.doStartCourseDev} color='primary'>{i18n.messages[lang].startCards.courseDev_btn}</Button> */}
              </CardFooter>
            </Card>
          </span>
        </div>
        <span className='Header--Button'>
          <a href={`/admin/kurser/kurs/${courseCode}/my`} class='link-back'>Översikt av mina kurser</a>
        </span>
      </div>
    )
  }
}

export default AdminStartPage
