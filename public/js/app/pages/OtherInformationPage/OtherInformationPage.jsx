import React from 'react'

import i18n from '../../../../../i18n'
import PageTitle from '../../components/PageTitle'
import LadokErrorPage from '../../components/LadokErrorPage'
import ProgressBar, { useProgressBar } from '../../components-shared/ProgressBar'
import { useWebContextTextInput } from '../../components/WebContextTextInput/useWebContextTextInput'
import { useWebContext } from '../../context/WebContext'

import OtherInformationPreview from './components/OtherInformationPreview'
import OtherInformationTextEdit from './components/OtherInformationTextEdit'

const useOtherInformationPageState = steps => {
  const [context] = useWebContext()
  const progress = useProgressBar(steps)
  const textInput = useWebContextTextInput()

  const { courseCode } = context.routeData.courseData
  const { hasChanges } = textInput

  return { progress, textInput, hasChanges, courseCode }
}

/**
 * Page for editing other informations (supplementaryInfo)
 */
function OtherInformationPage() {
  const [context] = useWebContext()
  const labels = i18n.messages[context.langIndex].editOtherInformation
  const pageState = useOtherInformationPageState([labels.step1, labels.step2])
  const pageTitleProps = { courseTitleData: context.routeData.courseData, pageTitle: labels.pageHeader }

  if (context.ladokApiError) {
    return <LadokErrorPage pageTitleProps={pageTitleProps} />
  }

  return (
    <div className="kursinfo-main-page">
      <PageTitle {...pageTitleProps} />
      <ProgressBar {...pageState.progress} />

      {pageState.progress.current === 0 && <OtherInformationTextEdit pageState={pageState} />}
      {pageState.progress.current === 1 && <OtherInformationPreview pageState={pageState} />}
    </div>
  )
}

export { OtherInformationPage }
