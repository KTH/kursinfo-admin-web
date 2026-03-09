import React from 'react'
import Alert from '../components-shared/Alert'

const AlertMissingMemoMsg = ({ querySearchParams, message }) => {
  if (!querySearchParams || !message) return null
  const { source } = querySearchParams
  const showAlert = source && source.includes('missingMemoDraft')
  if (!showAlert) return null

  return showAlert && <Alert type="error" header={message} />
}

export default AlertMissingMemoMsg
