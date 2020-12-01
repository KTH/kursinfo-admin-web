import React from 'react'
import { Provider } from 'mobx-react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import '@babel/runtime/regenerator'
import mockAdminStore from './mocks/adminStore'
import AdminStartPage from '../public/js/app/pages/AdminStartPage'

const renderEditPage = (adminStoreToUse = mockAdminStore, pageNumber) => {
  return render(
    <Provider adminStore={adminStoreToUse}>
      <AdminStartPage />
    </Provider>
  )
}

const renderWithState = (stateToSet = {}, pageNumber) => {
  const newAdminStore = Object.assign(Object.assign({}, mockAdminStore), stateToSet)
  return renderEditPage(newAdminStore, pageNumber)
}

describe('<AdminStartPage> (and subordinates)', () => {
  test('Has correct main heading', (done) => {
    const { getAllByRole } = renderEditPage()
    const allH1Headers = getAllByRole('heading', { level: 1 })
    expect(allH1Headers.length).toBe(1)
    expect(allH1Headers[0]).toHaveTextContent(
      /^Administrera Om kursenSF1624 Algebra och geometri 7,5 hp/
    )
    done()
  })

  test('Has correct h4 heading in correct order', (done) => {
    const { getAllByRole } = renderEditPage()
    const allH4Headers = getAllByRole('heading', { level: 4 })
    expect(allH4Headers.length).toBe(4)
    expect(allH4Headers[0]).toHaveTextContent(/^Om kursen/)
    expect(allH4Headers[1]).toHaveTextContent(/^Introduktion till kursen/)
    expect(allH4Headers[2]).toHaveTextContent(/^Kurs-PM/)
    expect(allH4Headers[3]).toHaveTextContent(/^Kursanalys och kursdata/)
    done()
  })

  test('Has correct buttons and links in correct order', (done) => {
    const { getAllByRole } = renderEditPage()
    const allLinks = getAllByRole('link')
    expect(allLinks.length).toBe(12)
    expect(allLinks[0]).toHaveTextContent(/^Kursinformation/)
    expect(allLinks[0].href).toBe('https://localhost/student/kurser/kurs/SF1624?l=sv')

    expect(allLinks[1]).toHaveTextContent(/^Kursens utveckling och historik/)
    expect(allLinks[1].href).toBe('https://localhost/kursutveckling/SF1624?l=sv')

    expect(allLinks[2]).toHaveTextContent(/^KOPPS/)
    expect(allLinks[2].href).toBe('https://app.kth.se/kopps/admin/courses/getAllVersions/SF1624')

    expect(allLinks[3]).toHaveTextContent(/^personal som har behörighet i KOPPS/)
    expect(allLinks[3].href).toBe('https://app.kth.se/kopps/admin/userlist')

    expect(allLinks[4]).toHaveTextContent(/^behörigheter./)
    expect(allLinks[4].href).toBe(
      'https://intra.kth.se/utbildning/utbildningsadministr/kopps/anvandarhanledning/behorigheter'
    )

    expect(allLinks[5]).toHaveTextContent(/^Information och hjälp för att administrera Om kursen/)
    expect(allLinks[5].href).toBe(
      'https://intra.kth.se/utbildning/utbildningsadministr/om-kursen/anvandarmanual-om-kursen'
    )

    expect(allLinks[6]).toHaveTextContent(/^Redigera/)
    expect(allLinks[6].href).toBe('http://localhost/kursinfoadmin/kurser/kurs/edit/SF1624?l=sv')

    expect(allLinks[7]).toHaveTextContent(/^Skapa, publicera/)
    expect(allLinks[7].href).toBe('http://localhost/kursinfoadmin/kurs-pm-data/SF1624?l=sv')

    expect(allLinks[8]).toHaveTextContent(/^Ändra publicerad/)
    expect(allLinks[8].href).toBe(
      'http://localhost/kursinfoadmin/kurs-pm-data/published/SF1624?l=sv'
    )

    expect(allLinks[9]).toHaveTextContent(/^Ladda upp alternativt kurs-PM/)
    expect(allLinks[9].href).toBe('http://localhost/kursinfoadmin/pm/SF1624?l=sv')

    expect(allLinks[10]).toHaveTextContent(/^Publicera ny/)
    expect(allLinks[10].href).toBe(
      'http://localhost/kursinfoadmin/kursutveckling/SF1624?l=sv&status=n&serv=admin&title=Algebra%20och%20geometri_7.5'
    )

    expect(allLinks[11]).toHaveTextContent(/^Ändra publicerad/)
    expect(allLinks[11].href).toBe(
      'http://localhost/kursinfoadmin/kursutveckling/SF1624?l=sv&status=p&serv=admin&title=Algebra%20och%20geometri_7.5'
    )
    done()
  })

  test('Intra kth link 1 opens in a new window', async (done) => {
    const { getAllByRole } = renderEditPage()
    const allLinks = getAllByRole('link')

    allLinks[4].click()
    await waitFor(() => {
      //stay one the same page
      const allH1Headers = getAllByRole('heading', { level: 1 })
      expect(allH1Headers.length).toBe(1)
      expect(allH1Headers[0]).toHaveTextContent(
        /^Administrera Om kursenSF1624 Algebra och geometri 7,5 hp/
      )
    })
    done()
  })
})