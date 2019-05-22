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

import {ADMIN_OM_COURSE, ADMIN_COURSE_UTV, BETA_MORE_INFO_URL, COURSE_INFO_URL} from '../util/constants'

@inject(['adminStore']) @observer
class AdminStartPage extends Component {

  render ({adminStore}) {
    const courseAdminData = adminStore['courseAdminData']
    const lang = courseAdminData.lang === 'en' ? 0 : 1
    const courseCode = courseAdminData.courseTitleData.course_code
    const translation = i18n.messages[lang]
    const pageTitles = translation.pageTitles
    const startCards = translation.startCards
    const isProd = true// process.env['NODE_ENV'] === 'production'

    return (
      <div key='kursinfo-container' className='kursinfo-main-page col' >
        {/* ---COURSE TITEL--- */}
        <CourseTitle key='title'
          courseTitleData={courseAdminData.courseTitleData}
          pageTitle={pageTitles.administrate}
          language={courseAdminData.lang}
        />
        <KipLinkNav isProd={isProd} courseCode={courseCode} lang={courseAdminData.lang} translate={pageTitles} />
        {this.props.location.data === 'success'
        ? <Alert color='success' aria-live='polite'>
            {pageTitles.alertMessages.success}
            <a href={`${COURSE_INFO_URL}${courseCode}?l=${courseAdminData.lang}`} alt={pageTitles.start_link_back}>{pageTitles.course_info_title}</a>
        </Alert>
        : ''
        }
        <div className='col'>
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
                <a href={`${ADMIN_OM_COURSE}edit/${courseCode}?l=${courseAdminData.lang}`} alt={startCards.sellingText_btn} className='btn btn-primary'>{startCards.sellingText_btn}</a>
              </CardFooter>
            </Card>
            <Card>
              <CardBody>
                <CardTitle>{startCards.coursePM_hd}</CardTitle>
                <CardText>
                {isProd
                  ? <span>
                    <p>{startCards.beta_coursePm}</p>
                    <p><a href={BETA_MORE_INFO_URL}>{startCards.beta_more_link}</a></p>
                  </span>
                  : startCards.coursePM_desc
                }
                </CardText>
              </CardBody>
              <CardFooter className='text-right'>
              {isProd
                  ? ''
                  : <Link to='#' className='btn btn-primary' alt={startCards.coursePM_btn}>{startCards.coursePM_btn}</Link>
              }
              </CardFooter>
            </Card>
            <Card>
              <CardBody>
                <CardTitle>{startCards.courseDev_hd}</CardTitle>
                <CardText>
                {isProd
                  ? <span>
                    <p>{startCards.beta_courseDev}</p>
                    <p>
                      <a href={BETA_MORE_INFO_URL} alt={startCards.beta_more_link}>{startCards.beta_more_link}</a>
                    </p>
                  </span>
                  : <p>{startCards.courseDev_decs}</p>
                }
                </CardText>
              </CardBody>
              <CardFooter className='text-right'>
              {isProd
                ? ''
                : <a href={`${ADMIN_COURSE_UTV}${courseCode}?l=${courseAdminData.lang}&title=${courseAdminData.courseTitleData.course_title}_${courseAdminData.courseTitleData.course_credits}`} className='btn btn-primary' alt={startCards.courseDev_btn}>
                  {startCards.courseDev_btn}
                </a>
              }
              </CardFooter>
            </Card>
          </span>
        </div>
      </div>
    )
  }
}

export default AdminStartPage
