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
  test('Has correct main heading', done => {
    const { getAllByRole } = renderEditPage()
    const allH1Headers = getAllByRole('heading', { level: 1 })
    expect(allH1Headers.length).toBe(1)
    expect(allH1Headers[0]).toHaveTextContent(/^Administrera Om kursenSF1624 Algebra och geometri 7,5 hp/)
    done()
  })

  test('Has correct h4 heading in correct order', done => {
    const { getAllByRole } = renderEditPage()
    const allH4Headers = getAllByRole('heading', { level: 4 })
    expect(allH4Headers.length).toBe(3)
    expect(allH4Headers[0]).toHaveTextContent(/^Introduktion till kursen/)
    expect(allH4Headers[1]).toHaveTextContent(/^Kurs-PM/)
    expect(allH4Headers[2]).toHaveTextContent(/^Kursanalys och kursdata/)
    done()
  })

  test('Has correct buttons and links in correct order', done => {
    const { getAllByRole } = renderEditPage()
    const allLinks = getAllByRole('link')
    expect(allLinks.length).toBe(9)
    expect(allLinks[0]).toHaveTextContent(/^Om kursen/)
    expect(allLinks[0].href).toBe('https://localhost/student/kurser/kurs/SF1624?l=sv')

    expect(allLinks[1]).toHaveTextContent(/^användare i KOPPS/)
    expect(allLinks[1].href).toBe('https://intra.kth.se/utbildning/utbildningsadministr/kopps/behorighet')

    expect(allLinks[2]).toHaveTextContent(/^Om kursen/)
    expect(allLinks[2].href).toBe('https://intra.kth.se/utbildning/utbildningsadministr/om-kursen/om-kursen-1.1020344')

    expect(allLinks[3]).toHaveTextContent(/^Redigera/)
    expect(allLinks[3].href).toBe('http://localhost/kursinfoadmin/kurser/kurs/edit/SF1624?l=sv')

    expect(allLinks[4]).toHaveTextContent(/^Skapa, publicera/)
    expect(allLinks[4].href).toBe('http://localhost/kursinfoadmin/kurs-pm-data/SF1624?l=sv')

    expect(allLinks[5]).toHaveTextContent(/^Ändra publicerad/)
    expect(allLinks[5].href).toBe('http://localhost/kursinfoadmin/kurs-pm-data/published/SF1624?l=sv')

    expect(allLinks[6]).toHaveTextContent(/^Ladda upp alternativt kurs-PM/)
    expect(allLinks[6].href).toBe('http://localhost/kursinfoadmin/pm/SF1624?l=sv')

    expect(allLinks[7]).toHaveTextContent(/^Publicera ny/)
    expect(allLinks[7].href).toBe(
      'http://localhost/kursinfoadmin/kursutveckling/SF1624?l=sv&status=n&serv=admin&title=Algebra%20och%20geometri_7.5'
    )

    expect(allLinks[8]).toHaveTextContent(/^Ändra publicerad/)
    expect(allLinks[8].href).toBe(
      'http://localhost/kursinfoadmin/kursutveckling/SF1624?l=sv&status=p&serv=admin&title=Algebra%20och%20geometri_7.5'
    )
    done()
  })

  test('Intra kth link 1 opens in a new window', async () => {
    const { getAllByRole } = renderEditPage()
    const allLinks = getAllByRole('link')

    allLinks[4].click()
    await waitFor(() => {
      //stay one the same page
      const allH1Headers = getAllByRole('heading', { level: 1 })
      expect(allH1Headers.length).toBe(1)
      expect(allH1Headers[0]).toHaveTextContent(/^Administrera Om kursenSF1624 Algebra och geometri 7,5 hp/)
    })
  })
})
