import React from 'react'
import { Alert, Button } from 'reactstrap'

import i18n from '../../../../../../i18n'
import ButtonModal from '../../../components/ButtonModal'
import ControlButtons from '../../../components/ControlButtons'
import FileInput from '../../../components/FileInput'
import { useWebContext } from '../../../context/WebContext'
import { INTRA_IMAGE_INFO } from '../../../util/constants'

import { compressFile } from './imageUtils'

const VALID_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png']
const IMAGE_TYPE_DEFAULT_IMAGE = 'default'
const IMAGE_TYPE_CUSTOM_IMAGE = 'custom'

export default function DescriptionImageEdit({ pageState }) {
  const [context] = useWebContext()
  const { imageFromApi, courseData } = context.routeData
  const fileInputRef = React.useRef(null)
  const imageInputState = pageState.imageInput

  const intraImageInfoUrl = INTRA_IMAGE_INFO[context.lang]
  const texts = i18n.messages[context.langIndex].editDescription.step1

  const isDefaultImageSelected = !imageInputState.hasCustomImage

  const disableNextButton = imageInputState.isDefaultImageSelected
    ? false
    : imageInputState.error || (!!imageInputState.newImage && !imageInputState.termsChecked)

  async function onFileInputChanged(inputEvent) {
    const [imageFile] = inputEvent.target.files
    const { imageFilePath, imageFormData } = await compressFile(imageFile)
    if (imageFilePath && imageFormData) {
      imageInputState.setImage({ formData: imageFormData, path: imageFilePath })
    } else {
      imageInputState.setImage(null)
      imageInputState.setError('failed_compression_of_file')
    }
  }

  const onInputTypeChanged = event => {
    imageInputState.onInputTypeChanged(event.target.value === IMAGE_TYPE_CUSTOM_IMAGE)
  }
  const onNext = () => {
    if (!disableNextButton) pageState.progress.goToNext()
  }

  return (
    <>
      <span className="Upload--Area col">
        {isDefaultImageSelected && imageFromApi.hasCustomImage && (
          <Alert color="info">{texts.alertMessages['replace_api_with_default']}</Alert>
        )}

        <span className="title_and_info">
          <h2 data-testid="intro-heading">
            {texts.label}
            <ButtonModal id="infoPic" type="info-icon" modalLabels={texts.headerModal} course={courseData.courseCode} />
          </h2>
        </span>
        <p>{texts.image.choiceInfo}</p>

        <form className="Picture--Options input-label-row">
          <div className="form-group" role="radiogroup">
            <div className="form-check form-group">
              <input
                type="radio"
                id="defaultPicture"
                name="choosePicture"
                value={IMAGE_TYPE_DEFAULT_IMAGE}
                onChange={onInputTypeChanged}
                checked={isDefaultImageSelected}
              />
              <label htmlFor="defaultPicture">{` ${texts.image.firstOption} `}</label>{' '}
            </div>
            <div className="form-check form-group">
              <input
                type="radio"
                id="otherPicture"
                name="choosePicture"
                value={IMAGE_TYPE_CUSTOM_IMAGE}
                onChange={onInputTypeChanged}
                checked={!isDefaultImageSelected}
              />
              <label htmlFor="otherPicture">{` ${texts.image.secondOption} `}</label>
            </div>
          </div>
        </form>

        <div className="image-area">
          <span className="preview-pic">
            {imageInputState.previewImageUrl ? (
              <img src={imageInputState.previewImageUrl} alt={texts.image.alt} height="auto" width="300px" />
            ) : (
              <span className="empty-pic">
                <p>
                  <i>{texts.image.noChosen}</i>
                </p>
              </span>
            )}
          </span>

          {!isDefaultImageSelected && (
            <FileInput
              ref={fileInputRef}
              id="pic-upload"
              onChange={onFileInputChanged}
              accept={VALID_FILE_TYPES.join(',')}
              btnLabel={texts.image.choose}
            >
              {imageInputState.newImage && (
                <Button
                  color="secondary"
                  onClick={() => {
                    fileInputRef.current?.clearInput()
                    imageInputState.setImage(null)
                  }}
                >
                  {texts.image.reset}
                </Button>
              )}
            </FileInput>
          )}
        </div>
        {imageInputState.newImage && (
          <form>
            <div className="form-group">
              <div className={'form-check form-group input-label-row'}>
                <input
                  type="checkbox"
                  onChange={event => imageInputState.onCheckTermsChanged(event.target.checked)}
                  checked={imageInputState.termsChecked}
                  data-testid="termsAgreement"
                  id="termsAgreement"
                  name="agreeToTerms"
                  value="agree"
                />
                <label id="label-termsAgreement" htmlFor="termsAgreement">
                  {`${texts.image.agreeCheck_1} `}
                  <a href={intraImageInfoUrl} target="_blank" className="external-link" rel="noreferrer">
                    {texts.image.imagesOnTheWeb}
                  </a>{' '}
                  {`${texts.image.agreeCheck_2} `}
                </label>
              </div>
            </div>
          </form>
        )}

        {imageInputState.error && <Alert color="danger">{texts.alertMessages[imageInputState.error]}</Alert>}
      </span>

      <ControlButtons
        pageState={pageState}
        next={{
          onClick: onNext,
          disabled: disableNextButton,
          label: texts.nextButton,
        }}
      />
    </>
  )
}
