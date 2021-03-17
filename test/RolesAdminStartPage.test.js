import React from 'react'
import { Provider } from 'mobx-react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import '@babel/runtime/regenerator'
import mockAdminStore from './mocks/adminStore'
import AdminStartPage from '../public/js/app/pages/AdminStartPage'

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

describe('User roles for this course <AdminStartPage>', () => {
  test('User: only teacher. Show only course memo card.', done => {
    const { getAllByRole } = renderWithState(ONLY_TEACHER)
    const allH4Headers = getAllByRole('heading', { level: 4 })
    expect(allH4Headers.length).toBe(1)
    expect(allH4Headers[0]).toHaveTextContent(/^Kurs-PM/)
    done()
  })

  test('User: only responsible. Show all cards: course memo, course description and course analysis', done => {
    const { getAllByRole } = renderWithState(ONLY_RESPONSIBLE)
    const allH4Headers = getAllByRole('heading', { level: 4 })
    expect(allH4Headers.length).toBe(3)
    expect(allH4Headers[0]).toHaveTextContent(/^Introduktion till kursen/)
    expect(allH4Headers[1]).toHaveTextContent(/^Kurs-PM/)
    expect(allH4Headers[2]).toHaveTextContent(/^Kursanalys och kursdata/)
    done()
  })

  test('User: only examinator. Show all cards: course memo, course description and course analysis', done => {
    const { getAllByRole } = renderWithState(ONLY_EXAMINATOR)
    const allH4Headers = getAllByRole('heading', { level: 4 })
    expect(allH4Headers.length).toBe(3)
    expect(allH4Headers[0]).toHaveTextContent(/^Introduktion till kursen/)
    expect(allH4Headers[1]).toHaveTextContent(/^Kurs-PM/)
    expect(allH4Headers[2]).toHaveTextContent(/^Kursanalys och kursdata/)
    done()
  })

  test('User: only superuser. Show all cards: course memo, course description and course analysis', done => {
    const { getAllByRole } = renderWithState(ONLY_SUPERUSER)
    const allH4Headers = getAllByRole('heading', { level: 4 })
    expect(allH4Headers.length).toBe(3)
    expect(allH4Headers[0]).toHaveTextContent(/^Introduktion till kursen/)
    expect(allH4Headers[1]).toHaveTextContent(/^Kurs-PM/)
    expect(allH4Headers[2]).toHaveTextContent(/^Kursanalys och kursdata/)
    done()
  })

  test('User has two roles: teacher and superuser. Show all cards: course memo, course description and course analysis', done => {
    const { getAllByRole } = renderWithState(TEACHER_AND_SUPERUSER)
    const allH4Headers = getAllByRole('heading', { level: 4 })
    expect(allH4Headers.length).toBe(3)
    expect(allH4Headers[0]).toHaveTextContent(/^Introduktion till kursen/)
    expect(allH4Headers[1]).toHaveTextContent(/^Kurs-PM/)
    expect(allH4Headers[2]).toHaveTextContent(/^Kursanalys och kursdata/)
    done()
  })

  test('User has two roles: teacher and examinator. Show all cards: course memo, course description and course analysis', done => {
    const { getAllByRole } = renderWithState(TEACHER_AND_EXAMINATOR)
    const allH4Headers = getAllByRole('heading', { level: 4 })
    expect(allH4Headers.length).toBe(3)
    expect(allH4Headers[0]).toHaveTextContent(/^Introduktion till kursen/)
    expect(allH4Headers[1]).toHaveTextContent(/^Kurs-PM/)
    expect(allH4Headers[2]).toHaveTextContent(/^Kursanalys och kursdata/)
    done()
  })

  test('User has two roles: teacher and resonsible. Show all cards: course memo, course description and course analysis', done => {
    const { getAllByRole } = renderWithState(TEACHER_AND_RESPONSIBLE)
    const allH4Headers = getAllByRole('heading', { level: 4 })
    expect(allH4Headers.length).toBe(3)
    expect(allH4Headers[0]).toHaveTextContent(/^Introduktion till kursen/)
    expect(allH4Headers[1]).toHaveTextContent(/^Kurs-PM/)
    expect(allH4Headers[2]).toHaveTextContent(/^Kursanalys och kursdata/)
    done()
  })
})
