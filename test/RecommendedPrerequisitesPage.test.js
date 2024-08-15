import React from 'react'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import { WebContextProvider } from '../public/js/app/context/WebContext'
import RecommendedPrerequisitesPage from '../public/js/app/pages/RecommendedPrerequisitesPage'
// import mockWebContext from './mocks/mockWebContext'
import { mockClientFunctionsToWebContext } from './mocks/mockClientFunctionsToWebContext'

jest.mock('../public/js/app/client-context/addClientFunctionsToWebContext')

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
  useSearchParams: () => [null],
}))

const mockWebContext = {
  koppsData: {
    koppsText: {
      sv: 'Algebra och geometri',
      en: 'Ingen information tillagd',
    },
    mainSubject: 'Matematik',
    courseTitleData: {
      courseCode: 'SF1624',
      courseTitle: 'Algebra och geometri',
      courseCredits: 7.5,
      apiError: false,
    },
    lang: 'sv',
    langIndex: 1,
  },
  browserConfig: {
    storageUri: '',
  },
  sellingText: {
    sv: 'Svensk säljande text',
    en: 'English selling text',
  },
  paths: {
    storage: {
      saveImage: {
        method: 'post',
        uri: '/kursinfoadmin/kurser/kurs/storage/saveImage/:courseCode/:published',
      },
    },
  },
  hostUrl: 'https://app.kth.se/',
  publicHostUrl: 'https://www.kth.se/',
  isStandardImageChosen: true,
  userRoles: {
    isCourseResponsible: true,
    isSuperUser: false,
    isExaminator: false,
    isTeacher: false,
  },
  langIndex: 1,
  routeData: {
    values: '',
    courseData: '',
  },
}

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
    expect(allH1Headers[0]).toHaveTextContent(
      /^Rekommenderade förkunskaper/,
      '\n',
      /^SF1624 Algebra och geometri 7,5 hp/
    )
    done()
  })
  test('Has correct second heading', done => {
    const { getAllByRole } = renderPage()
    const allH1Headers = getAllByRole('heading', { level: 2 })
    expect(allH1Headers.length).toBe(1)
    expect(allH1Headers[0]).toHaveTextContent(/^Redigera text/, '\n', /^Granska och publicera/)
    done()
  })
})
