import React from 'react'
import ProgressBar from 'react-bootstrap/ProgressBar'

import i18n from '../../../../../../i18n'
import Alert from '../../../components-shared/Alert'
import ControlButtons from '../../../components/ControlButtons'
import { useWebContext } from '../../../context/WebContext'
import { goToAdminStartPage } from '../../../util/links'

import DescriptionPreviewSection from './DescriptionPreviewSection'
import { uploadImage } from './imageUtils'

export default function DescriptionPreview({ pageState }) {
  const [context] = useWebContext()
  const [submitState, setSubmitState] = React.useState({
    hasDoneSubmit: false,
    isError: false,
    errorMessage: undefined,
    fileProgress: 0,
  })

  const { newImage, hasCustomImage } = pageState.imageInput
  const textInputValues = pageState.textInput.values
  const { courseCode } = pageState
  const texts = i18n.messages[context.langIndex].editDescription.step3
  const apiImageErrorMsg = i18n.messages[context.langIndex].pageTitles.storage_api_error
  const apiTextErrorMsg = i18n.messages[context.langIndex].pageTitles.api_error

  const onFileUploadProgress = fileProgress => setSubmitState({ ...submitState, hasDoneSubmit: true, fileProgress })

  async function handleImageFileUpload(image) {
    if (!hasCustomImage) {
      // empyt string = standard image
      return { isError: false, imageName: '' }
    }
    if (!image) {
      // undefined = current custom image will be kept
      return { isError: false, imageName: undefined }
    }
    try {
      const result = await uploadImage(context, courseCode, image.formData, onFileUploadProgress)
      return { isError: false, imageName: result.imageName }
    } catch (err) {
      setSubmitState({ hasDoneSubmit: false, isError: true, errorMessage: apiImageErrorMsg, fileProgress: 0 })
      return { isError: true }
    }
  }

  async function handleTextUpload(values) {
    try {
      await context.doUpsertItem(courseCode, values)
      return { isError: false }
    } catch (err) {
      setSubmitState({ hasDoneSubmit: false, isError: true, errorMessage: apiTextErrorMsg, fileProgress: 0 })
      return { isError: true }
    }
  }

  async function onConfirm() {
    setSubmitState({ hasDoneSubmit: true, isError: false, fileProgress: 0 })

    const imageResult = await handleImageFileUpload(newImage)
    if (imageResult.isError) return

    const textResult = await handleTextUpload({ ...textInputValues, imageName: imageResult.imageName })
    if (textResult.isError) return

    goToAdminStartPage(courseCode, context.lang, 'pub')
  }

  return (
    <div>
      <DescriptionPreviewSection lang="sv" pageState={pageState} />
      <DescriptionPreviewSection lang="en" pageState={pageState} />

      {(submitState.hasDoneSubmit || submitState.isError) && (
        <span className={submitState.isError ? 'text-danger' : 'text-success'} role="status">
          <div className="text-center">{submitState.fileProgress + '%'}</div>
          <ProgressBar
            now={submitState.isError ? '100' : submitState.fileProgress}
            variant={submitState.isError ? 'danger' : 'success'}
          />
        </span>
      )}

      {submitState.isError && (
        <Alert type="warning">
          <p>{submitState.errorMessage}</p>
        </Alert>
      )}

      <ControlButtons
        pageState={pageState}
        back={{ label: texts.backButton }}
        next={{
          confirmPublish: true,
          onClick: onConfirm,
          disabled: submitState.hasDoneSubmit,
          label: texts.nextButton,
        }}
      />
    </div>
  )
}
