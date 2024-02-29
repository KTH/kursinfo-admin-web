import React from 'react'

import i18n from '../../../../../../i18n'
import ControlButtons from '../../../components/ControlButtons'
import { useWebContext } from '../../../context/WebContext'
import { goToAdminStartPage } from '../../../util/links'

import OtherInformationPreviewSection from './OtherInformationPreviewSection'

export default function OtherInformationPreview({ pageState }) {
  const [context] = useWebContext()
  const textInputValues = pageState.textInput.values
  const courseCode = pageState.courseCode
  const texts = i18n.messages[context.langIndex].editOtherInformation.step2
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
      await context.doUpdateOtherInformation(courseCode, textInputValues)
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
      <span className="title_and_info">
        <h2>{texts.header}</h2>
      </span>

      <OtherInformationPreviewSection
        header={texts.fields.supplementaryInfoSv}
        value={textInputValues.supplementaryInfoSv}
      />
      <OtherInformationPreviewSection
        header={texts.fields.supplementaryInfoEn}
        value={textInputValues.supplementaryInfoEn}
      />

      {submitState.isError && (
        <Alert color="danger">
          <p>{apiErrorMsg}</p>
        </Alert>
      )}

      <ControlButtons
        pageState={pageState}
        back={true}
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
