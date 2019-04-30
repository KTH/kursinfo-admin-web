import Table from 'inferno-bootstrap/dist/Table'

const KipLinkNav = (courseCode, lang, startCards) => {
  return (
    <span>
      <Table className='kip-menu'>
        <tbody>
          <tr>
            <td colSpan='2'>
              <h4>Om kursen</h4>
              <p>
                {/* <a href={`/admin/kurser/kurs/edit/${courseCode}?l=${lang}`} alt={startCards.sellingText_btn} className='btn btn-primary'>{startCards.sellingText_btn}</a> */}
                <a href='http://localhost:3003/student/kurser/kurs/SF1626?l=sv'>Kursinformation</a>
              </p>
              <p>
                <a href='http://localhost:3000/kursutveckling/SF1626'>Kursens utveckling och historik</a>
              </p>
            </td>
            {/* <td colSpan='2' className='link-to'>
              <p><a href='http://localhost:3005/admin/kurser/kurs/SF1626?l=sv'>Administrera --></a></p>
            </td> */}
          </tr>
        </tbody>
      </Table>
    </span>
    )
}

export default KipLinkNav
