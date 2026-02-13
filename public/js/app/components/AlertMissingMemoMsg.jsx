import React from 'react'
import Alert from '../components-shared/Alert'

const AlertMissingMemoMsg = ({ querySearchParams, translate = {} }) => {
  const { alertMessages } = translate
  if (!querySearchParams) return null
  const { source } = querySearchParams
  const showAlert = source && source.includes('missingMemoDraft')
  if (!showAlert) return null

  return showAlert && <Alert type="error" header={alertMessages.memoMissing} />
}

export default AlertMissingMemoMsg
