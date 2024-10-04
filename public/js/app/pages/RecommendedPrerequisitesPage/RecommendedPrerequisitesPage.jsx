import React from 'react'

import i18n from '../../../../../i18n'
import PageTitle from '../../components/PageTitle'
import KoppsErrorPage from '../../components/KoppsErrorPage'
import ProgressBar, { useProgressBar } from '../../components-shared/ProgressBar'
import { useWebContextTextInput } from '../../components/WebContextTextInput/useWebContextTextInput'
import { useWebContext } from '../../context/WebContext'
import RecommendedPrerequisitesTextEdit from './components/RecommendedPrerequisitesTextEdit'
import RecommendedPrerequisitesPreview from './components/RecommendedPrerequisitesPreview'

const useRecommendedPrerequisitesPageState = steps => {
  const [context] = useWebContext()
  const progress = useProgressBar(steps)
  const textInput = useWebContextTextInput()

  const { courseCode } = context.routeData.courseData
  const { hasChanges } = textInput

  return { progress, textInput, hasChanges, courseCode }
}

/**
 * Page for editing recommended prerequisites
 */
function RecommendedPrerequisitesPage() {
  const [context] = useWebContext()
  const labels = i18n.messages[context.langIndex].editRecommendedPrerequisites
  const pageState = useRecommendedPrerequisitesPageState([labels.step1, labels.step2])
  const pageTitleProps = { courseTitleData: context.routeData.courseData, pageTitle: labels.pageHeader }

  if (context.koppsApiError) {
    return <KoppsErrorPage pageTitleProps={pageTitleProps} />
  }

  return (
    <div className="kursinfo-main-page">
      <PageTitle {...pageTitleProps} />
      <ProgressBar {...pageState.progress} />

      {pageState.progress.current === 0 && <RecommendedPrerequisitesTextEdit pageState={pageState} />}
      {pageState.progress.current === 1 && <RecommendedPrerequisitesPreview pageState={pageState} />}
    </div>
  )
}

export { RecommendedPrerequisitesPage }
