import { Component } from 'inferno'
import { inject, observer } from 'inferno-mobx'
import i18n from '../../../../i18n'

import ButtonGroup from 'inferno-bootstrap/lib/ButtonGroup'
import Form from 'inferno-bootstrap/lib/Form/Form'
import Input from 'inferno-bootstrap/lib/Form/Input'
import Button from 'inferno-bootstrap/lib/Button'
import {Link} from 'inferno-router'
import Row from 'inferno-bootstrap/dist/Row'
import Col from 'inferno-bootstrap/dist/Col'
import { KURSINFO_IMAGE_BLOB_URL } from '../util/constants'

var fileTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png'
]

function _validFileType (file) {
  for (var i = 0; i < fileTypes.length; i++) {
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
      isError: false,
      tempFilePath: undefined, // To keep state if switchs
      notValid: false,
      isNewUploaded: false, // False
    //   isPreviousChosen: false,
      isDefault: false, //! this.props.adminStore.isUploadedImageInApi, // TODO: DEPENDS IF PICTURE IS CHOSEN BEFORE IN COURSEUTVECKLING
      isApiPic: true// this.props.adminStore.isUploadedImageInApi // TODO: DEPENDS IF PICTURE IS CHOSEN BEFORE
    }
    this.isApiPicAvailable = true// this.props.adminStore.isUploadedImageInApi
    this.apiImageUrl = `${KURSINFO_IMAGE_BLOB_URL}${this.props.adminStore.imageInfo}`
    this.defaultImageUrl = this.props.imageUrl // Default
    this.finalFileName = 'Picture_' + this.props.courseAdminData.courseTitleData.course_code // Never changes to replace previous files

    this.updateImageDisplay = this.updateImageDisplay.bind(this)
    this.doNextStep = this.doNextStep.bind(this)
    this.hanleUploadFile = this.hanleUploadFile.bind(this)
    this.handleRemoveFile = this.handleRemoveFile.bind(this)
    this.isDefaultPicture = this.isDefaultPicture.bind(this)
    this.usePrevApiPicture = this.usePrevApiPicture.bind(this)
    // this.useUploadedPicture = this.useUploadedPicture.bind(this)
  }
  _changeState (isDefaultPic) {
    this.setState({
      isDefault: isDefaultPic,
      isApiPic: !isDefaultPic
    })
  }
  _choosenNewPicture (isNew) {
    this.setState({
      isNewUploaded: isNew
    //   isPreviousChosen: !isNew
    })
  }

  updateImageDisplay (event) {
    // var preview = document.querySelector('.preview-pic')
    // while (preview.firstChild) {
    //   preview.removeChild(preview.firstChild)
    // }
    var picFile = event.target.files[0]
    if (_validFileType(picFile)) {

    }
    // if type and size ok --> set state
    this._choosenNewPicture(true)
    this.setState({
      tempFilePath: window.URL.createObjectURL(picFile)
    })
  }

  usePrevApiPicture (event) {
    this._choosenNewPicture(false)
    // this.setState({
    //   isNewUploaded: false
    // //   tempFilePath: undefined
    // })
  }
//   useUploadedPicture (event) {
//     this._choosenNewPicture(true)
//   }

  doNextStep (event) {
    event.preventDefault()
    this.setState({
      isError: false
    })
    this.props.nextStep()
  }

  isDefaultPicture (event) {
    const isDefaultPic = event.target.value === 'defaultPicture'
    this._changeState(isDefaultPic)
  }

  hanleUploadFile (id, file, e) {
    if (e.target.files[0].type === 'image/png' || e.target.files[0].type === 'image/jpg') {
      this._sendRequest(id, file, e)
    } else {
      const notValid = id === 'analysis' ? ['analysisFile'] : ['pmFile']
      this.setState({
        notValid: notValid,
        alertError: i18n.messages[this.props.routerStore.language].messages.alert_not_pdf
      })
    }
  }

  _sendRequest (id, file, e) {
    const thisInstance = this
    const fileProgress = this.state.fileProgress
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest()
      req.upload.addEventListener('progress', event => {
        if (event.lengthComputable) {
          fileProgress[id] = (event.loaded / event.total) * 100
         // console.log(fileProgress[id])
          this.setState({ fileProgress: fileProgress })
        }
      })

      req.onreadystatechange = function () {
        let values = thisInstance.state.values
        if (this.readyState == 4 && this.status == 200) {

          if (id === 'analysis') {
            values.pdfAnalysisDate = getTodayDate()
            fileProgress.analysis = 0
            thisInstance.setState({
              analysisFile: this.responseText,
              alertSuccess: i18n.messages[thisInstance.props.routerStore.language].messages.alert_uploaded_file,
              values: values,
              hasNewUploadedFileAnalysis: true,
              notValid: [],
              alertError: ''
            })
          } else {
            values.pdfPMDate = getTodayDate()
            fileProgress.pm = 0
            thisInstance.setState({
              pmFile: this.responseText,
              alertSuccess: i18n.messages[thisInstance.props.routerStore.language].messages.alert_uploaded_file,
              values: values,
              notValid: [],
              alertError: ''
            })
          }
        }
      }

      let formData = new FormData()
      const data = this.getMetadata(this.state.isPublished ? 'published' : this.state.saved ? 'draft' : 'new')
      formData.append('file', e.target.files[0], e.target.files[0].name)
      formData.append('courseCode', data.courseCode)
      formData.append('analysis', data.analysis)
      formData.append('status', data.status)
      req.open('POST', `${this.props.routerStore.browserConfig.hostUrl}${this.props.routerStore.paths.storage.saveFile.uri.split(':')[0]}${this.props.routerStore.analysisData._id}/${id}/${this.state.isPublished}`)
      req.send(formData)
    })
  }

  handleRemoveFile () {

  }

  render ({adminStore}) {
    const { sellingTextLabels, imageUrl, courseAdminData } = this.props
    const { apiImageUrl, defaultImageUrl } = this
    // const path = this.props.adminStore.browserConfig.proxyPrefixPath.uri
    return (
      <span className='Upload--Area col' key='uploadArea'>
        <h2>{sellingTextLabels.label_step_1}</h2>
        <p>{sellingTextLabels.label_choose_picture}</p>
        <form className='picture-choice'>
          <span role='radiogroup'>
            <label for='defaultPicture'>
              <input type='radio' id='defaultPicture' name='choosePicture' value='defaultPicture'
                onClick={this.isDefaultPicture} checked={this.state.isDefault} />{' '}
              {sellingTextLabels.label_radio_button_1}
            </label> <br />
            <label for='otherPicture'>
              <input type='radio' id='otherPicture' name='choosePicture' value='otherPicture'
                onClick={this.isDefaultPicture} checked={this.state.isApiPic} /> {' '}
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
              {this.isApiPicAvailable || this.state.isNewUploaded
                ? <img src={this.state.isNewUploaded ? this.state.tempFilePath : apiImageUrl}
                  alt={sellingTextLabels.altLabel.image} height='auto' width='300px' />
                : ''
              }
            {this.state.isNewUploaded && this.isApiPicAvailable
                ? <Button color='secondary' onClick={this.usePrevApiPicture}>{sellingTextLabels.chooseImage.reset_image}</Button>
                : ''
            }
          </span>
          <span className='file-uploader-section'>
            <label for='pic-upload' className='label-pic-upload'>
              <h4>{sellingTextLabels.chooseImage.choose_file}</h4>
              <input type='file' id='pic-upload' name='pic-upload'
                accept='image/jpg,image/jpeg,image/png'
                onChange={this.updateImageDisplay}
                />
            </label>
            <p>
              <i>{this.state.isNewUploaded
                ? sellingTextLabels.chooseImage.file_name + ' ' + this.finalFileName
                : sellingTextLabels.chooseImage.no_choosen_file}
              </i>
            </p>
          </span>
        </span>
        }
        <span className='control-buttons'>
          <Col sm='4'>
          </Col>
          <Col sm='4' className='btn-cancel'>
            <Link to={`/kursinfoadmin/kurser/kurs/${courseAdminData.courseTitleData.course_code}?l=${courseAdminData.lang}`}
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
