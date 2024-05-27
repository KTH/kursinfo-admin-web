import React from 'react'
import Alert from '../components-shared/Alert'

// &noMemo=CSAMH%20(%20Startdatum%202012-08-24,%20Svenska%20)
const AlertMemoMsg = ({
  querySearchParams,
  translate = { alertMessages: {}, course_short_semester: {} },
  lang = 'en',
}) => {
  if (!querySearchParams) return null

  const { event: doneAction, noMemo: roundNames = '', term: semester } = querySearchParams
  const { alertMessages, course_short_semester: shortSemester } = translate

  const { noMemoHeader } = alertMessages
  const decodedRoundNames = decodeURIComponent(roundNames).trim()

  const semesterFriendly = semester
    ? `${lang === 'en' ? 'semester' : 'termin'}: ${shortSemester[semester.toString().substring(4, 5)]}${semester
        .toString()
        .substring(0, 4)}`
    : ''
  const showAlert = decodedRoundNames !== '' && doneAction === 'pub'

  return (
    showAlert && (
      <Alert type="info" header={noMemoHeader}>
        {lang === 'sv' ? (
          <p>{`Använd funktionen: Kurs-PM nedan och publicera kurs-PM för ${semesterFriendly}, och kurstillfällen: ${decodedRoundNames}. Då kommer kurs-PM att visas på sidorna: Kursens utveckling och Kurs-PM.`}</p>
        ) : (
          <p>{`Use the function: Course memo below and publish course memo for ${semesterFriendly} and course offering(s) ${decodedRoundNames}. The published course memo will be displayed on pages Course development and Course memo.`}</p>
        )}
      </Alert>
    )
  )
}

export default AlertMemoMsg
