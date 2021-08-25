import React from 'react'
import { Alert } from 'reactstrap'
import { fetchParameters } from '../util/fetchUrlParams'

// &noMemo=CSAMH%20(%20Startdatum%202012-08-24,%20Svenska%20)
const AlertMemoMsg = ({ props, translate = {}, lang = 'en' }) => {
  const params = fetchParameters(props)
  const { noMemo: noMemoRoundNames = '' } = params
  const { noMemo: noMemoHeader } = translate.alertMessages
  const decodedRoundNames = decodeURI(noMemoRoundNames).trim()

  return (
    decodedRoundNames !== '' && (
      <Alert color="info" aria-live="polite">
        <h4>{noMemoHeader}</h4>
        {lang === 'sv' ? (
          <p>{`Använd funktionen “Kurs-PM” på denna sida och publicera ditt Kurs-PM för termin: ${decodedRoundNames}. Då kommer kurs-PM att visas på sidorna “Kursens utveckling” och “Kurs-PM”.`}</p>
        ) : (
          <p>{`Use the function “Course memo” on this page and publish your course memo for: ${decodedRoundNames}. It will be displayed on pages “Course development” and “Course memo”.`}</p>
        )}
      </Alert>
    )
  )
}

export default AlertMemoMsg
