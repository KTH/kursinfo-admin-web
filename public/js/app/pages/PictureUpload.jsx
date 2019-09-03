import { Component } from 'inferno'
import { inject, observer } from 'inferno-mobx'
import i18n from '../../../../i18n'
import Alert from 'inferno-bootstrap/lib/Alert'
import ButtonGroup from 'inferno-bootstrap/lib/ButtonGroup'
import Form from 'inferno-bootstrap/lib/Form/Form'
import Input from 'inferno-bootstrap/lib/Form/Input'
import Button from 'inferno-bootstrap/lib/Button'
import {Link} from 'inferno-router'
import Row from 'inferno-bootstrap/dist/Row'
import Col from 'inferno-bootstrap/dist/Col'
import Progress from 'inferno-bootstrap/dist/Progress'
import { KURSINFO_IMAGE_BLOB_URL } from '../util/constants'
import axios from 'axios'

let fileTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png'
]

const isErrTrue = true
let noFileAccepted // must be undefined

const _getTodayDate = (date = '') => {
  let today = date.length > 0 ? new Date(date) : new Date()
  let dd = String(today.getDate()).padStart(2, '0')
  let mm = String(today.getMonth() + 1).padStart(2, '0') // January is 0!
  let yyyy = today.getFullYear()

  return yyyy + '-' + mm + '-' + dd
}

function _validFileType (file) {
  for (let i = 0; i < fileTypes.length; i++) {
    if (file.type === fileTypes[i]) {
      return true
    }
  }
  return false
}

function _returnFileSize (number) {
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
      isDefault: false, //! this.props.adminStore.isUploadedImageInApi, // TODO: DEPENDS IF PICTURE IS CHOSEN BEFORE IN COURSEUTVECKLING
      isError: false, // todo: remove
      infoMsg: undefined,
      errMsg: undefined,
      tempFilePath: undefined, // To keep state if switchs
      // move to final step
      file: undefined,
      fileSavedDate: undefined,
      fileProgress: 0,
      hasNewUploadedImage: false,
      successMsg: undefined
    }
    this.courseCode = this.props.courseAdminData.courseTitleData.course_code
    this.isApiPicAvailable = true // this.props.adminStore.isUploadedImageInApi
    this.apiImageUrl = `${KURSINFO_IMAGE_BLOB_URL}${this.props.adminStore.imageInfo}`
    this.defaultImageUrl = this.props.imageUrl // Default

    this.updateImageDisplay = this.updateImageDisplay.bind(this)
    this.doNextStep = this.doNextStep.bind(this)
    // this.hanleUploadFile = this.hanleUploadFile.bind(this)
    // this.handleRemoveFile = this.handleRemoveFile.bind(this)
    this.isDefaultPicture = this.isDefaultPicture.bind(this)
    this.resetToPrevApiPicture = this.resetToPrevApiPicture.bind(this)
  }
  _choosenNewPicture (isError, fileUrl) {
    this.setState({
      isError: isError,
      tempFilePath: fileUrl, // ??
      fileProgress: 0
    })
  }

  isDefaultPicture (event) {
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
        this._choosenNewPicture(!isErrTrue, window.URL.createObjectURL(picFile))
        this.setState({ file: picFile })
        // return this._sendRequest(picFile)
      } else {
        if (!this.isApiPicAvailable) errorIndex = 'not_correct_format_choose_another'
        else errorIndex = 'not_correct_format_return_to_api_pic'
        this._choosenNewPicture(isErrTrue, noFileAccepted)
      }
    } else if (!this.isApiPicAvailable) { // no new picture and no api pic available and no default chosen
      // show error and empty picture
      errorIndex = isTempFile ? undefined : 'no_file_chosen'
      const tempFilePath = isTempFile ? this.state.tempFilePath : noFileAccepted

      this._choosenNewPicture(!isTempFile, tempFilePath)
    } else if (this.isApiPicAvailable) { // no new picture but still api pic available, no error
      // leave everything as it is
      this._choosenNewPicture(!isErrTrue, this.state.tempFilePath)
    }

    this.setState({errMsg: errorIndex, infoMsg})
  }

  resetToPrevApiPicture (event) {
    this._choosenNewPicture(!isErrTrue, noFileAccepted)
    let el = document.querySelector('.pic-upload')
    el.value = ''
  }

  _sendRequest (file) {
    const thisInstance = this
    let fileProgress = this.state.fileProgress
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest()
      req.upload.addEventListener('progress', event => {
        if (event.lengthComputable) {
          fileProgress = (event.loaded / event.total) * 100
          console.log(fileProgress)
          this.setState({ fileProgress: fileProgress })
        }
      })

      req.onreadystatechange = function () {
        // console.log('onreadystatechange values', values)

        if (this.readyState === 4 && this.status === 200) {
          if (file) {
            thisInstance.state.fileSavedDate = _getTodayDate()
            thisInstance.setState({
              isError: false, // todo: remove
              successMsg: 'Success', // i18n.messages[thisInstance.props.routerStore.language].messages.alert_uploaded_file,
              errMsg: undefined,
              hasNewUploadedImage: true
            })
            console.log('Ura 1', thisInstance.state)
          }
          console.log('Ura 2')
        }
      }

      let formData = new FormData()
      const metaData = this._getMetadataAndName(file.name) // this.getMetadata(this.state.isPublished ? 'published' : this.state.saved ? 'draft' : 'new')
      console.log('metaData ', metaData)
      formData.append('file', file, metaData.finalFileName)
      formData.append('courseCode', metaData.courseCode)
      formData.append('pictureid', metaData.finalFileName)
      formData.append('pictureBy', metaData.pictureBy)
      req.open('POST', `${this.props.adminStore.browserConfig.hostUrl}${this.props.adminStore.paths.storage.saveFile.uri.split(':')[0]}${metaData.finalFileName}`)
      req.send(formData)
    })
  }

  _getMetadataAndName (originFileName) {
    const fileExtension = originFileName.toLowerCase().split('.').pop()
    const { courseCode } = this
    const finalFileName = `Picture_by_own_choice_${courseCode}.${fileExtension}`
    return {
      courseCode,
      pictureBy: 'Picture chosen by user',
      fileExtension,
      finalFileName
    }
  }

  doNextStep (event) {
    event.preventDefault()
    const isNew = this.state.tempFilePath
    const resultPicUrl = isNew
        ? this.state.tempFilePath
        : this.state.isDefault ? this.defaultImageUrl : this.apiImageUrl
    console.log('isNew', isNew, 'ResultPic', resultPicUrl)
    if (isNew) {
      console.log('Wowowo', this.state.fileObj)
      // this._sendRequest(this.state.fileObj, event)
    }

    this.props.nextStep(isNew, resultPicUrl, 2)
  }

  render ({adminStore}) {
    const { sellingTextLabels, imageUrl, courseAdminData } = this.props
    const { apiImageUrl, defaultImageUrl } = this
    // const path = this.props.adminStore.browserConfig.proxyPrefixPath.uri
    return (
      <span className='Upload--Area col' key='uploadArea'>
        <p>{sellingTextLabels.edit_picture_desc}</p>
        <h2>{sellingTextLabels.label_step_1}</h2>
        <p>{sellingTextLabels.label_choose_picture}</p>
        {this.state.isDefault
          ? this.state.infoMsg ? <Alert color='info'>{this.state.infoMsg}</Alert> : ''
          : this.state.successMsg || this.state.isError && this.state.errMsg
              ? <Alert color={this.state.successMsg ? 'success' : 'danger'}>{this.state.errMsg}</Alert> : ''
        }
        <form className='picture-choice'>
          <span role='radiogroup'>
            <label for='defaultPicture'>
              <input type='radio' id='defaultPicture' name='choosePicture' value='defaultPicture'
                onClick={this.isDefaultPicture} checked={this.state.isDefault} />{' '}
              {sellingTextLabels.label_radio_button_1}
            </label> <br />
            <label for='otherPicture'>
              <input type='radio' id='otherPicture' name='choosePicture' value='otherPicture'
                onClick={this.isDefaultPicture} checked={!this.state.isDefault} /> {' '}
              {sellingTextLabels.label_radio_button_2}
            </label> <br />
          </span>
        </form>
        {this.state.isDefault
        ? <span className='' key='picture'>
          <h3>{sellingTextLabels.label_edit_picture}</h3>
          <img src={defaultImageUrl} alt={sellingTextLabels.altLabel.image} height='auto' width='300px' />
        </span>
        : <span className='own-picture' key='uploader'>
          <span className='preview-pic'>
              {this.isApiPicAvailable || this.state.tempFilePath
                ? <img src={this.state.tempFilePath ? this.state.tempFilePath : apiImageUrl}
                  alt={sellingTextLabels.altLabel.image} height='auto' width='300px' />
                : ''
              }
            {this.state.tempFilePath && this.isApiPicAvailable
                ? <Button color='secondary' onClick={this.resetToPrevApiPicture}>{sellingTextLabels.chooseImage.reset_image}</Button>
                : ''
            }
          </span>
          <span className='file-uploader-section'>
            <label for='pic-upload' className='label-pic-upload'>
              <h4>{sellingTextLabels.chooseImage.choose_file}</h4>
              <input type='file' id='pic-upload' name='pic-upload' className='pic-upload'
                accept='image/jpg,image/jpeg,image/png'
                onChange={this.updateImageDisplay}
                />
            </label>
            <p>
              <i>{this.state.tempFilePath
                ? sellingTextLabels.chooseImage.file_name + ` Picture_by_own_choice_${this.courseCode}`
                : sellingTextLabels.chooseImage.no_choosen_file}
              </i>
            </p>
          </span>
        </span>
        }
        <span>
          <div className='text-center'>{this.state.fileProgress}%</div>
          <Progress value={this.state.fileProgress} />
        </span>
        <span className='control-buttons'>
          <Col sm='4'>
          </Col>
          <Col sm='4' className='btn-cancel'>
            <Link to={`/kursinfoadmin/kurser/kurs/edit/${courseAdminData.courseTitleData.course_code}?l=${courseAdminData.lang}`}
              className='btn btn-secondary text-center' alt={sellingTextLabels.altLabel.button_cancel}>
              {sellingTextLabels.sellingTextButtons.button_cancel}
            </Link>
          </Col>
          <Col sm='4' className='btn-next'>
            <Button onClick={this.doNextStep} color='success' alt={sellingTextLabels.altLabel.button_edit_text}
              disabled={this.state.isError}>
              {sellingTextLabels.sellingTextButtons.button_edit_text}
            </Button>
          </Col>
        </span>
      </span>
    )
  }

}

export default PictureUpload
