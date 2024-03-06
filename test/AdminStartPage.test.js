import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import '@babel/runtime/regenerator'
import mockWebContext from './mocks/mockWebContext'
import { mockClientFunctionsToWebContext } from './mocks/mockClientFunctionsToWebContext'

import AdminStartPage from '../public/js/app/pages/AdminStartPage'
import { WebContextProvider } from '../public/js/app/context/WebContext'

jest.mock('../public/js/app/client-context/addClientFunctionsToWebContext')

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
  useSearchParams: () => [null],
}))

const renderEditPage = () => {
  return render(
    <WebContextProvider
      configIn={{
        ...mockWebContext,
      }}
    >
      <AdminStartPage />
    </WebContextProvider>
  )
}

describe('<AdminStartPage> (and subordinates)', () => {
  beforeAll(() => mockClientFunctionsToWebContext())

  afterAll(() => {
    jest.clearAllMocks()
  })
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
    expect(allH4Headers[0]).toHaveTextContent(/^Sidan inför kursval/)
    expect(allH4Headers[1]).toHaveTextContent(/^Kurs-PM/)
    expect(allH4Headers[2]).toHaveTextContent(/^Kursanalys och kursdata/)
    done()
  })

  test('Has correct buttons and links in correct order', done => {
    const { getAllByRole } = renderEditPage()
    const allLinks = getAllByRole('link')
    expect(allLinks.length).toBe(8)
    expect(allLinks[0]).toHaveTextContent(/^Om kursen/)
    expect(allLinks[0].href).toBe('https://www.kth.se/student/kurser/kurs/SF1624?l=sv')

    expect(allLinks[1]).toHaveTextContent(
      /^Instruktioner och information om behörighet för Om kursen hittar du på intranätet/
    )
    expect(allLinks[1].href).toBe('https://intra.kth.se/utbildning/systemstod/om-kursen/om-kursen-1.1020344')

    expect(allLinks[2]).toHaveTextContent(/^Redigera/)
    expect(allLinks[2].href).toBe('http://localhost/kursinfoadmin/kurser/kurs/edit/SF1624?l=sv')

    expect(allLinks[3]).toHaveTextContent(/^Skapa, publicera/)
    expect(allLinks[3].href).toBe('http://localhost/kursinfoadmin/kurs-pm-data/SF1624?l=sv')

    expect(allLinks[4]).toHaveTextContent(/^Ändra publicerad/)
    expect(allLinks[4].href).toBe('http://localhost/kursinfoadmin/kurs-pm-data/published/SF1624?l=sv')

    expect(allLinks[5]).toHaveTextContent(/^Ladda upp kurs-PM som PDF/)
    expect(allLinks[5].href).toBe('http://localhost/kursinfoadmin/pm/SF1624?l=sv')

    expect(allLinks[6]).toHaveTextContent(/^Publicera ny/)
    expect(allLinks[6].href).toBe(
      'http://localhost/kursinfoadmin/kursutveckling/SF1624?l=sv&status=n&serv=admin&title=Algebra%20och%20geometri_7.5'
    )

    expect(allLinks[7]).toHaveTextContent(/^Ändra publicerad/)
    expect(allLinks[7].href).toBe(
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
