import React from 'react'
import { Alert } from 'reactstrap'

import { EMPTY } from '../util/constants'
import i18n from '../../../../i18n'

const ApiError = ({ langIndex }) => (
  <Alert color="info" aria-live="polite">
    {i18n.messages[langIndex].pageTitles.alertMessages.kopps_api_down}
  </Alert>
)

function parseCourseName(title, langIndex, language) {
  const { course_code: courseCode, course_credits: courseCredits, course_title: courseTitle } = title
  if (!courseCredits && !courseCode && !courseTitle) return ''
  if (courseCode && !courseCredits && !courseTitle) return courseCode

  const credits =
    courseCredits !== EMPTY[langIndex] && courseCredits.toString().indexOf('.') < 0
      ? courseCredits + '.0'
      : courseCredits || ''
  const creditUnit = language === 'en' ? `${credits} credits` : `${credits.toString().replace('.', ',')} hp`

  const courseName = `${courseCode} ${courseTitle} ${creditUnit}`

  return courseName
}

const PageTitle = ({ courseTitleData: title, language, pageTitle }) => {
  const langIndex = language === 'en' ? 0 : 1

  const { apiError, course_code: courseCode } = title

  const courseName = parseCourseName(title, langIndex, language)

  return (
    <header id="course-title" className="pageTitle col">
      <span id="page-course-title" role="heading" aria-level="1">
        <span className="t1">{pageTitle}</span>
        <span className="t4">{courseCode && courseName}</span>
      </span>
      {apiError && <ApiError langIndex={langIndex} />}
    </header>
  )
}

export default PageTitle
