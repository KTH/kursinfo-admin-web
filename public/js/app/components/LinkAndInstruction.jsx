import React from 'react'
import { COURSE_INFO_URL, USER_MANUAL_URL } from '../util/constants'

export const LinkToAboutCourseInformation = ({ courseCode, translate, lang, publicPagesHref }) => {
  const aboutCourseLink = `${publicPagesHref}${COURSE_INFO_URL}${courseCode}?l=${lang}`

  return (
    <nav>
      <a href={aboutCourseLink} className="kth-button back">
        {translate.about_course}
      </a>
    </nav>
  )
}

export const TextAboutRights = ({ lang, translate }) => (
  <div className="introduction">
    <p>{translate.instruction_p1}</p>
    <p>{translate.instruction_p2}</p>
    <p>
      {`${translate.instruction_p3_start} `}
      <a lang={lang} href={USER_MANUAL_URL[lang]}>
        {translate.instruction_p3_link_label}
      </a>
      {`${translate.instruction_p3_conclusion}`}
    </p>
  </div>
)
