/* eslint-disable react/jsx-curly-brace-presence */
import React from 'react'
import { COURSE_INFO_URL, USER_MANUAL_URL } from '../util/constants'

const LinkToAboutCourseInformation = ({ courseCode, translate, lang, publicPagesHref }) => {
  const aboutCourseLink = `${publicPagesHref}${COURSE_INFO_URL}${courseCode}?l=${lang}`

  return (
    <div className="navigation row">
      <nav
        className="main col"
        aria-label={`${lang === 'en' ? 'Go to About course information ' : 'Gå till Om kursen SF1624 '}${courseCode}`}
        lang={lang}
      >
        <a href={aboutCourseLink} className="link-back">
          {translate.about_course}
        </a>
      </nav>
    </div>
  )
}

export const TextAboutRights = ({ lang, translate }) => (
  <div className="paragraphs introduction col">
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

export default LinkToAboutCourseInformation
