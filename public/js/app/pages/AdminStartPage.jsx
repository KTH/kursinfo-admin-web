import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card, CardBody, CardLink, CardTitle, CardText, CardFooter } from 'reactstrap'
import i18n from '../../../../i18n'
import PageTitle from '../components/PageTitle'
import LinkToAboutCourseInformation, { TextAboutRights } from '../components/LinkAndInstruction'
import AlertMsg from '../components/AlertMsg'
import AlertMemoMsg from '../components/AlertMemoMsg'
import AlertReminderMsg from '../components/AlertReminderMsg'
import { useWebContext } from '../context/WebContext'
import { ADMIN_COURSE_UTV, ADMIN_COURSE_PM, ADMIN_COURSE_PM_DATA, ADMIN_OM_COURSE } from '../util/constants'
import { fetchParameters } from '../util/fetchUrlParams'

function resolvePublicPagesHref() {
  if (typeof window === 'undefined') return ''
  // kursinfoadmin is on app.kth.se but student is www.kth.se
  const { href: thisPagesUrl } = window.location
  const hasAppInHref = thisPagesUrl.includes('app')
  const [, , thisHost] = thisPagesUrl.split('/')
  const publicPagesHref = hasAppInHref ? `https://${thisHost.replace('app', 'www')}` : ''
  return publicPagesHref
}

function AdminStartPage() {
  const [context] = useWebContext()
  const [querySearchParams] = useSearchParams()
  // console.log('searchParams', searchParams)
  // const querySearchParams = [...searchParams]

  const { koppsData, userRoles } = context
  const { courseTitleData, lang } = koppsData
  const { course_code: courseCode } = courseTitleData
  const { isCourseResponsible, isExaminator, isSuperUser } = userRoles
  const visibilityLevel = isCourseResponsible || isExaminator || isSuperUser ? 'all' : 'onlyMemo'
  const { pageTitles, startCards } = i18n.messages[lang === 'en' ? 0 : 1]

  const publicPagesHref = resolvePublicPagesHref()

  return (
    <div key="kursinfo-container" className="kursinfo-main-page start-page col">
      <LinkToAboutCourseInformation
        courseCode={courseCode}
        lang={lang}
        translate={pageTitles}
        publicPagesHref={publicPagesHref}
      />

      {/* ---COURSE TITEL--- */}
      <PageTitle key="title" courseTitleData={courseTitleData} pageTitle={pageTitles.administrate} language={lang} />

      <TextAboutRights lang={lang} translate={pageTitles} />

      <div className="AdminPage--Alert">
        <AlertMsg
          courseCode={courseCode}
          querySearchParams={fetchParameters(querySearchParams)}
          lang={lang}
          translate={pageTitles}
          publicPagesHref={publicPagesHref}
        />
      </div>
      <div className="AdminPage--Alert">
        <AlertReminderMsg querySearchParams={querySearchParams} lang={lang} />
      </div>
      <div className="AdminPage--Alert">
        <AlertMemoMsg querySearchParams={querySearchParams} lang={lang} translate={pageTitles} />
      </div>
      <div className="col">
        <span className="AdminPage--ShowDescription">
          {visibilityLevel === 'all' && (
            <Card className="KursInfo--SellingText">
              <CardBody>
                <CardTitle>
                  <h4>{startCards.sellingText_hd}</h4>
                </CardTitle>
                <CardText tag="span">
                  <p>{startCards.sellingText_desc_p1}</p>
                  <p>{startCards.sellingText_desc_p2}</p>
                </CardText>
              </CardBody>
              <CardFooter className="text-right">
                <a
                  href={`${ADMIN_OM_COURSE}edit/${courseCode}?l=${lang}`}
                  aria-label={startCards.sellingText_btn}
                  className="btn btn-primary"
                >
                  {startCards.sellingText_btn}
                </a>
              </CardFooter>
            </Card>
          )}
          <Card className="Skapa--Kurs-PM">
            <CardBody>
              <CardTitle>
                <h4>{startCards.coursePM_hd}</h4>
              </CardTitle>
              <CardText tag="span">
                <p>{startCards.coursePM_create_desc_p1}</p>
                <p>{startCards.coursePM_create_desc_p2}</p>
                <p>{startCards.coursePM_create_desc_p3}</p>
              </CardText>
            </CardBody>
            <CardFooter className="text-right">
              <span>
                <CardLink
                  href={`${ADMIN_COURSE_PM_DATA}${courseCode}?l=${lang}`}
                  className="btn btn-primary"
                  aria-label={startCards.coursePM_btn_new}
                >
                  {startCards.coursePM_btn_new}
                </CardLink>
                <CardLink
                  href={`${ADMIN_COURSE_PM_DATA}published/${courseCode}?l=${lang}`}
                  className="btn btn-primary"
                  aria-label={startCards.coursePM_btn_edit}
                >
                  {startCards.coursePM_btn_edit}
                </CardLink>
              </span>
              <span>
                <CardLink href={`${ADMIN_COURSE_PM}${courseCode}?l=${lang}`}>
                  {startCards.coursePM_link_upload_memo}
                </CardLink>
              </span>
            </CardFooter>
          </Card>
          {visibilityLevel === 'all' && (
            <Card className="course-development">
              <CardBody>
                <CardTitle>
                  <h4>{startCards.courseDev_hd}</h4>
                </CardTitle>
                <CardText tag="span">
                  <p>{startCards.courseDev_decs_p1}</p>
                  <p>{startCards.courseDev_decs_p2}</p>
                </CardText>
              </CardBody>
              <CardFooter className="text-right">
                <a
                  href={`${ADMIN_COURSE_UTV}${courseCode}?l=${lang}&status=n&serv=admin&title=${courseTitleData.course_title}_${courseTitleData.course_credits}`}
                  className="btn btn-primary"
                  aria-label={startCards.courseDev_btn_new}
                >
                  {startCards.courseDev_btn_new}
                </a>
                <a
                  href={`${ADMIN_COURSE_UTV}${courseCode}?l=${lang}&status=p&serv=admin&title=${courseTitleData.course_title}_${courseTitleData.course_credits}`}
                  className="btn btn-primary"
                  aria-label={startCards.courseDev_btn_edit}
                >
                  {startCards.courseDev_btn_edit}
                </a>
              </CardFooter>
            </Card>
          )}
        </span>
      </div>
    </div>
  )
}

export default AdminStartPage
