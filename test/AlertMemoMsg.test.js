import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import AlertMemoMsg from '../public/js/app/components/AlertMemoMsg'
import i18n from '../i18n'

const TEST_PUBLISH = {
  serv: 'kutv',
  event: 'pub',
  id: 'SF1624HT2019_9',
  term: '20192',
  name: 'CMATD1 m.fl. ( Startdatum 2019-10-28, Svenska )',
  noMemo: 'CMATD1 m.fl. ( Startdatum 2019-10-28, Svenska )',
}

const TEST_SAVE = {
  serv: 'kutv',
  event: 'save',
  id: 'SF1624HT2019_9',
  term: '20192',
  name: 'CMATD1 m.fl. ( Startdatum 2019-10-28, Svenska )',
  noMemo: 'CMATD1 m.fl. ( Startdatum 2019-10-28, Svenska )',
}

const { getByRole, getByText } = screen
const pageTitles = lang => i18n.messages[lang === 'en' ? 0 : 1].pageTitles

xdescribe('English. Component <AlertMemoMsg> renders with different messages if a user went to save/publish course analysis and were returned in the end.', () => {
  test('renders without props', done => {
    render(<AlertMemoMsg />)
    done()
  })

  test('renders alert message if a user went to admin and published data again', done => {
    render(<AlertMemoMsg querySearchParams={TEST_PUBLISH} lang="en" translate={pageTitles('en')} />)
    const alertHeader = getByRole('heading', { level: 4 })
    expect(alertHeader).toHaveTextContent(/^... but it is missing a published course memo/)
    done()
  })

  test('does not render alert message if a user went to admin and saved data without publishing it', done => {
    render(<AlertMemoMsg querySearchParams={TEST_SAVE} lang="en" translate={pageTitles('en')} />)
    const alertHeader = screen.queryByRole('heading', { level: 4 })
    expect(alertHeader).not.toBeInTheDocument()
    const alertText = screen.queryByText(/^... but it is missing a published course memo/)
    expect(alertText).not.toBeInTheDocument()
    done()
  })
})

xdescribe('Swedish. Component <AlertMemoMsg> renders with different messages if a user went to admin page, have done some action and send back to public page.', () => {
  test('renders without props', done => {
    render(<AlertMemoMsg />)
    done()
  })

  test('renders alert message if a user went to admin and published data again', done => {
    render(<AlertMemoMsg querySearchParams={TEST_PUBLISH} lang="sv" translate={pageTitles('sv')} />)
    const alertHeader = getByRole('heading', { level: 4 })
    expect(alertHeader).toHaveTextContent(/^... men det saknas ett publicerat kurs-PM/)
    done()
  })

  test('does not render alert message if a user went to admin and saved data without publishing it', done => {
    render(<AlertMemoMsg querySearchParams={TEST_SAVE} lang="sv" translate={pageTitles('sv')} />)
    const alertHeader = screen.queryByRole('heading', { level: 4 })
    expect(alertHeader).not.toBeInTheDocument()
    const alertText = screen.queryByText(/^... but it is missing a published course memo/)
    expect(alertText).not.toBeInTheDocument()
    done()
  })
})
