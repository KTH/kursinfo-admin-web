import React from 'react'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import { WebContextProvider } from '../public/js/app/context/WebContext'
import RecommendedPrerequisitesPage from '../public/js/app/pages/RecommendedPrerequisitesPage'
import mockWebContext from './mocks/mockWebContext'
import { mockClientFunctionsToWebContext } from './mocks/mockClientFunctionsToWebContext'

jest.mock('../public/js/app/client-context/addClientFunctionsToWebContext')

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
  useSearchParams: () => [null],
}))

const renderPage = () =>
  render(
    <WebContextProvider
      configIn={{
        ...mockWebContext,
      }}
    >
      <RecommendedPrerequisitesPage />
    </WebContextProvider>
  )

describe('Recommended prerequisites page', () => {
  beforeAll(() => mockClientFunctionsToWebContext())

  afterAll(() => {
    jest.clearAllMocks()
  })
  test('Has correct main heading', done => {
    const { getAllByRole } = renderPage()
    const allH1Headers = getAllByRole('heading', { level: 1 })
    expect(allH1Headers.length).toBe(1)
    expect(allH1Headers[0]).toHaveTextContent(/^Rekommenderade förkunskaper/)
    // expect(allH1Headers[0]).toHaveTextContent(/^Rekommenderade förkunskaper SF1624 Algebra och geometri 7,5 hp/)
    done()
  })
  test('Has correct second heading', done => {
    const { getAllByRole } = renderPage()
    const allH1Headers = getAllByRole('heading', { level: 2 })
    expect(allH1Headers.length).toBe(1)
    expect(allH1Headers[0]).toHaveTextContent(/^Redigera text/)
    done()
  })
  test('Preview button exists', done => {
    const { getByText } = renderPage()
    expect(getByText('Granska')).toBeInTheDocument()
    done()
  })
  test('Cancel button exists', done => {
    const { getByText } = renderPage()
    expect(getByText('Avbryt')).toBeInTheDocument()
    done()
  })
})
