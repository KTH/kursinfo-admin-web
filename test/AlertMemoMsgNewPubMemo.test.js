import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import i18n from '../i18n'
import AlertReminderMsgNewPubMemo from '../public/js/app/components/AlertReminderMsgNewPubMemo'

const TEST_PUBLISH = {
  serv: 'pmdata',
  event: 'pub',
}

const { getByRole, getByText } = screen

describe('English. Component <AlertReminderMsgNewPubMemo> renders with reminder messages if a user went to publish course memo and were returned in the end.', () => {
  test('renders alert message if a user went to admin and published data again', done => {
    render(<AlertReminderMsgNewPubMemo querySearchParams={TEST_PUBLISH} lang="en" />)
    const alertHeader = getByRole('alert')
    expect(alertHeader).toHaveTextContent(
      'Remember to link to your course memo from the course room in Canvas. Read more on the intranet about '
    )
    done()
  })
})

describe('Swedish. Component <AlertMemoMsg> renders with different messages if a user went to admin page, have done some action and send back to public page.', () => {
  test('renders alert message if a user went to admin and published data again', done => {
    render(<AlertReminderMsgNewPubMemo querySearchParams={TEST_PUBLISH} lang="sv" />)
    const alertHeader = getByRole('alert')
    expect(alertHeader).toHaveTextContent(
      'Kom ihåg att länka till ditt kurs-PM från kursrummet i Canvas. Läs mer på intranätet om Funktionen '
    )
    done()
  })
})
