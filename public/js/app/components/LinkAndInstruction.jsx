/* eslint-disable react/jsx-curly-brace-presence */
import React from 'react'
import {
  COURSE_INFO_URL,
  USER_MANUAL_URL,
  KOPPS_ADMIN_URL,
  KOPPS_ACCESS_RIGHTS_INFO
} from '../util/constants'

const LinkToAboutCourseInformation = ({ courseCode, translate, lang }) => {
  //kursinfoadmin is on app.kth.se but student is www.kth.se
  const hostUrl = `https://${window.location.href.replace('app', 'www').split('/')[2]}`
  const aboutCourseLink = `${hostUrl}${COURSE_INFO_URL}${courseCode}?l=${lang}`

  return (
    <div className="navigation row">
      <nav
        className="main col"
        aria-label={`${
          lang === 'en' ? 'Go to About course information ' : 'Gå till Om kursen SF1624 '
        }${courseCode}`}
        lang={lang}
      >
        <a href={aboutCourseLink} className="link-back">
          {translate.about_course}
        </a>
      </nav>
    </div>
  )
}

export const TextAboutRights = ({ courseCode, translate }) => (
  <div className="introduction col">
    <p>
      {translate.instruction_kopps_1}
      <a href={`${KOPPS_ADMIN_URL}${courseCode}`} alt={translate.instruction_kopps_alt}>
        {'KOPPS '}
      </a>
      {translate.instruction_kopps_2}
      <a lang="sv" href={KOPPS_ACCESS_RIGHTS_INFO}>
        {translate.instruction_kopps_3_link_access_rights}
      </a>
      {'.'}
    </p>
    <p>
      <a lang="sv" href={USER_MANUAL_URL}>
        {translate.link_user_manual}
      </a>
    </p>
  </div>
)

export default LinkToAboutCourseInformation
