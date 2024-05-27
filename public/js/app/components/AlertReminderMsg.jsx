import React from 'react'
import Alert from '../components-shared/Alert'
import i18n from '../../../../i18n'

const AlertReminderMsg = ({ querySearchParams, lang = 'en' }) => {
  if (!querySearchParams) return null

  const { event: doneAction, serv: serviceAbbr } = querySearchParams
  const langIndex = lang === 'en' ? 0 : 1
  const { pub_changed_info } = i18n.messages[langIndex].pageTitles.alertMessages.alertinfo

  return (
    serviceAbbr === 'pmdata' &&
    doneAction === 'pub_changed' && (
      <Alert type="info">
        <p>{pub_changed_info}</p>
      </Alert>
    )
  )
}

export default AlertReminderMsg
