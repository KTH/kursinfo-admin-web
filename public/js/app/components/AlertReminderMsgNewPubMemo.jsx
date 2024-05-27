import React from 'react'
import Alert from '../components-shared/Alert'
import { COURSE_INFO_IN_CANVAS } from '../util/constants'
import i18n from '../../../../i18n'

const AlertReminderMsgNewPubMemo = ({ querySearchParams, lang = 'en' }) => {
  const langIndex = lang === 'en' ? 0 : 1
  const { pub_info } = i18n.messages[langIndex].pageTitles.alertMessages.alertinfo
  const { aTitle, ariaLabel } = i18n.messages[langIndex].pageTitles.links_to.canvas
  if (!querySearchParams) return null

  const { event: doneAction, serv: serviceAbbr } = querySearchParams

  return (
    serviceAbbr === 'pmdata' &&
    doneAction === 'pub' && (
      <Alert type="info">
        <p>
          {pub_info}
          <a href={COURSE_INFO_IN_CANVAS[lang]} aria-label={ariaLabel}>
            {aTitle}
          </a>
        </p>
      </Alert>
    )
  )
}

export default AlertReminderMsgNewPubMemo
