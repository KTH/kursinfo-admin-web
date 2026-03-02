import React from 'react'
import Alert from '../components-shared/Alert'
import i18n from '../../../../i18n'

const AlertMissingMemoMsg = ({ querySearchParams, lang, translate = {} }) => {
  const missingTranslation = i18n.messages[lang === 'en' ? 0 : 1].messages.missing_translation
  const { alertMessages } = translate
  if (!querySearchParams) return null
  const { source } = querySearchParams
  const showAlert = source && source.includes('missingMemoDraft')
  if (!showAlert) return null

  return showAlert && <Alert type="error" header={alertMessages?.memoMissing || missingTranslation} />
}

export default AlertMissingMemoMsg
