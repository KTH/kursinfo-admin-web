import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import AlertReminderMsg from '../public/js/app/components/AlertReminderMsg'

const TEST_PUBLISH = {
  serv: 'pmdata',
  event: 'pub_changed',
}

const { getByRole } = screen

describe('English. Component <AlertReminderMsg> renders with different messages if a user went to save/publish course analysis and were returned in the end.', () => {
  test('renders alert message if a user went to admin and published data again', done => {
    render(<AlertReminderMsg querySearchParams={TEST_PUBLISH} lang="en" />)
    const alertHeader = getByRole('alert')
    expect(alertHeader).toHaveTextContent(
      'Remember to inform your students that there is a new version of the course memo. Also inform about what changes that have been made in the last version.'
    )
    done()
  })
})

describe('Swedish. Component <AlertMemoMsg> renders with different messages if a user went to admin page, have done some action and send back to public page.', () => {
  test('renders alert message if a user went to admin and published data again', done => {
    render(<AlertReminderMsg querySearchParams={TEST_PUBLISH} lang="sv" />)
    const alertHeader = getByRole('alert')
    expect(alertHeader).toHaveTextContent(
      'Kom ihåg att informera dina studenter om att det finns en ny version av kurs-PM. Tänk även på att informera om vilka ändringar som gjorts.'
    )
    done()
  })
})
