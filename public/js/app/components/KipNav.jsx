import Table from 'inferno-bootstrap/dist/Table'
import {COURSE_INFO_URL, COURSE_UTVECKLING,
  USER_MANUAL_URL, KOPPS_ADMIN_URL, KOPPS_ADMIN_USERLIST_URL, KOPPS_ABOUT_URL} from '../util/constants'

const KipLinkNav = ({courseCode, translate, lang, isProd}) => { // courseCode, lang, startCards
  const kursOmLink = `https://www.kth.se${COURSE_INFO_URL}${courseCode}?l=${lang}` // hardkoded because of admin is on app.kth.se but student is www.kth.se
  const kutvLink = `${COURSE_UTVECKLING}${courseCode}?l=${lang}`
  return (
    <span className='navigation row'>
     {isProd
        ? <span className='Header--Link'>
          <a href={kursOmLink} alt={translate.start_link_back} className='link-back'>{translate.course_info_title}</a>
        </span>
        : <Table className='kip-menu'>
          <tbody>
            <tr>
              <td colSpan='2'>
                <h4>{translate.about_course}</h4>
                <p>
                  <a className='link-back' href={kursOmLink} alt='Tillbaka till Kursinformation vy'>{translate.course_info_title}</a>
                </p>
                <p>
                  <a className='link-back' href={kutvLink} alt='Tillbaka till Kursens utveckling och historik vy'>{translate.course_dev_title}</a>
                </p>
              </td>
              <td className='admin-link'>
                <p>
                  {translate.course_admin_title}
                </p>
              </td>
            </tr>
          </tbody>
        </Table>
      }
      <span className='right_intro col'>
        <p>{translate.instruction_1}</p>
        <p>{translate.instruction_kopps_1}
          <a href={`${KOPPS_ADMIN_URL}${courseCode}`} alt={translate.instruction_kopps_alt}>KOPPS </a>
          {translate.instruction_kopps_2}
          <a href={KOPPS_ADMIN_USERLIST_URL} alt={translate.instruction_kopps_alt}>{translate.instruction_kopps_3_link}</a>
          {translate.instruction_kopps_4}
          <a href={KOPPS_ABOUT_URL} alt={translate.instruction_kopps_alt}>{translate.instruction_kopps_5_link}</a>
        </p>
        {/* <p>Här kan du som kursansvarig eller examinator för kursen administrera en del av den
        information som du kan se på sidorna <a href={kursOmLink}>{translate.course_info_title}</a> och <a href={kutvLink}>{translate.course_dev_title}</a> som
        ”introduktion till kursen”, ”kurs-PM” och ”kursanalys och kursdata”.
        Viss information som inte kan ändras här hämtas från Kopps och Ladok….
        </p> */}
        <p>
          <a href={USER_MANUAL_URL} alt={translate.link_user_manual}>{translate.link_user_manual}</a>
        </p>
      </span>
    </span>
    )
}

export default KipLinkNav
