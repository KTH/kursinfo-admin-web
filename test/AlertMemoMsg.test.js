import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import AlertMemoMsg from '../public/js/app/components/AlertMemoMsg'
import i18n from '../i18n'

const TEST_PUBLISH = {
  location: {
    pathname: '/kursutveckling/SF1624',
    search:
      '?serv=kutv&event=pub&id=SF1624HT2019_9&term=20192&name=CMATD1%20m.fl.%20(%20Startdatum%202019-10-28,%20Svenska%20)&noMemo=CMATD1%20m.fl.%20(%20Startdatum%202019-10-28,%20Svenska%20)',
    hash: '',
    state: undefined,
  },
}

const TEST_SAVE = {
  location: {
    pathname: '/kursutveckling/SF1624',
    search:
      '?serv=kutv&event=save&id=SF1624HT2019_9&term=20192&name=CMATD1%20m.fl.%20(%20Startdatum%202019-10-28,%20Svenska%20)&noMemo=CMATD1%20m.fl.%20(%20Startdatum%202019-10-28,%20Svenska%20)',
    hash: '',
    state: undefined,
  },
}

const { getByRole, getByText } = screen
const pageTitles = lang => i18n.messages[lang === 'en' ? 0 : 1].pageTitles

describe('English. Component <AlertMemoMsg> renders with different messages if user went to save/publish course analysis and were returned in the end.', () => {
  test('renders without props', done => {
    render(<AlertMemoMsg />)
    done()
  })

  test('renders alert message if user went to admin and published data again', done => {
    render(<AlertMemoMsg props={TEST_PUBLISH} lang="en" translate={pageTitles('en')} />)
    const alertHeader = getByRole('heading', { level: 4 })
    expect(alertHeader).toHaveTextContent(/^... but it is missing a published course memo/)
    done()
  })

  test('renders alert message if user went to admin and saved data without publishing it', done => {
    render(<AlertMemoMsg props={TEST_SAVE} lang="en" translate={pageTitles('en')} />)
    const alertHeader = getByRole('heading', { level: 4 })
    expect(alertHeader).toHaveTextContent(/^... but it is missing a published course memo/)
    done()
  })
})

describe('Swedish. Component <AlertMemoMsg> renders with different messages if user went to admin page, have done some action and send back to public page.', () => {
  test('renders without props', done => {
    render(<AlertMemoMsg />)
    done()
  })

  test('renders alert message if user went to admin and published data again', done => {
    render(<AlertMemoMsg props={TEST_PUBLISH} lang="sv" translate={pageTitles('sv')} />)
    const alertHeader = getByRole('heading', { level: 4 })
    expect(alertHeader).toHaveTextContent(/^... men det saknas att publicerat kurs-PM/)
    done()
  })

  test('renders alert message if user went to admin and saved data without publishing it', done => {
    render(<AlertMemoMsg props={TEST_SAVE} lang="sv" translate={pageTitles('sv')} />)
    const alertHeader = getByRole('heading', { level: 4 })
    expect(alertHeader).toHaveTextContent(/^... men det saknas att publicerat kurs-PM/)
    done()
  })
})
