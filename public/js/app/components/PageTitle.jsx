import React from 'react'

import { useWebContext } from '../context/WebContext'
import { EMPTY } from '../util/constants'

function parseCourseName(title, langIndex, language) {
  const courseCode = title?.courseCode
  const courseCredits = title?.courseCredits
  const courseTitle = title?.courseTitle
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
  const courseCode = courseTitleData.courseCode

  const courseName = parseCourseName(courseTitleData, langIndex, language)
  return (
    <header id="course-title" className="pageTitle col">
      <span id="page-course-title" role="heading" aria-level="1">
        <span className="t1">{pageTitle}</span>
        <span className="t4">{courseCode && courseName}</span>
      </span>
    </header>
  )
}

export { parseCourseName }
export default PageTitle
