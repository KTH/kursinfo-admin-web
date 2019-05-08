import Table from 'inferno-bootstrap/dist/Table'

const KipLinkNav = ({courseCode, trans, lang}) => { // courseCode, lang, startCards
  const kursOmLink = `/student/kurser/kurs/${courseCode}?l=${lang}`
  const kutvLink = `/kursutveckling/${courseCode}?l=${lang}`
  return (
    <span>
      <Table className='kip-menu'>
        <tbody>
          <tr>
            <td colSpan='2'>
              <h4>Om kursen</h4>
              <p>
                {/* <a href={`/admin/kurser/kurs/edit/${courseCode}?l=${lang}`} alt={startCards.sellingText_btn} className='btn btn-primary'>{startCards.sellingText_btn}</a> */}
                <a className='link-back' href={kursOmLink} alt='Tillbaka till Kursinformation vy'>Kursinformation</a>
              </p>
              <p>
                <a className='link-back' href={kutvLink} alt='Tillbaka till Kursens utveckling och historik vy'>Kursens utveckling och historik</a>
              </p>
              <p>
                <b>Administrera</b>
              </p>
            </td>
          </tr>
        </tbody>
      </Table>
    </span>
    )
}

export default KipLinkNav
