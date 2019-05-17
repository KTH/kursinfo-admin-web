import { Component, linkEvent } from 'inferno'
import { inject, observer } from 'inferno-mobx'
import i18n from '../../../../i18n'

import CourseTitle from '../components/CourseTitle.jsx'
import Card from 'inferno-bootstrap/lib/Card/Card'
import CardBody from 'inferno-bootstrap/lib/Card/CardBody'
import CardTitle from 'inferno-bootstrap/lib/Card/CardTitle'
import CardText from 'inferno-bootstrap/lib/Card/CardText'
import CardFooter from 'inferno-bootstrap/lib/Card/CardFooter'
import { Link } from 'inferno-router'
import Alert from 'inferno-bootstrap/lib/Alert'
import KipLinkNav from '../components/KipNav.jsx'

@inject(['adminStore']) @observer
class AdminStartPage extends Component {

  render ({adminStore}) {
    const courseAdminData = adminStore['courseAdminData']
    const lang = courseAdminData.lang === 'en' ? 0 : 1
    const courseCode = courseAdminData.courseTitleData.course_code
    const translation = i18n.messages[lang]
    const pageTitles = translation.pageTitles
    const startCards = translation.startCards

    return (
      <div key='kursinfo-container' className='kursinfo-main-page col' >
        {/* ---COURSE TITEL--- */}
        <CourseTitle key='title'
          courseTitleData={courseAdminData.courseTitleData}
          pageTitle={pageTitles.administrate}
          language={courseAdminData.lang}
        />
        <KipLinkNav courseCode={courseCode} lang={courseAdminData.lang} translate={pageTitles} />
        {this.props.location.data === 'success' ?
          <Alert color='success' aria-live='polite'>
            {pageTitles.alertMessages.success}
          </Alert>
        : ''
        }
        <div className='col'>
          {/* <span className='Header--Link'>
            <a href={`/student/kurser/kurs/${courseCode}?l=${courseAdminData.lang}`} alt={startCards.start_link_back} className='link-back'>{startCards.courseInfo_linkBack}</a>
          </span> */}
          <span className='AdminPage--ShowDescription'>
            <Card className='KursInfo--SellingText'>
              <CardBody>
                <CardTitle>{startCards.sellingText_hd}</CardTitle>
                <CardText>
                  <p>{startCards.sellingText_desc_p1}</p>
                  <p>{startCards.sellingText_desc_p2}</p>
                </CardText>
              </CardBody>
              <CardFooter className='text-right'>
                <a href={`/admin/kurser/kurs/edit/${courseCode}?l=${courseAdminData.lang}`} alt={startCards.sellingText_btn} className='btn btn-primary'>{startCards.sellingText_btn}</a>
                {/* <Link to={{ pathname: `/admin/kurser/kurs/edit/${courseCode}?l=${courseAdminData.lang}`,
                data: 'hello'
                }} className='btn btn-primary' onClick={this.doStartSellingText}>{translation.startCards.sellingText_btn}</Link> */}
                {/* <Button onClick={this.doStartSellingText} color='primary'>{translation.startCards.sellingText_btn}</Button> */}
              </CardFooter>
            </Card>
            <Card>
              <CardBody>
                <CardTitle>{startCards.coursePM_hd}</CardTitle>
                <CardText>{startCards.coursePM_desc}</CardText>
              </CardBody>
              <CardFooter className='text-right'>
                <Link to='#' className='btn btn-primary' alt={startCards.coursePM_btn}>{startCards.coursePM_btn}</Link>
              </CardFooter>
            </Card>
            <Card>
              <CardBody>
                <CardTitle>{startCards.courseDev_hd}</CardTitle>
                <CardText>
                  {startCards.courseDev_decs}
                </CardText>
              </CardBody>
              <CardFooter className='text-right'>
              {/* TODO nicer title= */}
                <a href={`/admin/kursutveckling/${courseCode}?l=${courseAdminData.lang}&title=${courseAdminData.courseTitleData.course_title}_${courseAdminData.courseTitleData.course_credits}`} className='btn btn-primary' alt={startCards.courseDev_btn}>
                  {startCards.courseDev_btn}
                </a>
              </CardFooter>
            </Card>
          </span>
        </div>
      </div>
    )
  }
}

export default AdminStartPage
