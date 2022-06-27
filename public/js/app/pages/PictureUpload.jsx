/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { Alert, Button, Col } from 'reactstrap'
import imageCompression from 'browser-image-compression'
import ButtonModal from '../components/ButtonModal'
import FileInput from '../components/FileInput'
import { ADMIN_OM_COURSE, CANCEL_PARAMETER, INTRA_IMAGE_INFO } from '../util/constants'
import { useWebContext } from '../context/WebContext'
import { replaceAdminUrlWithPublicUrl } from '../util/links'

const fileTypes = ['image/jpeg', 'image/jpg', 'image/png']

const paramsReducer = (state, action) => ({ ...state, ...action })

const errTrue = true
let noFile // must be undefined

function _validFileType(file) {
  for (let i = 0; i < fileTypes.length; i++) {
    if (file.type === fileTypes[i]) {
      return true
    }
  }
  return false
}

function PictureUpload(props) {
  const [context, setContext] = useWebContext()
  const { koppsData, hasImageNameFromApi, browserConfig, imageNameFromApi } = context
  const { introLabel, defaultImageUrl, hasChanges, setInitialImage, updateProgress } = props

  const [state, setState] = React.useReducer(paramsReducer, {
    errMsg: null,
    isError: false,
    infoMsg: null,
    isStandardImageChosen: context.isStandardImageChosen,
    newImageFile: context.newImageFile,
    newImagePath: context.newImagePath, // not a boolean but file cache to proceed between steps
  })
  const { isStandardImageChosen, newImagePath } = state
  const isNewImageUploaded = !!newImagePath

  const { courseTitleData, lang } = koppsData

  const { course_code: courseCode } = courseTitleData
  const apiImageUrl = `${browserConfig.storageUri}${imageNameFromApi}`

  React.useEffect(() => {
    let isMounted = true
    if (isMounted && typeof window !== 'undefined') {
      replaceAdminUrlWithPublicUrl()
      setInitialImage({ isStandardImageChosen, hasImageNameFromApi })
    }
    return () => (isMounted = false)
  }, [])

  // eslint-disable-next-line class-methods-use-this
  async function _compressFile(imageFile) {
    const options = {
      initialQuality: 1,
      maxSizeMB: 5,
      maxWidthOrHeight: 800, // 2*400 to keep quality of f.e., text on the picture
      useWebWorker: true,
    }
    const compressedBlob = await imageCompression(imageFile, options)
    const compressedFile = new File([compressedBlob], `compressed-image-${compressedBlob.name}`, {
      type: compressedBlob.type,
    })

    const imageFilePath = compressedFile ? window.URL.createObjectURL(compressedFile) : ''

    return { compressedFile, imageFilePath }
  }

  function _appendFileData(imageFile) {
    const formData = new FormData()
    formData.append('courseCode', courseCode)
    formData.append('file', imageFile)
    formData.append('fileExtension', imageFile.name.toLowerCase().split('.').pop())
    formData.append('pictureBy', 'Picture chosen by user')
    return formData
  }

  function _choosenNewPicture(isError, imagePath) {
    setState({
      isError,
      newImagePath: imagePath,
    })
  }

  function checkTerms() {
    const termsAgreement = document.getElementById('termsAgreement')
    setState({
      isError: !termsAgreement.checked,
      errMsg: termsAgreement.checked ? '' : 'approve_term',
    })
    return termsAgreement.checked
  }

  function resetToPrevApiPicture(ev) {
    _choosenNewPicture(!errTrue, noFile)
    const fileInput = document.querySelector('.pic-upload')
    fileInput.value = ''
  }

  function switchOption(radioEvent) {
    let infoMsg
    const isSwitchedToStandardImage = radioEvent.target.value === 'defaultPicture'
    setState({
      isStandardImageChosen: isSwitchedToStandardImage,
      isError: false,
      errMsg: undefined,
      infoMsg: undefined,
    })
    if (isSwitchedToStandardImage) {
      // if user choose to override api picture with default
      if (hasImageNameFromApi) infoMsg = 'replace_api_with_default'
    }
    setState({
      infoMsg,
    })
  }

  async function displayValidatedImage(inputEvent) {
    const [imageFile] = inputEvent.target.files
    let errorIndex
    let infoMsg
    if (imageFile) {
      if (_validFileType(imageFile)) {
        const { compressedFile, imageFilePath } = await _compressFile(imageFile)

        if (!imageFilePath) {
          _choosenNewPicture(errTrue, noFile)
          errorIndex = 'failed_compression_of_file'
        } else {
          const fileData = await _appendFileData(compressedFile)
          _choosenNewPicture(!errTrue, imageFilePath)
          setState({
            newImageFile: fileData,
          })
        }
      } else {
        if (!hasImageNameFromApi) errorIndex = 'not_correct_format_choose_another'
        else errorIndex = 'not_correct_format_return_to_api_pic'
        _choosenNewPicture(errTrue, noFile)
      }
    } else if (!hasImageNameFromApi) {
      // no new picture and no api pic available and no default chosen
      // show error and empty picture
      errorIndex = isNewImageUploaded ? undefined : 'no_file_chosen'
      const imagePath = isNewImageUploaded ? newImagePath : noFile

      _choosenNewPicture(!isNewImageUploaded, imagePath)
    } else if (hasImageNameFromApi) {
      // no new picture but still api pic available, no error
      // leave everything as it is
      _choosenNewPicture(!errTrue, newImagePath)
    }
    setState({
      errMsg: errorIndex,
      infoMsg,
    })
  }

  function tempSaveNewImageForNextStep(imageFile, newImageBlobPath, isSwitchedToStandardImage) {
    setContext({
      ...context,
      newImageFile: imageFile,
      newImagePath: newImageBlobPath,
      isStandardImageChosen: isSwitchedToStandardImage,
    })
  }

  function doNextStep(btnEvent) {
    btnEvent.preventDefault()

    let { isError: errorMayNotProceed } = state
    if (isNewImageUploaded && !isStandardImageChosen) {
      errorMayNotProceed |= !checkTerms()
    } else if (!hasImageNameFromApi && !isStandardImageChosen) {
      errorMayNotProceed = true
      setState({
        isError: true,
        errMsg: 'no_file_chosen',
      })
    }

    if (!errorMayNotProceed) {
      tempSaveNewImageForNextStep(state.newImageFile, newImagePath, isStandardImageChosen)
      updateProgress(2)
    }
  }

  return (
    <span className="Upload--Area col" key="uploadArea">
      {isStandardImageChosen && state.infoMsg ? (
        <Alert color="info">{introLabel.alertMessages[state.infoMsg]}</Alert>
      ) : (
        state.isError && state.errMsg && <Alert color="danger">{introLabel.alertMessages[state.errMsg]}</Alert>
      )}
      <span className="title_and_info">
        <h2 data-testid="intro-heading">
          {introLabel.label_step_1}
          <ButtonModal id="infoPic" type="info-icon" modalLabels={introLabel.info_image} course={courseCode} />
        </h2>
      </span>
      <p>{introLabel.image.choiceInfo}</p>
      <form className="Picture--Options input-label-row">
        <div className="form-group" role="radiogroup">
          <div className="form-check form-group">
            <input
              type="radio"
              id="defaultPicture"
              name="choosePicture"
              value="defaultPicture"
              onClick={switchOption}
              defaultChecked={isStandardImageChosen}
            />
            <label htmlFor="defaultPicture">{` ${introLabel.image.firstOption} `}</label>{' '}
          </div>
          <div className="form-check form-group">
            <input
              type="radio"
              id="otherPicture"
              name="choosePicture"
              value="otherPicture"
              onClick={switchOption}
              defaultChecked={!isStandardImageChosen}
            />
            <label htmlFor="otherPicture">{` ${introLabel.image.secondOption} `}</label>
          </div>
        </div>
      </form>
      {isStandardImageChosen ? (
        <span className="" key="picture">
          <img src={defaultImageUrl} alt={introLabel.alt.image} height="auto" width="300px" />
        </span>
      ) : (
        <span>
          <span
            id="own-picture"
            className={state.isError && state.errMsg === 'no_file_chosen' ? 'error-area' : ''}
            key="uploader"
          >
            <span className="preview-pic">
              {hasImageNameFromApi || isNewImageUploaded ? (
                <img src={newImagePath || apiImageUrl} height="auto" width="300px" alt={introLabel.alt.image} />
              ) : (
                <span className="empty-pic" aria-label={introLabel.alt.tempImage}>
                  <p>
                    <i>{introLabel.image.noChosen}</i>
                  </p>
                </span>
              )}
            </span>
            <FileInput
              id="pic-upload"
              onChange={displayValidatedImage}
              accept="image/jpg,image/jpeg,image/png"
              btnLabel={introLabel.image.choose}
            >
              {isNewImageUploaded && hasImageNameFromApi && (
                <Button color="secondary" onClick={resetToPrevApiPicture}>
                  {introLabel.image.reset}
                </Button>
              )}
            </FileInput>
          </span>
          {isNewImageUploaded && (
            <form>
              <div className="form-group">
                <div
                  className={`form-check form-group input-label-row ${
                    state.isError && state.errMsg === 'approve_term' ? 'error-area' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    onChange={checkTerms}
                    data-testid="termsAgreement"
                    id="termsAgreement"
                    name="agreeToTerms"
                    value="agree"
                  />
                  <label id="label-termsAgreement" htmlFor="termsAgreement">
                    {`${introLabel.image.agreeCheck} `}
                    <a href={INTRA_IMAGE_INFO[lang]} target="_blank" className="external-link" rel="noreferrer">
                      {introLabel.image.imagesOnTheWeb}
                    </a>
                  </label>
                </div>
              </div>
            </form>
          )}
          {state.isError && (
            <span data-testid="error-text" className="error-label">
              <p>{state.errMsg !== 'approve_term' ? introLabel.required.image : introLabel.required.agreement}</p>
            </span>
          )}
        </span>
      )}
      <span className="control-buttons">
        <Col sm="4" />
        <Col sm="4" className="btn-cancel">
          <ButtonModal
            id="cancelStep1"
            type={
              hasChanges({ isStandardImageChosen: state.isStandardImageChosen, newImagePath: state.newImagePath })
                ? 'cancel-with-modal'
                : 'cancel-without-modal'
            }
            course={courseCode}
            returnToUrl={`${ADMIN_OM_COURSE}${courseCode}${CANCEL_PARAMETER}`}
            btnLabel={introLabel.button.cancel}
            modalLabels={introLabel.info_cancel}
          />
        </Col>
        <Col sm="4" className="step-forward">
          <Button
            onClick={doNextStep}
            className="next"
            color="success"
            aria-label={introLabel.alt.step2Next}
            disabled={state.isError}
          >
            {introLabel.button.step2}
          </Button>
        </Col>
      </span>
    </span>
  )
}

export default PictureUpload
