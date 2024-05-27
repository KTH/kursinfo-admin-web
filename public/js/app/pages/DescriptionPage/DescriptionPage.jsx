import React from 'react'
import i18n from '../../../../../i18n'
import { useWebContext } from '../../context/WebContext'
import PageTitle from '../../components/PageTitle'
import KoppsErrorPage from '../../components/KoppsErrorPage'
import ProgressBar, { useProgressBar } from '../../components-shared/ProgressBar'
import { useWebContextTextInput } from '../../components/WebContextTextInput/useWebContextTextInput'

import DescriptionImageEdit from './components/DescriptionImageEdit'
import DescriptionTextEdit from './components/DescriptionTextEdit'
import DescriptionPreview from './components/DescriptionPreview'
import { useImageInput } from './components/useImageInput'

const useDescriptionPageState = steps => {
  const [context] = useWebContext()
  const progress = useProgressBar(steps)
  const textInput = useWebContextTextInput()
  const imageInput = useImageInput()

  const { courseCode } = context.routeData.courseData
  const hasChanges = textInput.hasChanges || imageInput.hasChanged

  return { progress, textInput, imageInput, hasChanges, courseCode }
}

/**
 * Page for editing course description, course image and course disposition.
 */
function DescriptionPage() {
  const [context] = useWebContext()
  const labels = i18n.messages[context.langIndex].editDescription
  const pageState = useDescriptionPageState([labels.step1, labels.step2, labels.step3])
  const pageTitleProps = { courseTitleData: context.routeData.courseData, pageTitle: labels.pageHeader }

  if (context.koppsApiError) {
    return <KoppsErrorPage pageTitleProps={pageTitleProps} />
  }

  return (
    <div className="kursinfo-main-page">
      <PageTitle {...pageTitleProps} />
      <ProgressBar {...pageState.progress} />

      {pageState.progress.current === 0 && <DescriptionImageEdit pageState={pageState} />}
      {pageState.progress.current === 1 && <DescriptionTextEdit pageState={pageState} />}
      {pageState.progress.current === 2 && <DescriptionPreview pageState={pageState} />}
    </div>
  )
}

export { DescriptionPage }
