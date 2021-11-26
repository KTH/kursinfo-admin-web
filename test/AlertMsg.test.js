import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import AlertMsg from '../public/js/app/components/AlertMsg'
import i18n from '../i18n'

const TEST_PUBLISH = {
  location: {
    pathname: '/kursutveckling/SF1624',
    search:
      '?serv=kutv&event=pub&id=SF1624HT2019_9&term=20192&name=CMATD1%20m.fl.%20(%20Startdatum%202019-10-28,%20Svenska%20)',
    hash: '',
    state: undefined,
  },
}

const TEST_SAVE = {
  location: {
    pathname: '/kursutveckling/SF1624',
    search:
      '?serv=kutv&event=save&id=SF1624HT2019_9&term=20192&name=CMATD1%20m.fl.%20(%20Startdatum%202019-10-28,%20Svenska%20)',
    hash: '',
    state: undefined,
  },
}

const TEST_DELETE = {
  location: {
    pathname: '/kursutveckling/SF1624',
    search:
      '?serv=kutv&event=delete&id=SF1624HT2019_9&term=20192&name=CMATD1%20m.fl.%20(%20Startdatum%202019-10-28,%20Svenska%20)',
    hash: '',
    state: undefined,
  },
}
const TEST_SIMPLE = {
  location: {
    pathname: '/kursutveckling/SF1624',
    search: '',
    hash: '',
    state: undefined,
  },
}

const translate = {
  en: {
    alertMessages: {
      kutv: {
        save: 'Draft for course analysis and course data has been saved',
        s_msg: 'You can find saved drafts under Course analysis and course data / Publish new',
        pub: 'Course analysis and course data have been published',
        delete: 'Draft for course analysis and course data has been removed',
      },
    },
    course_short_semester: {
      1: 'Spring ',
      2: 'Autumn ',
    },
  },
  sv: {
    alertMessages: {
      kutv: {
        save: 'Utkast för kursanalys och kursdata har sparats',
        s_msg: 'Du hittar det sparade utkastet under Kursanalys och kursdata/ Publicera ny',
        pub: 'Kursanalys och kursdata har publicerats',
        delete: 'Utkast för kursanalys och kursdata har raderats',
      },
    },
    course_short_semester: {
      1: 'VT ',
      2: 'HT ',
    },
  },
}

const { getByRole, getByText } = screen
const pageTitles = userLang => i18n.messages[userLang === 'en' ? 0 : 1].pageTitles

describe('English. Component <AlertMsg> renders with different messages if user went to admin page, have done some action and send back to public page.', () => {
  test('renders without props', done => {
    render(<AlertMsg />)
    done()
  })

  test('renders alert message if user went to admin and published data again', done => {
    render(<AlertMsg props={TEST_PUBLISH} courseCode="SF1624" userLang="en" translate={pageTitles('en')} />)
    const alertHeader = getByRole('heading', { level: 4 })
    expect(alertHeader).toHaveTextContent(translate.en.alertMessages.kutv.pub)
    expect(getByText('Semester: Autumn 2019')).toBeInTheDocument()
    expect(getByText('Course offering: CMATD1 m.fl. ( Startdatum 2019-10-28, Svenska )')).toBeInTheDocument()
    done()
  })

  test('renders alert message if user went to admin and saved data without publishing it', done => {
    render(<AlertMsg props={TEST_SAVE} courseCode="SF1624" userLang="en" translate={pageTitles('en')} />)
    const alertHeader = getByRole('heading', { level: 4 })
    expect(alertHeader).toHaveTextContent(translate.en.alertMessages.kutv.save)
    expect(getByText('Semester: Autumn 2019')).toBeInTheDocument()
    expect(getByText('Course offering: CMATD1 m.fl. ( Startdatum 2019-10-28, Svenska )')).toBeInTheDocument()
    expect(
      getByText('You can find saved drafts under Course analysis and course data / Publish new')
    ).toBeInTheDocument()
    done()
  })

  test('renders alert message if user went to admin and deleted data', done => {
    render(<AlertMsg props={TEST_DELETE} courseCode="SF1624" userLang="en" translate={pageTitles('en')} />)
    const alertHeader = getByRole('heading', { level: 4 })
    expect(alertHeader).toHaveTextContent(translate.en.alertMessages.kutv.delete)
    expect(getByText('Semester: Autumn 2019')).toBeInTheDocument()
    expect(getByText('Course offering: CMATD1 m.fl. ( Startdatum 2019-10-28, Svenska )')).toBeInTheDocument()
    done()
  })

  test('renders alert message if user went to admin and deleted data', done => {
    render(<AlertMsg props={TEST_SIMPLE} courseCode="SF1624" userLang="en" translate={pageTitles('en')} />)
    done()
  })
})

describe('Swedish. Component <AlertMsg> renders with different messages if user went to admin page, have done some action and send back to public page.', () => {
  test('renders without props', done => {
    render(<AlertMsg />)
    done()
  })

  test('renders alert message if user went to admin and published data again', done => {
    render(<AlertMsg props={TEST_PUBLISH} userLang="sv" translate={pageTitles('sv')} />)
    const alertHeader = getByRole('heading', { level: 4 })
    expect(alertHeader).toHaveTextContent(translate.sv.alertMessages.kutv.pub)
    expect(getByText('Termin: HT 2019')).toBeInTheDocument()
    expect(getByText('Kursomgång: CMATD1 m.fl. ( Startdatum 2019-10-28, Svenska )')).toBeInTheDocument()
    done()
  })

  test('renders alert message if user went to admin and saved data without publishing it', done => {
    render(<AlertMsg props={TEST_SAVE} userLang="sv" translate={pageTitles('sv')} />)
    const alertHeader = getByRole('heading', { level: 4 })
    expect(alertHeader).toHaveTextContent(translate.sv.alertMessages.kutv.save)
    expect(getByText('Termin: HT 2019')).toBeInTheDocument()
    expect(getByText('Kursomgång: CMATD1 m.fl. ( Startdatum 2019-10-28, Svenska )')).toBeInTheDocument()
    expect(getByText('Du hittar det sparade utkastet under Kursanalys och kursdata/ Publicera ny')).toBeInTheDocument()
    done()
  })

  test('renders alert message if user went to admin and deleted data', done => {
    render(<AlertMsg props={TEST_DELETE} userLang="sv" translate={pageTitles('sv')} />)
    const alertHeader = getByRole('heading', { level: 4 })
    expect(alertHeader).toHaveTextContent(translate.sv.alertMessages.kutv.delete)
    expect(getByText('Termin: HT 2019')).toBeInTheDocument()
    expect(getByText('Kursomgång: CMATD1 m.fl. ( Startdatum 2019-10-28, Svenska )')).toBeInTheDocument()
    done()
  })

  test('renders alert message if user went to admin and deleted data', done => {
    render(<AlertMsg props={TEST_SIMPLE} userLang="sv" translate={pageTitles('sv')} />)
    done()
  })
})
