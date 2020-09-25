import React from 'react'
import { EMPTY } from '../util/constants'
import { Alert } from 'reactstrap'
import i18n from '../../../../i18n'

const PageTitle = ({ courseTitleData: title, language, pageTitle }) => {
  const langIndex = language === 'en' ? 0 : 1
  const {
    course_code: courseCode,
    course_credits: courseCredits,
    course_title: courseTitle
  } = title
  const credits =
    courseCredits !== EMPTY && courseCredits.toString().indexOf('.') < 0
      ? courseCredits + '.0'
      : courseCredits || ''
  const creditUnit =
    language === 'en' ? `${credits} credits` : `${credits.toString().replace('.', ',')} hp`

  const courseName = `${courseCode} ${courseTitle} ${creditUnit}`

  return (
    <header id="course-title" className="pageTitle col">
      <span id="page-course-title" role="heading" aria-level="1">
        <span className="t1">{pageTitle}</span>
        <span className="t4">{courseCode && courseName}</span>
      </span>
      {title.apiError && (
        <Alert color="info" aria-live="polite">
          {i18n.messages[langIndex].pageTitles.alertMessages.kopps_api_down}
        </Alert>
      )}
    </header>
  )
}

export default PageTitle
