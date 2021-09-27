/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Alert, Button, Col } from 'reactstrap'
import imageCompression from 'browser-image-compression'
import ButtonModal from '../components/ButtonModal'
import FileInput from '../components/FileInput'
import { ADMIN_OM_COURSE, CANCEL_PARAMETER, INTRA_IMAGE_INFO } from '../util/constants'

const fileTypes = ['image/jpeg', 'image/jpg', 'image/png']

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

@inject(['adminStore'])
@observer
class PictureUpload extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errMsg: undefined,
      newImage: this.props.adminStore.newImageFile,
      isDefault: this.props.adminStore.isDefaultChosen,
      isError: false,
      infoMsg: undefined,
      tempFilePath: this.props.adminStore.tempImagePath, // not a boolean but file cache to proceed between steps
    }
    this.courseCode = this.props.koppsData.courseTitleData.course_code
    this.lang = this.props.koppsData.lang
    this.isApiPicAvailable = this.props.adminStore.isApiPicAvailable
    this.apiImageUrl = `${this.props.adminStore.browserConfig.storageUri}${this.props.adminStore.imageNameFromApi}`
    this.defaultImageUrl = this.props.defaultImageUrl // Default

    this.checkTerms = this.checkTerms.bind(this)
    this.displayValidatedPic = this.displayValidatedPic.bind(this)
    this.doNextStep = this.doNextStep.bind(this)
    this.switchOption = this.switchOption.bind(this)
    this.resetToPrevApiPicture = this.resetToPrevApiPicture.bind(this)
  }

  // eslint-disable-next-line class-methods-use-this
  async _compressFile(imageFile) {
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

  _appendFileData(imageFile) {
    const formData = new FormData()

    formData.append('file', imageFile)
    formData.append('courseCode', this.courseCode)
    formData.append('fileExtension', imageFile.name.toLowerCase().split('.').pop())
    formData.append('pictureBy', 'Picture chosen by user')
    return formData
  }

  _choosenNewPicture(isError, fileUrl) {
    this.setState({
      isError,
      tempFilePath: fileUrl,
    })
  }

  checkTerms() {
    const termsAgreement = document.getElementById('termsAgreement')
    this.setState({
      isError: !termsAgreement.checked,
      errMsg: termsAgreement.checked ? '' : 'approve_term',
    })
    return termsAgreement.checked
  }

  resetToPrevApiPicture(event) {
    this._choosenNewPicture(!errTrue, noFile)
    const fileInput = document.querySelector('.pic-upload')
    fileInput.value = ''
  }

  switchOption(event) {
    let infoMsg
    const isDefaultPic = event.target.value === 'defaultPicture'
    this.setState({
      isDefault: isDefaultPic,
      isError: false,
      errMsg: undefined,
      infoMsg: undefined,
    })
    if (isDefaultPic) {
      // if user choose to override api picture with default
      if (this.isApiPicAvailable) infoMsg = 'replace_api_with_default'
    }
    this.setState({ infoMsg })
  }

  async displayValidatedPic(event) {
    const picFile = event.target.files[0]
    const isTempFile = this.state.tempFilePath
    let errorIndex
    let infoMsg
    if (picFile) {
      if (_validFileType(picFile)) {
        const { compressedFile, imageFilePath } = await this._compressFile(picFile)
        if (!imageFilePath) {
          this._choosenNewPicture(errTrue, noFile)
          errorIndex = 'failed_compression_of_file'
        } else {
          const fileData = await this._appendFileData(compressedFile)
          this._choosenNewPicture(!errTrue, imageFilePath)
          this.setState({ newImage: fileData })
        }
      } else {
        if (!this.isApiPicAvailable) errorIndex = 'not_correct_format_choose_another'
        else errorIndex = 'not_correct_format_return_to_api_pic'
        this._choosenNewPicture(errTrue, noFile)
      }
    } else if (!this.isApiPicAvailable) {
      // no new picture and no api pic available and no default chosen
      // show error and empty picture
      errorIndex = isTempFile ? undefined : 'no_file_chosen'
      const tempFilePath = isTempFile ? this.state.tempFilePath : noFile

      this._choosenNewPicture(!isTempFile, tempFilePath)
    } else if (this.isApiPicAvailable) {
      // no new picture but still api pic available, no error
      // leave everything as it is
      this._choosenNewPicture(!errTrue, this.state.tempFilePath)
    }

    this.setState({ errMsg: errorIndex, infoMsg })
  }

  doNextStep(event) {
    event.preventDefault()
    const { isDefault, tempFilePath } = this.state
    let { isError: errorMayNotProceed } = this.state
    if (tempFilePath && !isDefault) {
      errorMayNotProceed |= !this.checkTerms()
    } else if (!this.isApiPicAvailable && !isDefault) {
      errorMayNotProceed = true
      this.setState({ isError: true, errMsg: 'no_file_chosen' })
    }
    if (!errorMayNotProceed) {
      this.props.adminStore.tempSaveNewImage(this.state.newImage, tempFilePath, isDefault)
      this.props.updateParent({
        progress: 2,
      })
    }
  }

  render() {
    const { introLabel } = this.props
    const { apiImageUrl, defaultImageUrl, lang } = this
    return (
      <span className="Upload--Area col" key="uploadArea">
        {this.state.isDefault && this.state.infoMsg ? (
          <Alert color="info">{introLabel.alertMessages[this.state.infoMsg]}</Alert>
        ) : (
          this.state.isError &&
          this.state.errMsg && <Alert color="danger">{introLabel.alertMessages[this.state.errMsg]}</Alert>
        )}
        <span className="title_and_info">
          <h2 data-testid="intro-heading">
            {introLabel.label_step_1}
            <ButtonModal id="infoPic" type="info-icon" modalLabels={introLabel.info_image} course={this.courseCode} />
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
                onClick={this.switchOption}
                defaultChecked={this.state.isDefault}
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
                onClick={this.switchOption}
                defaultChecked={!this.state.isDefault}
              />
              {` ${introLabel.image.secondOption} `}
            </label>
            <br />
          </span>
        </form>
        {this.state.isDefault ? (
          <span className="" key="picture">
            <img src={defaultImageUrl} alt={introLabel.alt.image} height="auto" width="300px" />
          </span>
        ) : (
          <span>
            <span
              id="own-picture"
              className={this.state.isError && this.state.errMsg === 'no_file_chosen' ? 'error-area' : ''}
              key="uploader"
            >
              <span className="preview-pic">
                {this.isApiPicAvailable || this.state.tempFilePath ? (
                  <img
                    src={this.state.tempFilePath || apiImageUrl}
                    height="auto"
                    width="300px"
                    alt={introLabel.alt.image}
                  />
                ) : (
                  <span className="empty-pic" alt={introLabel.alt.tempImage}>
                    <p>
                      <i>{introLabel.image.noChosen}</i>
                    </p>
                  </span>
                )}
              </span>
              <FileInput
                id="pic-upload"
                onChange={this.displayValidatedPic}
                accept="image/jpg,image/jpeg,image/png"
                btnLabel={introLabel.image.choose}
              >
                {this.state.tempFilePath && this.isApiPicAvailable && (
                  <Button color="secondary" onClick={this.resetToPrevApiPicture}>
                    {introLabel.image.reset}
                  </Button>
                )}
              </FileInput>
            </span>
            {this.state.tempFilePath && (
              <span
                className={`input-label-row ${
                  this.state.isError && this.state.errMsg === 'approve_term' ? 'error-area' : ''
                }`}
              >
                <input
                  type="checkbox"
                  onChange={this.checkTerms}
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
            {this.state.isError && (
              <span data-testid="error-text" className="error-label">
                <p>
                  {this.state.errMsg !== 'approve_term' ? introLabel.required.image : introLabel.required.agreement}
                </p>
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
              course={this.courseCode}
              returnToUrl={`${ADMIN_OM_COURSE}${this.courseCode}${CANCEL_PARAMETER}`}
              btnLabel={introLabel.button.cancel}
              modalLabels={introLabel.info_cancel}
            />
          </Col>
          <Col sm="4" className="step-forward">
            <Button
              onClick={this.doNextStep}
              className="next"
              color="success"
              alt={introLabel.alt.step2Next}
              disabled={this.state.isError}
            >
              {introLabel.button.step2}
            </Button>
          </Col>
        </span>
      </span>
    )
  }
}

export default PictureUpload
