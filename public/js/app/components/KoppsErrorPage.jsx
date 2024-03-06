import React from 'react'
import { Alert } from 'reactstrap'

import i18n from '../../../../i18n'
import PageTitle from './PageTitle'
import { useWebContext } from '../context/WebContext'

export default function KoppsErrorPage({ pageTitleProps }) {
  const [context] = useWebContext()

  return (
    <div className="kursinfo-main-page ">
      <PageTitle {...pageTitleProps} />
      <Alert color="info" aria-live="polite" fade={false}>
        {i18n.messages[context?.langIndex ?? 1].pageTitles.alertMessages.kopps_api_down}
      </Alert>
    </div>
  )
}
