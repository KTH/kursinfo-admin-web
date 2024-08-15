import React from 'react'

import i18n from '../../../../../../i18n'
import Alert from '../../../components-shared/Alert'
import ControlButtons from '../../../components/ControlButtons'
import { useWebContext } from '../../../context/WebContext'
import { goToAdminStartPage } from '../../../util/links'

import RecommendedPrerequisitesPreviewSection from './RecommendedPrerequisitesPreviewSection'

export default function RecommendedPrerequisitesPreview({ pageState }) {
  const [context] = useWebContext()
  const textInputValues = pageState.textInput.values
  const { courseCode } = pageState
  const texts = i18n.messages[context.langIndex].editRecommendedPrerequisites.step2
  const apiErrorMsg = i18n.messages[context.langIndex].pageTitles.alertMessages.api_error

  const [submitState, setSubmitState] = React.useState({
    inProgress: false,
    isError: false,
  })

  async function onConfirm() {
    setSubmitState({
      inProgress: true,
      isError: false,
    })
    try {
      await context.doUpsertOtherInformation(courseCode, textInputValues)
      goToAdminStartPage(courseCode, context.lang, 'pub')
    } catch (err) {
      setSubmitState({
        inProgress: false,
        isError: true,
      })
    }
  }

  return (
    <div>
      <h2>{texts.header}</h2>

      <RecommendedPrerequisitesPreviewSection
        header={texts.fields.recommendedPrerequisitesSv}
        value={textInputValues.recommendedPrerequisitesSv}
      />
      <RecommendedPrerequisitesPreviewSection
        header={texts.fields.recommendedPrerequisitesEn}
        value={textInputValues.recommendedPrerequisitesEn}
      />

      {submitState.isError && (
        <Alert type="warning">
          <p>{apiErrorMsg}</p>
        </Alert>
      )}

      <ControlButtons
        pageState={pageState}
        back={{ label: texts.backButton }}
        next={{
          confirmPublish: true,
          onClick: onConfirm,
          disabled: submitState.inProgress,
          label: texts.nextButton,
        }}
      />
    </div>
  )
}
