import React from 'react'
import { fireEvent, render } from '@testing-library/react'
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

const ONLY_TEACHER = {
  userRoles: {
    isCourseResponsible: false,
    isSuperUser: false,
    isExaminator: false,
    isTeacher: true,
  },
}

const ONLY_RESPONSIBLE = {
  userRoles: {
    isCourseResponsible: true,
    isSuperUser: false,
    isExaminator: false,
    isTeacher: false,
  },
}

const ONLY_EXAMINATOR = {
  userRoles: {
    isCourseResponsible: false,
    isSuperUser: false,
    isExaminator: true,
    isTeacher: false,
  },
}

const ONLY_SUPERUSER = {
  userRoles: {
    isCourseResponsible: false,
    isSuperUser: true,
    isExaminator: false,
    isTeacher: false,
  },
}

const TEACHER_AND_SUPERUSER = {
  userRoles: {
    isCourseResponsible: false,
    isSuperUser: true,
    isExaminator: false,
    isTeacher: true,
  },
}

const TEACHER_AND_EXAMINATOR = {
  userRoles: {
    isCourseResponsible: false,
    isSuperUser: false,
    isExaminator: true,
    isTeacher: true,
  },
}

const TEACHER_AND_RESPONSIBLE = {
  userRoles: {
    isCourseResponsible: true,
    isSuperUser: false,
    isExaminator: false,
    isTeacher: true,
  },
}

const renderEditPage = (newWebContext = {}, pageNumber) => {
  return render(
    <WebContextProvider
      configIn={{
        ...mockWebContext,
        ...newWebContext,
      }}
    >
      <AdminStartPage />
    </WebContextProvider>
  )
}

// const renderEditPage = (stateToSet = {}) => {
//   useWebContext.mockReturnValue({...mockWebContext[0], ...mockWebContext[0])

//   // const newAdminStore = Object.assign(Object.assign({}, mockWebContext), stateToSet)
//   return renderEditPage()
// }

describe('User roles for this course <AdminStartPage>', () => {
  beforeAll(() => mockClientFunctionsToWebContext())

  afterAll(() => {
    jest.clearAllMocks()
  })
  test('User: only teacher. Show only course memo card.', done => {
    const { getAllByRole } = renderEditPage(ONLY_TEACHER)
    const allH4Headers = getAllByRole('heading', { level: 4 })
    expect(allH4Headers.length).toBe(1)
    expect(allH4Headers[0]).toHaveTextContent(/^Kurs-PM/)
    done()
  })

  test('User: only responsible. Show all cards: course memo, course description and course analysis', done => {
    const { getAllByRole } = renderEditPage(ONLY_RESPONSIBLE)
    const allH4Headers = getAllByRole('heading', { level: 4 })
    expect(allH4Headers.length).toBe(3)
    expect(allH4Headers[0]).toHaveTextContent(/^Sidan Inför kursval/)
    expect(allH4Headers[1]).toHaveTextContent(/^Kurs-PM/)
    expect(allH4Headers[2]).toHaveTextContent(/^Kursanalys och kursdata/)
    done()
  })

  test('User: only examinator. Show all cards: course memo, course description and course analysis', done => {
    const { getAllByRole } = renderEditPage(ONLY_EXAMINATOR)
    const allH4Headers = getAllByRole('heading', { level: 4 })
    expect(allH4Headers.length).toBe(3)
    expect(allH4Headers[0]).toHaveTextContent(/^Sidan Inför kursval/)
    expect(allH4Headers[1]).toHaveTextContent(/^Kurs-PM/)
    expect(allH4Headers[2]).toHaveTextContent(/^Kursanalys och kursdata/)
    done()
  })

  test('User: only superuser. Show all cards: course memo, course description and course analysis', done => {
    const { getAllByRole } = renderEditPage(ONLY_SUPERUSER)
    const allH4Headers = getAllByRole('heading', { level: 4 })
    expect(allH4Headers.length).toBe(3)
    expect(allH4Headers[0]).toHaveTextContent(/^Sidan Inför kursval/)
    expect(allH4Headers[1]).toHaveTextContent(/^Kurs-PM/)
    expect(allH4Headers[2]).toHaveTextContent(/^Kursanalys och kursdata/)
    done()
  })

  test('User has two roles: teacher and superuser. Show all cards: course memo, course description and course analysis', done => {
    const { getAllByRole } = renderEditPage(TEACHER_AND_SUPERUSER)
    const allH4Headers = getAllByRole('heading', { level: 4 })
    expect(allH4Headers.length).toBe(3)
    expect(allH4Headers[0]).toHaveTextContent(/^Sidan Inför kursval/)
    expect(allH4Headers[1]).toHaveTextContent(/^Kurs-PM/)
    expect(allH4Headers[2]).toHaveTextContent(/^Kursanalys och kursdata/)
    done()
  })

  test('User has two roles: teacher and examinator. Show all cards: course memo, course description and course analysis', done => {
    const { getAllByRole } = renderEditPage(TEACHER_AND_EXAMINATOR)
    const allH4Headers = getAllByRole('heading', { level: 4 })
    expect(allH4Headers.length).toBe(3)
    expect(allH4Headers[0]).toHaveTextContent(/^Sidan Inför kursval/)
    expect(allH4Headers[1]).toHaveTextContent(/^Kurs-PM/)
    expect(allH4Headers[2]).toHaveTextContent(/^Kursanalys och kursdata/)
    done()
  })

  test('User has two roles: teacher and resonsible. Show all cards: course memo, course description and course analysis', done => {
    const { getAllByRole } = renderEditPage(TEACHER_AND_RESPONSIBLE)
    const allH4Headers = getAllByRole('heading', { level: 4 })
    expect(allH4Headers.length).toBe(3)
    expect(allH4Headers[0]).toHaveTextContent(/^Sidan Inför kursval/)
    expect(allH4Headers[1]).toHaveTextContent(/^Kurs-PM/)
    expect(allH4Headers[2]).toHaveTextContent(/^Kursanalys och kursdata/)
    done()
  })
})
