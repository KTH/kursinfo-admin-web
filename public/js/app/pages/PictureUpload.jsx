import { Component } from 'inferno'
import { inject, observer } from 'inferno-mobx'
import Alert from 'inferno-bootstrap/lib/Alert'
import Button from 'inferno-bootstrap/lib/Button'
import ButtonModal from '../components/ButtonModal.jsx'
import Col from 'inferno-bootstrap/dist/Col'

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
      isDefault: this.props.adminStore.isDefaultChosen, // false, //! this.props.adminStore.isUploadedImageInApi, // TODO: DEPENDS IF PICTURE IS CHOSEN BEFORE IN COURSEUTVECKLING
      isError: false,
      infoMsg: undefined,
      tempFilePath: this.props.adminStore.tempImagePath
    }
    this.courseCode = this.props.koppsData.courseTitleData.course_code
    this.isApiPicAvailable = this.props.adminStore.isApiPicAvailable
    this.apiImageUrl = `${this.props.adminStore.browserConfig.storageUri}${this.props.adminStore.imageNameFromApi}`
    this.defaultImageUrl = this.props.defaultImageUrl // Default

    this.displayValidatedPic = this.displayValidatedPic.bind(this)
    this.doNextStep = this.doNextStep.bind(this)
    this.checkTerms = this.checkTerms.bind(this)
    // this.hanleUploadFile = this.hanleUploadFile.bind(this)
    // this.handleRemoveFile = this.handleRemoveFile.bind(this)
    this.switchOption = this.switchOption.bind(this)
    this.resetToPrevApiPicture = this.resetToPrevApiPicture.bind(this)
  }
  _getFileData (file) {
    let formData = new FormData()
    formData.append('file', file)
    formData.append('courseCode', this.courseCode)
    formData.append('fileExtension', file.name.toLowerCase().split('.').pop())
    formData.append('pictureBy', 'Picture chosen by user')
    return formData
  }

  _choosenNewPicture (isError, fileUrl) { // ??
    this.setState({
      isError: isError,
      tempFilePath: fileUrl
    })
  }

  checkTerms () {
    // const isNew = this.state.tempFilePath
    const termsAgreement = document.getElementById('termsAgreement')// event.target.checked
    this.setState({
      isError: !termsAgreement.checked,
      errMsg: termsAgreement.checked ? '' : 'approve_term'
    })
    return termsAgreement.checked
  }

  resetToPrevApiPicture (event) {
    this._choosenNewPicture(!errTrue, noFile)
    let el = document.querySelector('.pic-upload')
    el.value = ''
  }

  switchOption (event) {
    let infoMsg
    const isDefaultPic = event.target.value === 'defaultPicture'
    this.setState({
      isDefault: isDefaultPic,
      isError: false,
      errMsg: undefined,
      infoMsg: undefined
    })
    if (isDefaultPic) {
        // if user choose to override api picture
      if (this.isApiPicAvailable) infoMsg = this.state.tempFilePath ? 'replace_all_with_default' : 'replace_api_with_default'
        // if user choose to override new picture
      else if (this.state.tempFilePath) infoMsg = 'replace_new_with_default'
    }
    this.setState({infoMsg})
  }

  displayValidatedPic (event) {
    const picFile = event.target.files[0]
    const isTempFile = this.state.tempFilePath
    let errorIndex, infoMsg
    if (picFile) {
      if (_validFileType(picFile)) {
        this._choosenNewPicture(!errTrue, window.URL.createObjectURL(picFile))
        this.setState({ newImage: this._getFileData(picFile) })
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

  doNextStep (event) {
    event.preventDefault()
    const isNew = this.state.tempFilePath
    if (isNew) {
      this.checkTerms()
    } else if (!this.isApiPicAvailable && !this.state.isDefault) {
      this.setState({isError: true, errMsg: 'no_file_chosen'})
    }
    if (!this.state.isError) {
      this.props.adminStore.tempSaveNewImage(this.state.newImage, isNew, this.state.isDefault)
      const states = {
        progress: 2
      }
      this.props.updateParent(states)
    }
  }

  render ({adminStore}) {
    const { introLabel } = this.props
    const { apiImageUrl, defaultImageUrl } = this
    // const path = this.props.adminStore.browserConfig.proxyPrefixPath.uri
    return (
      <span className='Upload--Area col' key='uploadArea'>
        <p>{introLabel.step_1_desc}</p>
        {this.state.isDefault && this.state.infoMsg
          ? <Alert color='info'>{introLabel.alertMessages[this.state.infoMsg]}</Alert>
          : this.state.isError && this.state.errMsg
              ? <Alert color='danger'>{introLabel.alertMessages[this.state.errMsg]}</Alert> : ''
        }
        <span className='title_and_info'>
          <h2>{introLabel.label_step_1}</h2> {' '}
          <ButtonModal id='info' step={1} infoText={introLabel.info_image} course={this.courseCode} />
        </span>
        <p>{introLabel.image.choiceInfo}</p>
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
          <span id='own-picture' className={this.state.isError && this.state.errMsg === 'no_file_chosen' ? 'error-area' : ''} key='uploader'>
            <span className='preview-pic'>

              {this.isApiPicAvailable || this.state.tempFilePath
                ? <img src={this.state.tempFilePath || apiImageUrl} height='auto' width='300px'
                  alt={introLabel.alt.image} />
                : <span className='empty-pic' alt={introLabel.alt.tempImage}>
                  <p><i>{introLabel.image.noChosen}</i></p>
                </span>
              }
            </span>
            <span className='file-uploader-section'>

              <label for='pic-upload' className='btn btn-secondary'>
                <h4>{introLabel.image.choose}</h4>
                <input type='file' id='pic-upload' name='pic-upload' className='pic-upload'
                  accept='image/jpg,image/jpeg,image/png'
                  onChange={this.displayValidatedPic}
                  />
              </label>

              {this.state.tempFilePath && this.isApiPicAvailable
                  ? <Button color='secondary' onClick={this.resetToPrevApiPicture}>{introLabel.image.reset}</Button>
                  : ''
              }
            </span>
          </span>
          {this.state.tempFilePath
          ? <span className={`input-label-row ${this.state.isError && this.state.errMsg === 'approve_term' ? 'error-area' : ''}`}>
            <input type='checkbox' onChange={this.checkTerms} id='termsAgreement' name='agreeToTerms' value='agree' />
            <label for='termsAgreement'>{introLabel.image.agreeCheck}</label>
          </span>
          : ''
          }
          <span className={this.state.isError ? 'error-label' : 'no-error'}>
            <p>{introLabel.obligatory}</p>
          </span>
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
