import React from 'react'
import Alert from '../components-shared/Alert'

import i18n from '../../../../i18n'
import { useWebContext } from '../context/WebContext'
import PageTitle from './PageTitle'

export default function LadokErrorPage({ pageTitleProps }) {
  const [context] = useWebContext()

  return (
    <div className="kursinfo-main-page ">
      <PageTitle {...pageTitleProps} />
      <Alert type="info">{i18n.messages[context?.langIndex ?? 1].pageTitles.alertMessages.ladok_api_down}</Alert>
    </div>
  )
}
