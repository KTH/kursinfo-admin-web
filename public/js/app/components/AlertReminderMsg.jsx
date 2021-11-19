import React from 'react'
import { Alert } from 'reactstrap'
import { fetchParameters } from '../util/fetchUrlParams'

const AlertReminderMsg = ({ props, lang = 'en' }) => {
  const params = fetchParameters(props)
  const { event: doneAction, name: courseRoundName, serv: serviceAbbr, term: semester } = params

  return (
    (serviceAbbr === 'pm' || serviceAbbr === 'pmdata') &&
    doneAction === 'pub_changed' && (
      <Alert color="info" aria-live="polite">
        {lang === 'sv' ? (
          <p>{`Kom ihåg att informera dina studenter om att det finns en ny version av kurs-PM. Tänk även på att informera om vilka ändringar som gjorts.`}</p>
        ) : (
          <p>{`Remember to inform your students that there is a new version of the course memo. Also inform about what changes that have been made in the last version.`}</p>
        )}
      </Alert>
    )
  )
}

export default AlertReminderMsg
