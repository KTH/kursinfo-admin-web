import { Component } from 'inferno'
import { inject, observer } from 'inferno-mobx'
import i18n from '../../../../i18n'
import Alert from 'inferno-bootstrap/lib/Alert'
import Button from 'inferno-bootstrap/lib/Button'
import ButtonModal from '../components/ButtonModal.jsx'
import Col from 'inferno-bootstrap/dist/Col'
import { KURSINFO_IMAGE_BLOB_URL } from '../util/constants'

let fileTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png'
]

const errTrue = true
let noFile // must be undefined

function _validFileType (file) {
  for (let i = 0; i < fileTypes.length; i++) {
    if (file.type === fileTypes[i]) {
      return true
    }
  }
  return false
}

function _returnFileSize (number) { // TO DO OPTIMISE PICTURE IF TOO BIG BEFORE UPLOAD
  if (number < 1024) {
    return number + 'bytes'
  } else if (number > 1024 && number < 1048576) {
    return (number / 1024).toFixed(1) + 'KB'
  } else if (number > 1048576) {
    return (number / 1048576).toFixed(1) + 'MB'
  }
}

@inject(['adminStore']) @observer
class PictureUpload extends Component {
  constructor (props) {
    super(props)
    this.state = {
      errMsg: undefined,
      newImage: this.props.adminStore.newImageFile,
      isDefault: false, //! this.props.adminStore.isUploadedImageInApi, // TODO: DEPENDS IF PICTURE IS CHOSEN BEFORE IN COURSEUTVECKLING
      isError: false, // todo: remove
      isAgree: false,
      infoMsg: undefined,
      tempFilePath: this.props.adminStore.tempImagePath, // remove
      // move to final step
      // fileSavedDate: undefined,
      fileProgress: 0,
      hasNewUploadedImage: false,
      successMsg: undefined
    }
    this.courseCode = this.props.koppsData.courseTitleData.course_code
    this.isApiPicAvailable = true // this.props.adminStore.isUploadedImageInApi
    this.apiImageUrl = `${KURSINFO_IMAGE_BLOB_URL}${this.props.adminStore.imageInfo}`
    this.defaultImageUrl = this.props.imageUrl // Default

    this.checkTerms = this.checkTerms.bind(this)
    this.updateImageDisplay = this.updateImageDisplay.bind(this)
    this.doNextStep = this.doNextStep.bind(this)
    // this.hanleUploadFile = this.hanleUploadFile.bind(this)
    // this.handleRemoveFile = this.handleRemoveFile.bind(this)
    this.switchOption = this.switchOption.bind(this)
    this.resetToPrevApiPicture = this.resetToPrevApiPicture.bind(this)
  }

  checkTerms (event) {
    this.setState({
      isAgree: event.target.checked
    })
  }

  _choosenNewPicture (isError, fileUrl) { // ??
    this.setState({
      isError: isError,
      tempFilePath: fileUrl
    })
  }

  switchOption (event) {
    let infoMsg
    const isDefaultPic = event.target.value === 'defaultPicture'
    this.setState({
      isDefault: isDefaultPic
    })
    if (isDefaultPic) {
        // if user choose to override api picture
      if (this.isApiPicAvailable) infoMsg = this.state.tempFilePath ? 'replace_all_with_default' : 'replace_api_with_default'
        // if user choose to override api picture
      else if (this.state.tempFilePath) infoMsg = 'replace_new_with_default'
    }
    this.setState({infoMsg})
  }

  updateImageDisplay (event) {
    const picFile = event.target.files[0]
    const isTempFile = this.state.tempFilePath
    let errorIndex, infoMsg
    if (picFile) {
      if (_validFileType(picFile)) {
        this._choosenNewPicture(!errTrue, window.URL.createObjectURL(picFile))
        this.setState({ image: this._getFileData(picFile) })
      } else {
        if (!this.isApiPicAvailable) errorIndex = 'not_correct_format_choose_another'
        else errorIndex = 'not_correct_format_return_to_api_pic'
        this._choosenNewPicture(errTrue, noFile)
      }
    } else if (!this.isApiPicAvailable) { // no new picture and no api pic available and no default chosen
      // show error and empty picture
      errorIndex = isTempFile ? undefined : 'no_file_chosen'
      const tempFilePath = isTempFile ? this.state.tempFilePath : noFile

      this._choosenNewPicture(!isTempFile, tempFilePath)
    } else if (this.isApiPicAvailable) { // no new picture but still api pic available, no error
      // leave everything as it is
      this._choosenNewPicture(!errTrue, this.state.tempFilePath)
    }

    this.setState({errMsg: errorIndex, infoMsg})
  }

  resetToPrevApiPicture (event) {
    this._choosenNewPicture(!errTrue, noFile)
    console.log('reset', this.state.tempFilePath)
    let el = document.querySelector('.pic-upload')
    el.value = ''
  }

  _getFileData (file) {
    let formData = new FormData()
    formData.append('file', file)
    formData.append('courseCode', this.courseCode)
    formData.append('fileExtension', file.name.toLowerCase().split('.').pop())
    formData.append('pictureBy', 'Picture chosen by user')
    return formData
  }

  doNextStep (event) {
    event.preventDefault()
    const isNew = this.state.tempFilePath

    // const resultPicUrl = isNew
    //     ? this.state.tempFilePath
    //     : this.state.isDefault ? this.defaultImageUrl : this.apiImageUrl
    if (isNew) {
      this.setState({
        isError: !this.state.isAgree,
        errMsg: this.state.isAgree ? '' : 'approve_term'
      })
    }
    if (!this.state.isError) {
      this.props.adminStore.addNewImage(this.state.image, this.state.tempFilePath)
      const states = {
        // imageFile: this.state.image, // for preview
        progress: 2
      }
      // this.props.sendTempImage(this.state.image)
      this.props.updateParent(states) // be replaced by send temp image or in parent look at step
    }
  }

  render ({adminStore}) {
    const { introLabel, imageUrl, koppsData } = this.props
    const { apiImageUrl, defaultImageUrl } = this
    // const path = this.props.adminStore.browserConfig.proxyPrefixPath.uri
    return (
      <span className='Upload--Area col' key='uploadArea'>
        <p>{introLabel.step_1_desc}</p>
        <span className='title_and_info'>
          <h2>{introLabel.label_step_1}</h2> {' '}
          <ButtonModal id='info' step={1} infoText={introLabel.info_image} course={this.courseCode} />
        </span>
        <p>{introLabel.image.choiceInfo}</p>
        {this.state.isDefault
          ? this.state.infoMsg ? <Alert color='info'>{introLabel.alertMessages[this.state.infoMsg]}</Alert> : ''
          : this.state.successMsg || this.state.isError && this.state.errMsg
              ? <Alert color={this.state.successMsg ? 'success' : 'danger'}>{introLabel.alertMessages[this.state.errMsg]}</Alert> : ''
        }
        <form className='Picture--Options input-label-row'>
          <span role='radiogroup'>
            <label for='defaultPicture'>
              <input type='radio' id='defaultPicture' name='choosePicture' value='defaultPicture'
                onClick={this.switchOption} checked={this.state.isDefault} />{' '}
              {introLabel.image.firstOption}
            </label> <br />
            <label for='otherPicture'>
              <input type='radio' id='otherPicture' name='choosePicture' value='otherPicture'
                onClick={this.switchOption} checked={!this.state.isDefault} /> {' '}
              {introLabel.image.secondOption}
            </label> <br />
          </span>
        </form>
        {this.state.isDefault
        ? <span className='' key='picture'>
          <h3>{introLabel.label_edit_picture}</h3>
          <img src={defaultImageUrl} alt={introLabel.alt.image} height='auto' width='300px' />
        </span>
        : <span>
          <span className='own-picture' key='uploader'>
            <span className='preview-pic'>
              {this.isApiPicAvailable || this.state.tempFilePath
                ? <img src={this.state.tempFilePath ? this.state.tempFilePath : apiImageUrl} height='auto' width='300px'
                  alt={introLabel.alt.image} />
                : <span className='empty-pic' alt={introLabel.alt.tempImage}>
                  <p><i>{introLabel.image.noChosen}</i></p>
                </span>
              }
            </span>
            <span className='file-uploader-section'>
              <label for='pic-upload' className='label-pic-upload'>
                <h4>{introLabel.image.choose}</h4>
                <input type='file' id='pic-upload' name='pic-upload' className='pic-upload'
                  accept='image/jpg,image/jpeg,image/png'
                  onChange={this.updateImageDisplay}
                  />
              </label>
              {this.state.tempFilePath && this.isApiPicAvailable
                  ? <Button color='secondary' onClick={this.resetToPrevApiPicture}>{introLabel.image.reset}</Button>
                  : ''
              }
            </span>
          </span>
          {this.state.tempFilePath
          ? <span className='input-label-row'>
            <input type='checkbox' onClick={this.checkTerms} id='termsAgreement' name='agreeToTerms' value='agree' />
            <label for='termsAgreement'>{introLabel.image.agreeCheck}</label>
          </span>
          : ''
          }
        </span>
        }
        <span className='control-buttons'>
          <Col sm='4'>
          </Col>
          <Col sm='4' className='btn-cancel'>
            <ButtonModal id='cancel' step={1} course={this.courseCode} buttonLabel={introLabel.button.cancel} infoText={introLabel.info_cancel} />
          </Col>
          <Col sm='4' className='btn-next'>
            <Button onClick={this.doNextStep} color='success' alt={introLabel.alt.step2Next}
              disabled={this.state.isError}>
              {introLabel.button.step2}
            </Button>
          </Col>
        </span>
      </span>
    )
  }

}

export default PictureUpload
