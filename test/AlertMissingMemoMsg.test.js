import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import AlertMissingMemoMsg from '../public/js/app/components/AlertMissingMemoMsg'
import i18n from '../i18n'

const TEST_QUERY_MISSING_DRAFT = {
  source: 'missingMemoDraft',
}

const { getByRole } = screen

describe('English. Component <AlertMissingMemoMsg> renders alert if user is missing a memo draft', () => {
  test('renders alert message if user does not have a draft', done => {
    const lang = 'en'
    const { pageTitles } = i18n.messages[lang === 'en' ? 0 : 1]
    render(<AlertMissingMemoMsg querySearchParams={TEST_QUERY_MISSING_DRAFT} translate={pageTitles} />)
    const alertHeader = getByRole('alert')
    expect(alertHeader).toHaveTextContent('The course memo you are looking for is missing a draft')
    done()
  })
})

describe('Swedish. Component <AlertMissingMemoMsg> renders alert if user is missing a memo draft', () => {
  test('renders alert message if user does not have a draft', done => {
    const lang = 'sv'
    const { pageTitles } = i18n.messages[lang === 'en' ? 0 : 1]
    render(<AlertMissingMemoMsg querySearchParams={TEST_QUERY_MISSING_DRAFT} translate={pageTitles} />)
    const alertHeader = getByRole('alert')
    expect(alertHeader).toHaveTextContent('Det kurs-PM du söker saknar ett utkast')
    done()
  })
})

describe('Component <AlertMissingMemoMsg> edge cases', () => {
  test('returns null if querySearchParams is undefined', () => {
    const { container } = render(<AlertMissingMemoMsg />)
    expect(container).toBeEmptyDOMElement()
  })

  test('returns null if querySearchParams is null', () => {
    const { container } = render(<AlertMissingMemoMsg querySearchParams={null} />)
    expect(container).toBeEmptyDOMElement()
  })

  test('returns null if source does not include missingMemoDraft', () => {
    const { container } = render(
      <AlertMissingMemoMsg
        querySearchParams={{ source: 'otherSource' }}
        translate={{ alertMessages: { memoMissing: 'Should not show' } }}
      />
    )
    expect(container).toBeEmptyDOMElement()
  })

  test('handles missing translate prop gracefully', () => {
    const lang = 'en'
    render(<AlertMissingMemoMsg querySearchParams={TEST_QUERY_MISSING_DRAFT} lang={lang} />)
    const alert = getByRole('alert')
    expect(alert).toBeInTheDocument()
    expect(alert).toHaveTextContent(i18n.messages[lang === 'en' ? 0 : 1].messages.missing_translation)
  })

  test('handles missing alertMessages.memoMissing gracefully', () => {
    const lang = 'en'
    render(
      <AlertMissingMemoMsg querySearchParams={TEST_QUERY_MISSING_DRAFT} lang={lang} translate={{ alertMessages: {} }} />
    )
    const alert = getByRole('alert')
    expect(alert).toBeInTheDocument()
    expect(alert).toHaveTextContent(i18n.messages[lang === 'en' ? 0 : 1].messages.missing_translation)
  })
})
