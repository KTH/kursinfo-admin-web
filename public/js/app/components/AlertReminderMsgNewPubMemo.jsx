import React from 'react'
import { Alert } from 'reactstrap'
import { COURSE_INFO_IN_CANVAS } from '../util/constants'

const AlertReminderMsgNewPubMemo = ({ querySearchParams, lang = 'en' }) => {
  if (!querySearchParams) return null

  const { event: doneAction, serv: serviceAbbr } = querySearchParams

  return (
    (serviceAbbr === 'pm' || serviceAbbr === 'pmdata') &&
    doneAction === 'pub' && (
      <Alert color="info" aria-live="polite">
        {lang === 'sv' ? (
          <p>
            {`Kom ihåg att länka till ditt kurs-PM från kursrummet i Canvas. Läs mer på intranätet om `}
            <a href={COURSE_INFO_IN_CANVAS[lang]} aria-label="Funktionen Kursöversikt i Canvas">
              Funktionen Kursöversikt i Canvas
            </a>
          </p>
        ) : (
          <p>
            {`Remember to link to your course memo from the course room in Canvas. Read more on the intranet about `}
            <a href={COURSE_INFO_IN_CANVAS[lang]} aria-label="The Syllabus function in Canvas">
              The Syllabus function in Canvas
            </a>
          </p>
        )}
      </Alert>
    )
  )
}

export default AlertReminderMsgNewPubMemo
