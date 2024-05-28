import React from 'react'

import i18n from '../../../../../../i18n'
import Alert from '../../../components-shared/Alert'
import ControlButtons from '../../../components/ControlButtons'
import EditorSection from '../../../components/Editor/EditorSection'
import { useWebContext } from '../../../context/WebContext'

export default function DescriptionTextEdit({ pageState }) {
  const [context] = useWebContext()
  const texts = i18n.messages[context.langIndex].editDescription.step2
  const { hasErrors, getEditorSectionProps } = pageState.textInput

  const onNext = () => {
    if (!hasErrors) pageState.progress.goToNext()
  }

  return (
    <form>
      <h2>{texts.title}</h2>
      <Alert type="info">{texts.alert}</Alert>

      <EditorSection title={texts.fields.sellingTextSv} {...getEditorSectionProps('sellingTextSv')} />
      <EditorSection title={texts.fields.sellingTextEn} {...getEditorSectionProps('sellingTextEn')} />
      <EditorSection title={texts.fields.courseDispositionSv} {...getEditorSectionProps('courseDispositionSv')} />
      <EditorSection title={texts.fields.courseDispositionEn} {...getEditorSectionProps('courseDispositionEn')} />

      <ControlButtons
        pageState={pageState}
        back={{ label: texts.backButton }}
        next={{
          onClick: onNext,
          disabled: hasErrors,
          label: texts.nextButton,
        }}
      />
    </form>
  )
}
