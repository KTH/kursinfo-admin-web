import React from 'react'
import { Alert } from 'reactstrap'

import i18n from '../../../../../../i18n'
import ControlButtons from '../../../components/ControlButtons'
import EditorSection from '../../../components/Editor/EditorSection'
import { useWebContext } from '../../../context/WebContext'

export default function OtherInformationTextEdit({ pageState }) {
  const [context] = useWebContext()
  const texts = i18n.messages[context.langIndex].editOtherInformation.step1
  const { hasErrors, getEditorSectionProps } = pageState.textInput

  const onNext = () => {
    if (!hasErrors) pageState.progress.goToNext()
  }

  return (
    <form>
      <span className="title_and_info">
        <h2>{texts.label}</h2>
      </span>
      <Alert color="info" aria-live="polite" fade={false}>
        {texts.alert}
      </Alert>

      <EditorSection title={texts.fields.supplementaryInfoSv} {...getEditorSectionProps('supplementaryInfoSv')} />
      <EditorSection title={texts.fields.supplementaryInfoEn} {...getEditorSectionProps('supplementaryInfoEn')} />

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
