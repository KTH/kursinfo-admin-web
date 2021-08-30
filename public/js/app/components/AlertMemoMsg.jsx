import React from 'react'
import { Alert } from 'reactstrap'
import { fetchParameters } from '../util/fetchUrlParams'

// &noMemo=CSAMH%20(%20Startdatum%202012-08-24,%20Svenska%20)
const AlertMemoMsg = ({ props, translate = { alertMessages: {} }, lang = 'en' }) => {
  const { noMemo: noMemoRoundNames = '', term: urlTerm } = fetchParameters(props)
  const { alertMessages, course_short_semester: shortSemester } = translate

  const { noMemoHeader } = alertMessages
  const decodedRoundNames = decodeURI(noMemoRoundNames).trim()
  const termFriendly = `${shortSemester[urlTerm.toString().substring(4, 5)]}${urlTerm.toString().substring(0, 4)}`

  return (
    decodedRoundNames !== '' && (
      <Alert color="info" aria-live="polite">
        <h4>{noMemoHeader}</h4>
        {lang === 'sv' ? (
          <p>{`Använd funktionen: Kurs-PM nedan och publicera kurs-PM för termin: ${termFriendly}, och kurstillfällen: ${decodedRoundNames}. Då kommer kurs-PM att visas på sidorna: Kursens utveckling och Kurs-PM.`}</p>
        ) : (
          <p>{`Use the function: Course memo below and publish course memo for term: ${termFriendly} and course offering(s) ${decodedRoundNames}. The published course memo will be displayed on pages Course development and Course memo.`}</p>
        )}
      </Alert>
    )
  )
}

export default AlertMemoMsg
