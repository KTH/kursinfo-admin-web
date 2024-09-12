import React from 'react'
import { useSearchParams } from 'react-router-dom'
import i18n from '../../../../i18n'
import Button from '../components-shared/Button'
import PageTitle from '../components/PageTitle'
import KoppsErrorPage from '../components/KoppsErrorPage'
import { LinkToAboutCourseInformation, TextAboutRights } from '../components/LinkAndInstruction'
import AlertMsg from '../components/AlertMsg'
import AlertReminderMsg from '../components/AlertReminderMsg'
import AlertReminderMsgNewPubMemo from '../components/AlertReminderMsgNewPubMemo'
import { useWebContext } from '../context/WebContext'
import { ADMIN_COURSE_UTV, ADMIN_COURSE_PM, ADMIN_COURSE_PM_DATA, ADMIN_ABOUT_COURSE } from '../util/constants'
import { fetchParameters } from '../util/fetchUrlParams'

function AdminStartPage() {
  const [context] = useWebContext()
  const [querySearchParams] = useSearchParams()

  const { ladokData, publicHostUrl, userRoles, lang } = context
  const { courseTitleData } = ladokData
  const { courseCode } = courseTitleData
  const { isCourseResponsible, isExaminator, isKursinfoAdmin, isSuperUser, isSchoolAdmin } = userRoles
  const visibilityLevel =
    isCourseResponsible || isExaminator || isKursinfoAdmin || isSuperUser || isSchoolAdmin ? 'all' : 'onlyMemo'
  const { pageTitles, startCards } = i18n.messages[lang === 'en' ? 0 : 1]

  const publicPagesHref = publicHostUrl?.replace('.se/', '.se')

  const pageTitleProps = { courseTitleData, pageTitle: pageTitles.administrate }

  if (context.ladokApiError) {
    return <KoppsErrorPage pageTitleProps={pageTitleProps} />
  }

  return (
    <div className="kursinfo-main-page AdminStartPage">
      <LinkToAboutCourseInformation
        courseCode={courseCode}
        lang={lang}
        translate={pageTitles}
        publicPagesHref={publicPagesHref}
      />

      <PageTitle {...pageTitleProps} />

      <TextAboutRights lang={lang} translate={pageTitles} />

      <AlertMsg
        courseCode={courseCode}
        querySearchParams={fetchParameters(querySearchParams)}
        lang={lang}
        translate={pageTitles}
        publicPagesHref={publicPagesHref}
      />
      <AlertReminderMsg querySearchParams={fetchParameters(querySearchParams)} lang={lang} />
      <AlertReminderMsgNewPubMemo querySearchParams={fetchParameters(querySearchParams)} lang={lang} />

      <div className="AdminStartPage__cardContainer">
        {visibilityLevel === 'all' && (
          <>
            <div className="AdminStartPage__card">
              <h4 className="AdminStartPage__cardTitle">{startCards.sellingText_hd}</h4>
              <div className="AdminStartPage__cardBody">
                <p>{startCards.sellingText_desc_p1}</p>
                <p>{startCards.sellingText_desc_p2}</p>
              </div>
            </div>
            <div className="AdminStartPage__cardFooter">
              <Button variant="primary" href={`${ADMIN_ABOUT_COURSE}edit/${courseCode}?l=${lang}`}>
                {startCards.sellingText_btn}
              </Button>
            </div>
          </>
        )}

        <div className="AdminStartPage__card">
          <h4 className="AdminStartPage__cardTitle">{startCards.coursePM_hd}</h4>
          <div className="AdminStartPage__cardBody">
            <p>{startCards.coursePM_create_desc_p1}</p>
            <p>{startCards.coursePM_create_desc_p2}</p>
            <p>{startCards.coursePM_create_desc_p3}</p>
          </div>
        </div>
        <div className="AdminStartPage__cardFooter">
          <Button variant="primary" href={`${ADMIN_COURSE_PM_DATA}${courseCode}?l=${lang}`}>
            {startCards.coursePM_btn_new}
          </Button>
          <Button variant="primary" href={`${ADMIN_COURSE_PM_DATA}published/${courseCode}?l=${lang}`}>
            {startCards.coursePM_btn_edit}
          </Button>
          <a className="AdminStartPage__uploadMemoLink" href={`${ADMIN_COURSE_PM}${courseCode}?l=${lang}`}>
            {startCards.coursePM_link_upload_memo}
          </a>
        </div>

        {visibilityLevel === 'all' && (
          <>
            <div className="AdminStartPage__card">
              <h4 className="AdminStartPage__cardTitle">{startCards.courseDev_hd}</h4>
              <div className="AdminStartPage__cardBody">
                <p>{startCards.courseDev_decs_p1}</p>
                <p>{startCards.courseDev_decs_p2}</p>
              </div>
            </div>
            <div className="AdminStartPage__cardFooter">
              <Button
                variant="primary"
                href={`${ADMIN_COURSE_UTV}${courseCode}?l=${lang}&status=n&serv=admin&title=${courseTitleData.courseTitle}_${courseTitleData.courseCredits}`}
              >
                {startCards.courseDev_btn_new}
              </Button>
              <Button
                variant="primary"
                href={`${ADMIN_COURSE_UTV}${courseCode}?l=${lang}&status=p&serv=admin&title=${courseTitleData.courseTitle}_${courseTitleData.courseCredits}`}
              >
                {startCards.courseDev_btn_edit}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AdminStartPage
