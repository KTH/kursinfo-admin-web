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
    const translation = i18n.messages[lang]

    return (
      <div key='kursinfo-container' className='kursinfo-main-page col' >
        {/* ---COURSE TITEL--- */}
        <CourseTitle key='title'
          courseTitleData={courseAdminData.courseTitleData}
          pageTitle={translation.pageTitles.administrate}
          language={courseAdminData.lang}
        />
        {this.props.location.data === 'success' ?
          <Alert color='success' aria-live='polite'>
            {translation.alertMessages.success}
          </Alert>
        : ''
        }
        <div className='col'>
          <span className='Header--Link'>
            <a href={`/student/kurser/kurs/${courseCode}?l=${courseAdminData.lang}`} alt={translation.altLabel.start_link_back} class='link-back'>{translation.sellingTextButtons.button_course_info}</a>
          </span>
          <span className='AdminPage--ShowDescription'>
            <Card className='KursInfo--SellingText'>
              <CardBody>
                <CardTitle>{translation.startCards.sellingText_hd}</CardTitle>
                <CardText>{translation.startCards.sellingText_desc}</CardText>
              </CardBody>
              <CardFooter className='text-right'>
                <a href={`/admin/kurser/kurs/edit/${courseCode}?l=${courseAdminData.lang}`} alt={translation.altLabel.sellingText_btn} className='btn btn-primary'>{translation.startCards.sellingText_btn}</a>
                {/* <Link to={{ pathname: `/admin/kurser/kurs/edit/${courseCode}?l=${courseAdminData.lang}`,
                data: 'hello'
                }} className='btn btn-primary' onClick={this.doStartSellingText}>{translation.startCards.sellingText_btn}</Link> */}
                {/* <Button onClick={this.doStartSellingText} color='primary'>{translation.startCards.sellingText_btn}</Button> */}
              </CardFooter>
            </Card>
            <Card>
              <CardBody>
                <CardTitle>{translation.startCards.coursePM_hd}</CardTitle>
                <CardText>{translation.startCards.coursePM_desc}</CardText>
              </CardBody>
              <CardFooter className='text-right'>
                <Link to='#' className='btn btn-primary' alt={translation.altLabel.coursePM_btn}>{translation.startCards.coursePM_btn}</Link>
              </CardFooter>
            </Card>
            <Card>
              <CardBody>
                <CardTitle>{translation.startCards.courseDev_hd}</CardTitle>
                <CardText>{translation.startCards.courseDev_decs}</CardText>
              </CardBody>
              <CardFooter className='text-right'>
                <Link to='#' className='btn btn-primary' alt={translation.altLabel.courseDev_btn}>{translation.startCards.courseDev_btn}</Link>
              </CardFooter>
            </Card>
          </span>
        </div>
        <span className='Header--Link'>
          <a href={`/admin/kurser/kurs/${courseCode}/my`} class='link-back' alt='Översikt av mina kurser'>Översikt av mina kurser</a>
        </span>
      </div>
    )
  }
}

export default AdminStartPage
