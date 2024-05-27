import React from 'react'

import { useWebContext } from '../context/WebContext'
import { EMPTY } from '../util/constants'
import PageHeading from '../components-shared/PageHeading'

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
  const { langIndex } = context
  const { courseCode } = courseTitleData

  const courseName = parseCourseName(courseTitleData, langIndex, language)
  return <PageHeading heading={pageTitle} subHeading={courseCode && courseName} />
}

export { parseCourseName }
export default PageTitle
