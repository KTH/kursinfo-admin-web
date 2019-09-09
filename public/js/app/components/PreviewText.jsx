import Row from 'inferno-bootstrap/dist/Row'
import Col from 'inferno-bootstrap/dist/Col'
import { Component } from 'inferno'
import { inject, observer } from 'inferno-mobx'
import i18n from '../../../../i18n'
import Button from 'inferno-bootstrap/lib/Button'
import Alert from 'inferno-bootstrap/lib/Alert'
import ButtonModal from '../components/ButtonModal.jsx'
import Progress from 'inferno-bootstrap/dist/Progress'

import { ADMIN_OM_COURSE } from '../util/constants'

@inject(['adminStore']) @observer
class Preview extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sv: this.props.adminStore.sellingText.sv,
      en: this.props.adminStore.sellingText.en,
      fileProgress: 0,
      newImage: this.props.adminStore.newImageFile,
      isPublished: 'published' // 'draft'
    }
    this.koppsData = this.props.adminStore.koppsData
    this.courseCode = this.koppsData.courseTitleData.course_code
    this.userLang = this.koppsData.lang
    this.langIndex = this.koppsData.lang === 'en' ? 0 : 1

    this.returnToEditor = this.returnToEditor.bind(this)
    this.handleUploadImage = this.handleUploadImage.bind(this)
    this.handlePublish = this.handlePublish.bind(this)
  }

  _shapeText (file) {
    return {
      sv: this.state.sv,
      en: this.state.en,
      imageInfo: file
    }
  }

  returnToEditor (event) {
    event.preventDefault()
    this.props.updateParent({progress: 2})
  }

  handleUploadImage (/** */) {
    const formData = this.state.newImage// this.state.imageFile
    // const thisInstance = this
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
        console.log('onreadystatechange values', this)

        if (this.readyState === 4 && this.status === 200) {
          resolve({fileName: this.response})
          // if (formData) {
          //   thisInstance.state.fileSavedDate = _getTodayDate()
          //   thisInstance.setState({
          //     isError: false, // todo: remove
          //     successMsg: 'Success', // i18n.messages[thisInstance.props.routerStore.language].messages.alert_uploaded_file,
          //     errMsg: undefined,
          //     hasNewUploadedImage: true
          //   })
          //   console.log('Ura 1', thisInstance.state)
          // }
          console.log('Ura 2')
        }
      }
      req.open('POST', `${this.props.adminStore.browserConfig.hostUrl}${this.props.adminStore.paths.storage.saveFile.uri.split(':')[0]}${this.courseCode}/${this.state.isPublished}`)
      req.send(formData)
    })
  }

  handleSellingText (res) {
    const {courseCode, langIndex, userLang} = this
    console.log('filename', res)
    const sellingTexts = this._shapeText(res ? res : '')
    // this.props.uploadFinalPic().then((res) => console.log('result', res))
    this.props.adminStore.doUpsertItem(sellingTexts, courseCode).then(() => {
      this.setState({
        hasDoneSubmit: true,
        isError: false
      })
      // window.location = `${ADMIN_OM_COURSE}${courseCode}?l=${userLang}&serv=kinfo&event=pub`
    }).catch(err => {
      this.setState({
        hasDoneSubmit: false,
        isError: true,
        errMsg: i18n.messages[langIndex].pageTitles.alertMessages.api_error
      })
    })
  }

  handlePublish () {
    this.handleUploadImage().then((res) => {

      console.log('result', res)
      return this.handleSellingText(res)
    })

    // this.props.adminStore.doUpsertItem(sellingTexts, courseCode).then(() => {
    //   this.setState({
    //     hasDoneSubmit: true,
    //     isError: false
    //   })
    //   // window.location = `${ADMIN_OM_COURSE}${courseCode}?l=${userLang}&serv=kinfo&event=pub`
    // }).catch(err => {
    //   this.setState({
    //     hasDoneSubmit: false,
    //     isError: true,
    //     errMsg: i18n.messages[langIndex].pageTitles.alertMessages.api_error
    //   })
    // })
  }
  render () {
    const { koppsTexts } = this.koppsData
    const { introLabel } = this.props
    return (
      <div key='kursinfo-container' className='kursinfo-main-page col' >

        {this.state.errMsg ? <Alert color='info'><p>{this.state.errMsg}</p></Alert> : ''}
        <div className='col'>
          <h2>{introLabel.label_step_3}</h2>
          <Row id='pageContainer' key='pageContainer'>
            <Col sm='12' xs='12' lg='12' id='middle' key='middle'>
              {['sv', 'en'].map((lang, key) =>
                <Row className='courseIntroText' key={key}>
                  <Col sm='12' xs='12' className='sellingText'>
                    <h3>{introLabel.langLabel[lang]}</h3>
                    <img src={'imageUrl'} alt={introLabel.alt.image} height='auto' width='300px' />
                    <span className='textBlock' dangerouslySetInnerHTML={{__html: this.state[lang] === '' ? koppsTexts[lang] : this.state[lang]}}>
                    </span>
                  </Col>
                </Row>
                )
              }
              <Row className='control-buttons'>
                <Col sm='4' className='btn-back'>
                  <Button onClick={this.returnToEditor} alt={introLabel.alt.step2Back}>{introLabel.button.step2}</Button>
                </Col>
                <Col sm='4' className='btn-cancel'>
                  <ButtonModal id='cancel' step={3} course={this.courseCode} buttonLabel={introLabel.button.cancel} infoText={introLabel.info_cancel} />
                </Col>
                <Col sm='4' className='btn-last'>
                  <ButtonModal id='publish' buttonLabel={introLabel.button.publish}
                    handleConfirm={this.handlePublish} infoText={introLabel.info_publish} alt={introLabel.alt.publish} />
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <span>
          <div className='text-center'>{this.state.fileProgress}%</div>
          <Progress value={this.state.fileProgress} />
        </span>
      </div>
    )
  }
}

export default Preview
