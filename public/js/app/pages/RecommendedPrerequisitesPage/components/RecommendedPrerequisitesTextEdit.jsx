import React from 'react'

import i18n from '../../../../../../i18n'
import Alert from '../../../components-shared/Alert'
import ControlButtons from '../../../components/ControlButtons'
import EditorSection from '../../../components/Editor/EditorSection'
import { useWebContext } from '../../../context/WebContext'

export default function RecommendedPrerequisitesTextEdit({ pageState }) {
  const [context] = useWebContext()
  const texts = i18n.messages[context.langIndex].editRecommendedPrerequisites.step1
  const { hasErrors, getEditorSectionProps } = pageState.textInput

  const onNext = () => {
    if (!hasErrors) pageState.progress.goToNext()
  }

  return (
    <form>
      <h2>{texts.title}</h2>

      <Alert type="info">{texts.alert}</Alert>

      <EditorSection
        title={texts.fields.recommendedPrerequisitesSv}
        {...getEditorSectionProps('recommendedPrerequisitesSv')}
      />
      <EditorSection
        title={texts.fields.recommendedPrerequisitesEn}
        {...getEditorSectionProps('recommendedPrerequisitesEn')}
      />

      <ControlButtons
        pageState={pageState}
        next={{
          onClick: onNext,
          disabled: hasErrors,
          label: texts.nextButton,
        }}
      />
    </form>
  )
}
