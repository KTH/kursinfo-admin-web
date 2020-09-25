import React from 'react'
import { Table } from 'reactstrap'
import {
  COURSE_INFO_URL,
  COURSE_UTVECKLING,
  USER_MANUAL_URL,
  KOPPS_ADMIN_URL,
  KOPPS_ADMIN_USERLIST_URL,
  KOPPS_ABOUT_URL
} from '../util/constants'

const KipLinkNav = ({ courseCode, translate, lang }) => {
  // courseCode, lang, startCards
  const kursOmLink = `${COURSE_INFO_URL}${courseCode}?l=${lang}` // TODO https://www.kth.se hardkoded because of kursinfoadmin is on app.kth.se but student is www.kth.se
  const kutvLink = `${COURSE_UTVECKLING}${courseCode}?l=${lang}`
  const { links_to: linksToLabel } = translate
  return (
    <span className="navigation row">
      <Table className="kip-menu">
        <tbody>
          <tr>
            <td colSpan="2">
              <h4>{translate.about_course}</h4>
              <p>
                <a className="link-back" href={kursOmLink} alt={linksToLabel.kinfo.aAlt}>
                  {linksToLabel.kinfo.aTitle}
                </a>
              </p>
              <p>
                <a className="link-back" href={kutvLink} alt={linksToLabel.kutv.aAlt}>
                  {linksToLabel.kutv.aTitle}
                </a>
              </p>
            </td>
            <td className="admin-link">
              <p>{translate.course_admin_title}</p>
            </td>
          </tr>
        </tbody>
      </Table>
      <span className="right_intro col">
        <p>{translate.instruction_1}</p>
        <p>
          {translate.instruction_kopps_1}
          <a href={`${KOPPS_ADMIN_URL}${courseCode}`} alt={translate.instruction_kopps_alt}>
            KOPPS{' '}
          </a>
          {translate.instruction_kopps_2}
          <a href={KOPPS_ADMIN_USERLIST_URL} alt={translate.instruction_kopps_alt}>
            {translate.instruction_kopps_3_link}
          </a>
          {translate.instruction_kopps_4}
          <a href={KOPPS_ABOUT_URL} alt={translate.instruction_kopps_alt}>
            {translate.instruction_kopps_5_link}
          </a>
        </p>
        <p>
          <a href={USER_MANUAL_URL} alt={translate.link_user_manual}>
            {translate.link_user_manual}
          </a>
        </p>
      </span>
    </span>
  )
}

export default KipLinkNav
