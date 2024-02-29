import React from 'react'

import i18n from '../../../../../i18n'
import PageTitle from '../../components/PageTitle'
import ProgressBar, { useProgressBar } from '../../components/ProgressBar'
import { useWebContextTextInput } from '../../components/WebContextTextInput/useWebContextTextInput'
import { useWebContext } from '../../context/WebContext'

import OtherInformationPreview from './components/OtherInformationPreview'
import OtherInformationTextEdit from './components/OtherInformationTextEdit'

const useOtherInformationPageState = steps => {
  const [context] = useWebContext()
  const progress = useProgressBar(steps)
  const textInput = useWebContextTextInput()

  const courseCode = context.routeData.courseData.courseCode
  const hasChanges = textInput.hasChanges

  return { progress, textInput, hasChanges, courseCode }
}

/**
 * Page for editing other informations (supplementaryInfo)
 */
function OtherInformationPage() {
  const [context] = useWebContext()
  const labels = i18n.messages[context.langIndex].editOtherInformation
  const pageState = useOtherInformationPageState([labels.step1, labels.step2])

  return (
    <div className="kursinfo-main-page">
      <PageTitle pageTitle={labels.pageHeader} courseTitleData={context.routeData.courseData} />
      <ProgressBar {...pageState.progress} />

      {pageState.progress.current === 0 && <OtherInformationTextEdit pageState={pageState} />}
      {pageState.progress.current === 1 && <OtherInformationPreview pageState={pageState} />}
    </div>
  )
}

export { OtherInformationPage }
