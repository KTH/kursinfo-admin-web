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
  test.each(['Test', 'Test 2'])('renders alert message %s', message => {
    render(<AlertMissingMemoMsg querySearchParams={TEST_QUERY_MISSING_DRAFT} message={message} />)
    const alertHeader = getByRole('alert')
    expect(alertHeader).toHaveTextContent(message)
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

  test('returns null if message is null', () => {
    const { container } = render(<AlertMissingMemoMsg querySearchParams={TEST_QUERY_MISSING_DRAFT} message={null} />)
    expect(container).toBeEmptyDOMElement()
  })

  test('returns null if source does not include missingMemoDraft', () => {
    const { container } = render(
      <AlertMissingMemoMsg querySearchParams={{ source: 'otherSource' }} message={'Should not show'} />
    )
    expect(container).toBeEmptyDOMElement()
  })
})
