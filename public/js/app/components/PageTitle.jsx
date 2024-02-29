import React from 'react'
import { Alert } from 'reactstrap'

import i18n from '../../../../i18n'

import { useWebContext } from '../context/WebContext'
import { EMPTY } from '../util/constants'

const ApiError = ({ langIndex }) => (
  <Alert color="info" aria-live="polite">
    {i18n.messages[langIndex].pageTitles.alertMessages.kopps_api_down}
  </Alert>
)

function parseCourseName(title, langIndex, language) {
  const courseCode = title?.courseCode ?? title.course_code
  const courseCredits = title?.courseCredits ?? title.course_credits
  const courseTitle = title?.courseTitle ?? title.course_title
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

const PageTitle = ({ courseTitleData, pageTitle }) => {
  const [context] = useWebContext()
  const language = context.lang
  const langIndex = context.langIndex
  const courseCode = courseTitleData.courseCode ?? courseTitleData.course_code
  const { apiError } = courseTitleData

  const courseName = parseCourseName(courseTitleData, langIndex, language)
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

export { parseCourseName }
export default PageTitle
