import { Alert, Button, Col, Row, Progress } from 'reactstrap'
import React, { Component } from 'react'
import { inject, observer} from 'mobx-react'
import i18n from '../../../../i18n'
import ButtonModal from '../components/ButtonModal.jsx'

import { ADMIN_OM_COURSE, CANCEL_PARAMETER } from '../util/constants'

@inject(['adminStore']) @observer
class Preview extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sv: this.props.adminStore.sellingText.sv,
      en: this.props.adminStore.sellingText.en,
      hasDoneSubmit: false,
      redirectAfterSubmit: false,
      isError: false,
      errMsg: '',
      fileProgress: 0
    }
    this.isDefaultChosen = this.props.adminStore.isDefaultChosen
    this.isPrevApiChosen = !this.props.adminStore.isDefaultChosen && !this.props.adminStore.tempImagePath

    this.newImage = this.props.adminStore.newImageFile
    this.tempFilePath = this.props.adminStore.tempImagePath
    this.apiImageUrl = this.props.adminStore.apiImageUrl
    this.koppsData = this.props.adminStore.koppsData
    this.courseCode = this.koppsData.courseTitleData.course_code
    this.userLang = this.koppsData.lang
    this.langIndex = this.koppsData.lang === 'en' ? 0 : 1

    this.returnToEditor = this.returnToEditor.bind(this)
    this.handleUploadImage = this.handleUploadImage.bind(this)
    this.handlePublish = this.handlePublish.bind(this)
  }

  _shapeText () {
    return {
      sv: this.state.sv,
      en: this.state.en
    }
  }

  returnToEditor (event) {
    event.preventDefault()
    this.props.updateParent({progress: 2})
  }

  handleUploadImage () {
    const formData = this.newImage
    const hostUrl = this.props.adminStore.browserConfig.hostUrl
    const saveFileUrl = this.props.adminStore.paths.storage.saveFile.uri.split(':')[0]
    let fileProgress = this.state.fileProgress
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest()
      req.upload.addEventListener('progress', event => {
        if (event.lengthComputable) {
          fileProgress = (event.loaded / event.total) * 100
          this.setState({ fileProgress: fileProgress })
        }
      })
      req.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          resolve({imageName: this.response})
          // reject({error: this})
        }
        if (this.readyState === 4 && this.status !== 200) {
          this.setState({ fileProgress: 0 })
          reject({error: this})
        }
      }
      req.open('POST', `${hostUrl}${saveFileUrl}${this.courseCode}/published`)
      req.send(formData)
    })
  }

  handleSellingText (image) {
    const { courseCode, langIndex, userLang } = this
    const imageName = image.imageName
    const sellingTexts = this._shapeText()
    this.props.adminStore.doUpsertItem(sellingTexts, courseCode, imageName)
    .then(() => {
      this.setState({
        hasDoneSubmit: true,
        redirectAfterSubmit: true,
        fileProgress: 100,
        isError: false
      })
      window.location = `${ADMIN_OM_COURSE}${courseCode}?l=${userLang}&serv=kinfo&event=pub`
    }).catch(err => {
      this.setState({
        hasDoneSubmit: false,
        isError: true,
        errMsg: i18n.messages[langIndex].pageTitles.alertMessages.api_error
      })
    })
  }

  handlePublish () {
    const { langIndex } = this
    this.setState({
      hasDoneSubmit: true,
      isError: false
    })
    if (this.tempFilePath) {
      this.handleUploadImage()
      .then(imageName => this.handleSellingText(imageName))
      .catch(err => {
        this.setState({
          hasDoneSubmit: false,
          isError: true,
          errMsg: i18n.messages[langIndex].pageTitles.alertMessages.storage_api_error
        })
      })
    } else if (this.isDefaultChosen) this.handleSellingText({imageName: ''})
      else this.handleSellingText({imageName: this.props.adminStore.imageNameFromApi})
  }

  render () {
    const { koppsText } = this.koppsData
    const { introLabel, defaultImageUrl } = this.props
    const { tempFilePath, isPrevApiChosen, apiImageUrl } = this
    const pictureUrl = tempFilePath || (isPrevApiChosen ? apiImageUrl : defaultImageUrl)

    return (
      <div className='Preview--Changes col'>
        <p>{introLabel.step_3_desc}</p>
        {this.state.isError && this.state.errMsg ? <Alert color='danger'><p>{this.state.errMsg}</p></Alert> : ''}
        <span className='title_and_info'>
          <h2>{introLabel.label_step_3}</h2> {' '}
          {/* <ButtonModal id='infoPreview' type='info-icon' modalLabels={introLabel.info_image} course={this.courseCode} /> */}
        </span>
        <Row id='pageContainer' key='pageContainer'>
          <Col sm='12' xs='12' lg='12' id='middle' key='middle'>
            {['sv', 'en'].map((lang, key) =>
              <Row className='courseIntroText' key={key}>
                <Col sm='12' xs='12' className='sellingText'>
                  <h3>{introLabel.langLabel[lang]}</h3>
                  <img src={pictureUrl} alt={introLabel.alt.image} height='auto' width='300px' />
                  <span className='textBlock' dangerouslySetInnerHTML={{ __html: this.state[lang].length > 0 ? this.state[lang] : koppsText[lang] }}>
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
                <ButtonModal id='cancelStep3' type='cancel' btnLabel={introLabel.button.cancel}
                  returnToUrl={`${ADMIN_OM_COURSE}${this.courseCode}${CANCEL_PARAMETER}`}
                  modalLabels={introLabel.info_cancel} course={this.courseCode}
                  />
              </Col>
              <Col sm='4' className='btn-last'>
                <ButtonModal id='publish' type='submit' btnLabel={introLabel.button.publish} handleParentConfirm={this.handlePublish}
                  modalLabels={introLabel.info_publish} course={this.courseCode} alt={introLabel.alt.publish}
                  disabled={this.state.hasDoneSubmit}
                  />
              </Col>
            </Row>
          </Col>
        </Row>
        <span className={this.state.isError
          ? 'text-danger' : this.state.redirectAfterSubmit ? 'text-success' : 'text-primary'}
          role='status'>
          <div className='text-center'>
            {this.state.isError
              ? this.state.errMsg
              : this.state.redirectAfterSubmit
                ? introLabel.redirectToStart
                : this.state.fileProgress + '%'}
          </div>
          <Progress value={this.state.fileProgress} color={this.state.isError ? 'danger' : this.state.redirectAfterSubmit ? 'success' : 'info'} />
        </span>
      </div>
    )
  }
}

export default Preview
