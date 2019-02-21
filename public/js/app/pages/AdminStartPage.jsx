import { Component, linkEvent } from 'inferno'
import { inject, observer } from 'inferno-mobx'
import i18n from '../../../../i18n'

import CourseTitle from '../components/CourseTitle.jsx'
import Card from 'inferno-bootstrap/lib/Card/Card'
import CardBody from 'inferno-bootstrap/lib/Card/CardBody'
import CardTitle from 'inferno-bootstrap/lib/Card/CardTitle'
import CardText from 'inferno-bootstrap/lib/Card/CardText'
import CardFooter from 'inferno-bootstrap/lib/Card/CardFooter'
import {Link} from 'inferno-router'
import Alert from 'inferno-bootstrap/lib/Alert'

@inject(['adminStore']) @observer
class AdminStartPage extends Component {

  render ({adminStore}) {
    const courseAdminData = adminStore['courseAdminData']
    const lang = courseAdminData.lang === 'en' ? 0 : 1
    const courseCode = courseAdminData.courseTitleData.course_code

    return (
      <div key='kursinfo-container' className='kursinfo-main-page col' >
        {/* ---COURSE TITEL--- */}
        <CourseTitle key='title'
          courseTitleData={courseAdminData.courseTitleData}
          pageTitle={i18n.messages[lang].pageTitles.administrate}
          language={courseAdminData.lang}
        />
        {this.props.location.data === 'success' ?
          <Alert color='success' aria-live='polite'>
            {i18n.messages[lang].alertMessages.success}
          </Alert>
        : ''
        }
        <div className='col'>
          <span className='Header--Link'>
            <a href={`/student/kurser/kurs/${courseCode}?l=${courseAdminData.lang}`} class='link-back'>{i18n.messages[lang].sellingTextButtons.button_course_info}</a>
          </span>
          <span className='AdminPage--ShowDescription'>
            <Card className='KursInfo--SellingText'>
              <CardBody>
                <CardTitle>{i18n.messages[lang].startCards.sellingText_hd}</CardTitle>
                <CardText>{i18n.messages[lang].startCards.sellingText_desc}</CardText>
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
              </CardBody>
              <CardFooter className='text-right'>
                <Link to='#' className='btn btn-primary'>{i18n.messages[lang].startCards.coursePM_btn}</Link>
              </CardFooter>
            </Card>
            <Card>
              <CardBody>
                <CardTitle>{i18n.messages[lang].startCards.courseDev_hd}</CardTitle>
                <CardText>{i18n.messages[lang].startCards.courseDev_decs}</CardText>
              </CardBody>
              <CardFooter className='text-right'>
                <Link to='#' className='btn btn-primary'>{i18n.messages[lang].startCards.courseDev_btn}</Link>
              </CardFooter>
            </Card>
          </span>
        </div>
        <span className='Header--Link'>
          <a href={`/admin/kurser/kurs/${courseCode}/my`} class='link-back'>Översikt av mina kurser</a>
        </span>
      </div>
    )
  }
}

export default AdminStartPage
