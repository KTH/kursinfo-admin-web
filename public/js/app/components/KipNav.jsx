import Table from 'inferno-bootstrap/dist/Table'

const KipLinkNav = ({courseCode, translate, lang}) => { // courseCode, lang, startCards
  const kursOmLink = `/student/kurser/kurs/${courseCode}?l=${lang}`
  const kutvLink = `/kursutveckling/${courseCode}?l=${lang}`
  return (
    <span className='intro row'>
      <Table className='kip-menu'>
        <tbody>
          <tr>
            <td colSpan='2'>
              <h4>{translate.about_course}</h4>
              <p>
                {/* <a href={`/admin/kurser/kurs/edit/${courseCode}?l=${lang}`} alt={startCards.sellingText_btn} className='btn btn-primary'>{startCards.sellingText_btn}</a> */}
                <a className='link-back' href={kursOmLink} alt='Tillbaka till Kursinformation vy'>{translate.course_info_title}</a>
              </p>
              <p>
                <a className='link-back' href={kutvLink} alt='Tillbaka till Kursens utveckling och historik vy'>{translate.course_dev_title}</a>
              </p>
            </td>
            <td className='admin-link'>
              <p>
                <h4>{translate.course_admin_title}</h4>
              </p>
            </td>
          </tr>
        </tbody>
      </Table>
      <span className='right_intro col'>
      <p>Här kan du som kursansvarig eller examinator för kursen administrera en del av den
      information som du kan se på sidorna <a href={kursOmLink}>{translate.course_info_title}</a> och <a href={kutvLink}>{translate.course_dev_title}</a> som
      ”introduktion till kursen”, ”kurs-PM” och ”kursanalys och kursdata”.
      Viss information som inte kan ändras här hämtas från Kopps och Ladok….
      </p>
      <p>
        <a href='#'>Information och hjälp för att administrera Om-kursen </a>
      </p>
      </span>
    </span>
    )
}

export default KipLinkNav
