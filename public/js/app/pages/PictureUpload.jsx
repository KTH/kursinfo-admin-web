/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { Alert, Button, Col } from 'reactstrap'
import imageCompression from 'browser-image-compression'
import ButtonModal from '../components/ButtonModal'
import FileInput from '../components/FileInput'
import { ADMIN_OM_COURSE, CANCEL_PARAMETER, INTRA_IMAGE_INFO } from '../util/constants'
import { useWebContext } from '../context/WebContext'

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

  const [state, setState] = React.useReducer(paramsReducer, {
    errMsg: undefined,
    isError: false,
    infoMsg: undefined,
    newImage: context.newImageFile,
    isDefault: context.isDefaultChosen,
    tempFilePath: context.tempImagePath, // not a boolean but file cache to proceed between steps
  })

  const { koppsData, isApiPicAvailable, browserConfig, imageNameFromApi } = context

  const courseCode = koppsData.courseTitleData.course_code
  const { lang } = koppsData
  const apiImageUrl = `${browserConfig.storageUri}${imageNameFromApi}`
  const { introLabel, defaultImageUrl } = props

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

    formData.append('file', imageFile)
    formData.append('courseCode', courseCode)
    formData.append('fileExtension', imageFile.name.toLowerCase().split('.').pop())
    formData.append('pictureBy', 'Picture chosen by user')
    return formData
  }

  function _choosenNewPicture(isError, fileUrl) {
    setState({
      isError,
      tempFilePath: fileUrl,
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

  function resetToPrevApiPicture(event) {
    _choosenNewPicture(!errTrue, noFile)
    const fileInput = document.querySelector('.pic-upload')
    fileInput.value = ''
  }

  function switchOption(event) {
    let infoMsg
    const isDefaultPic = event.target.value === 'defaultPicture'
    setState({
      isDefault: isDefaultPic,
      isError: false,
      errMsg: undefined,
      infoMsg: undefined,
    })
    if (isDefaultPic) {
      // if user choose to override api picture with default
      if (isApiPicAvailable) infoMsg = 'replace_api_with_default'
    }
    setState({
      infoMsg,
    })
  }

  async function displayValidatedPic(event) {
    const picFile = event.target.files[0]
    const isTempFile = state.tempFilePath
    let errorIndex
    let infoMsg
    if (picFile) {
      if (_validFileType(picFile)) {
        const { compressedFile, imageFilePath } = await _compressFile(picFile)
        if (!imageFilePath) {
          _choosenNewPicture(errTrue, noFile)
          errorIndex = 'failed_compression_of_file'
        } else {
          const fileData = await _appendFileData(compressedFile)
          _choosenNewPicture(!errTrue, imageFilePath)
          setState({
            newImage: fileData,
          })
        }
      } else {
        if (!isApiPicAvailable) errorIndex = 'not_correct_format_choose_another'
        else errorIndex = 'not_correct_format_return_to_api_pic'
        _choosenNewPicture(errTrue, noFile)
      }
    } else if (!isApiPicAvailable) {
      // no new picture and no api pic available and no default chosen
      // show error and empty picture
      errorIndex = isTempFile ? undefined : 'no_file_chosen'
      const tempFilePath = isTempFile ? state.tempFilePath : noFile

      _choosenNewPicture(!isTempFile, tempFilePath)
    } else if (isApiPicAvailable) {
      // no new picture but still api pic available, no error
      // leave everything as it is
      _choosenNewPicture(!errTrue, state.tempFilePath)
    }

    setState({
      errMsg: errorIndex,
      infoMsg,
    })
  }

  function tempSaveNewImage(imageFile, tempImagePath, isDefaultChosen) {
    setContext({ ...context, imageFile, tempImagePath, isDefaultChosen })
  }

  function doNextStep(event) {
    event.preventDefault()

    const { isDefault, tempFilePath } = state
    let { isError: errorMayNotProceed } = state
    if (tempFilePath && !isDefault) {
      errorMayNotProceed |= !checkTerms()
    } else if (!isApiPicAvailable && !isDefault) {
      errorMayNotProceed = true
      setState({
        isError: true,
        errMsg: 'no_file_chosen',
      })
    }

    if (!errorMayNotProceed) {
      tempSaveNewImage(state.newImage, tempFilePath, isDefault)
      props.updateParent({
        progress: 2,
      })
    }
  }

  return (
    <span className="Upload--Area col" key="uploadArea">
      {state.isDefault && state.infoMsg ? (
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
        <span role="radiogroup">
          <label htmlFor="defaultPicture">
            <input
              type="radio"
              id="defaultPicture"
              name="choosePicture"
              value="defaultPicture"
              onClick={switchOption}
              defaultChecked={state.isDefault}
            />
            {` ${introLabel.image.firstOption} `}
          </label>
          <br />
          <label htmlFor="otherPicture">
            <input
              type="radio"
              id="otherPicture"
              name="choosePicture"
              value="otherPicture"
              onClick={switchOption}
              defaultChecked={!state.isDefault}
            />
            {` ${introLabel.image.secondOption} `}
          </label>
          <br />
        </span>
      </form>
      {state.isDefault ? (
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
              {isApiPicAvailable || state.tempFilePath ? (
                <img src={state.tempFilePath || apiImageUrl} height="auto" width="300px" alt={introLabel.alt.image} />
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
              onChange={displayValidatedPic}
              accept="image/jpg,image/jpeg,image/png"
              btnLabel={introLabel.image.choose}
            >
              {state.tempFilePath && isApiPicAvailable && (
                <Button color="secondary" onClick={resetToPrevApiPicture}>
                  {introLabel.image.reset}
                </Button>
              )}
            </FileInput>
          </span>
          {state.tempFilePath && (
            <span className={`input-label-row ${state.isError && state.errMsg === 'approve_term' ? 'error-area' : ''}`}>
              <input
                type="checkbox"
                onChange={checkTerms}
                data-testid="termsAgreement"
                id="termsAgreement"
                name="agreeToTerms"
                value="agree"
              />
              <label htmlFor="termsAgreement">
                {`${introLabel.image.agreeCheck} `}
                <a href={INTRA_IMAGE_INFO[lang]} target="_blank" className="external-link" rel="noreferrer">
                  {introLabel.image.imagesOnTheWeb}
                </a>
              </label>
            </span>
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
            type="cancel"
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
