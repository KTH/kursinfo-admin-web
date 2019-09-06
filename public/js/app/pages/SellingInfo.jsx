import { Component } from 'inferno'
import { inject, observer } from 'inferno-mobx'
import i18n from '../../../../i18n'

import KoppsTextCollapse from '../components/KoppsTextCollapse.jsx'
import PreviewText from '../components/PreviewText.jsx'
import Button from 'inferno-bootstrap/lib/Button'
import Alert from 'inferno-bootstrap/lib/Alert'
import Row from 'inferno-bootstrap/dist/Row'
import Col from 'inferno-bootstrap/dist/Col'
import ButtonModal from '../components/ButtonModal.jsx'

import { KURSINFO_IMAGE_BLOB_URL, ADMIN_OM_COURSE } from '../util/constants'

const editorConf = {
  toolbarGroups: [
    {name: 'mode'},
    {name: 'find'},
    {name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ]},
    {name: 'list'},
    {name: 'links'},
    {name: 'about'}
  ],
  removeButtons: 'CopyFormatting,Underline,Strike,Subscript,Superscript,Anchor',
  language: i18n.isSwedish() ? 'sv' : 'en',
  width: ['98%']
}

@inject(['adminStore']) @observer
class SellingInfo extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sv: this.props.adminStore.sellingText.sv,
      en: this.props.adminStore.sellingText.en,
      leftTextSign_sv: undefined,
      leftTextSign_en: undefined,
      enteredEditMode: true,
      hasDoneSubmit: false,
      isError: false,
      errMsg: ''
    }
    this.sellingTextAuthor = this.props.adminStore.sellingTextAuthor,
    this.courseAdminData = this.props.adminStore.courseAdminData
    this.courseCode = this.courseAdminData.courseTitleData.course_code
    this.userLang = this.courseAdminData.lang
    this.langIndex = this.courseAdminData.lang === 'en' ? 0 : 1
    this.goTo = this.goTo.bind(this)
    this.goToEditMode = this.goToEditMode.bind(this)
    this.handlePublish = this.handlePublish.bind(this)
    this.startEditor = this.startEditor.bind(this)
  }

  componentDidMount () {
    this.startEditor()
  }

  componentWillUnmount () {
    window.removeEventListener('load', this.startEditor)
  }

  componentDidUpdate () {
    console.log('sell componentDidUpdate')
    window.addEventListener('load', this.startEditor)
  }

  goToEditMode (event) {
    event.preventDefault()
    this.setState({
      hasDoneSubmit: false,
      enteredEditMode: true,
      isError: false
    })
    this.startEditor(event)
    const states = {
      // enteredUploadMode: false,
      progress: 2
    }
    this.props.updateParent(states)
  }

  handlePublish () {
    // event.preventDefault()
    const {courseCode, langIndex, lang} = this
    const sellingTexts = this._shapeText()
    this.props.uploadFinalPic()
    this.props.adminStore.doUpsertItem(sellingTexts, courseCode).then(() => {
      this.setState({
        hasDoneSubmit: true,
        isError: false
      })
      window.location = `${ADMIN_OM_COURSE}${courseCode}?l=${lang}&serv=kinfo&event=pub`
    }).catch(err => {
      this.setState({
        hasDoneSubmit: false,
        isError: true,
        errMsg: i18n.messages[langIndex].pageTitles.alertMessages.api_error
      })
    })
  }

  _shapeText () {
    return {
      sv: this.state.sv,
      en: this.state.en
    }
  }

  goTo (event) {
    event.preventDefault()
    const sellingTexts = this._shapeText()
    const progress = event.target.id === 'back-to-image' ? 1 : 3
    console.log('this.sellingText in1', sellingTexts)
    console.log('en 1', this.state.en)
    this.props.adminStore.updateSellingText(sellingTexts)
    this.setState({
      enteredEditMode: false,
      isError: false
    })
    CKEDITOR.instances.sv.destroy(true)
    CKEDITOR.instances.en.destroy(true)
    const states = {
      progress
    }
    this.props.updateParent(states)
  }


  _doCalculateLength = (event, editorId) => {
    const text = event.editor.document.getBody().getText().replace(/\n/g, '')
    const length = text.length
    this.setState({
      [`leftTextSign_${editorId}`]: 1500 - length,
      isError: false,
      errMsg: ''
    })
    return [text, length]
  }

  _doCheckTextLength = (event, l) => {
    const translation = i18n.messages[this.langIndex].pageTitles.alertMessages
    const [cleanText, cleanTextLen] = this._doCalculateLength(event, l)
    const htmlText = event.editor.getData()
    if (htmlText.length > 10000) { // this is max in api
      this.setState({
        isError: true,
        errMsg: translation.over_html_limit
      })
    } else if (cleanTextLen > 1500) { // this is an abstract max
      this.setState({
        isError: true,
        errMsg: translation.over_text_limit
      })
    } else if (cleanText.trim().length === 0) {
      this.setState({
        [l]: ''
      })
    } else {
      this.setState({
        [l]: htmlText
      })
    }
  }

  startEditor () {
    ['sv', 'en'].map((editorId) => {
      let textArea = document.getElementById(editorId)
      CKEDITOR.replace(editorId, editorConf)
      CKEDITOR.instances[editorId].on('instanceReady', event => this._doCalculateLength(event, editorId))
      CKEDITOR.instances[editorId].on('change', event => this._doCheckTextLength(event, editorId))
    })
  }

  render ({adminStore}) {
    const { courseAdminData, langIndex } = this
    const { courseImage, introLabel } = i18n.messages[langIndex]
    let courseImageID = courseImage[courseAdminData.imageFileName]
    if (courseImageID === undefined) courseImageID = courseImage.default
    const imageUrl = `${KURSINFO_IMAGE_BLOB_URL}${courseImageID}`
    return (
      <div key='kursinfo-container' className='kursinfo-main-page col' >

        {this.state.errMsg ? <Alert color='info'><p>{this.state.errMsg}</p></Alert> : ''}

        {/* ---IF in edit mode or preview mode--- */}
        {this.state.enteredEditMode ? (
          <div className='TextEditor--SellingInfo col'>
            {/* ---TEXT Editors for each language--- */}
            <p>{introLabel.step_2_desc}</p>
            <h2>{introLabel.label_step_2}</h2>
            <span className='Editors--Area' key='editorsArea' role='tablist'>
              <span className='left' key='leftEditorForSwedish'>
                <KoppsTextCollapse instructions={introLabel}
                  koppsText={courseAdminData.koppsCourseDesc['sv']} lang='sv' />
                <p>{introLabel.label_left_number_letters}<span className='badge badge-warning badge-pill'>{this.state.leftTextSign_sv}</span></p>
                <textarea name='sv' id='sv' className='editor' style='visibility: hidden; display: none;'>{this.state.sv}</textarea>
              </span>
              <span className='right' key='rightEditorForEnglish'>
                <KoppsTextCollapse instructions={introLabel}
                  koppsText={courseAdminData.koppsCourseDesc['en']} lang='en' />
                <p>{introLabel.label_left_number_letters}<span className='badge badge-warning badge-pill'>{this.state.leftTextSign_en}</span></p>
                <textarea name='en' id='en' className='editor' style='visibility: hidden; display: none;'>{this.state.en}</textarea>
              </span>
            </span>
            <p className='changed-by'>{introLabel.changed_by} {this.sellingTextAuthor}</p>
            <Row className='control-buttons'>
              <Col sm='4' className='btn-back'>
                <Button onClick={this.goTo} id='back-to-image' alt={introLabel.alt.step1}>
                  {introLabel.button.step1}
                </Button>
              </Col>
              <Col sm='4' className='btn-cancel'>
                <ButtonModal id='cancel' step={2} course={this.courseCode} buttonLabel={introLabel.button.cancel} infoText={introLabel.info_cancel} />
              </Col>
              <Col sm='4' className='btn-next'>
                <Button onClick={this.goTo} id='to-peview' color='success' alt={introLabel.alt.step3} disabled={this.state.isError}>
                  {introLabel.button.step3}
                </Button>
              </Col>
            </Row>
          </div>
        ) : (
          <div className='col'>
            <h2>{introLabel.label_step_3}</h2>
            <Row id='pageContainer' key='pageContainer'>
              <Col sm='12' xs='12' lg='12' id='middle' key='middle'>
                <PreviewText introLabel={introLabel} whichLang='sv'
                  image={imageUrl}
                  sellingText={this.state.sv} koppsTexts={courseAdminData.koppsCourseDesc} />
                <PreviewText introLabel={introLabel} whichLang='en'
                  image={imageUrl}
                  sellingText={this.state.en} koppsTexts={courseAdminData.koppsCourseDesc} />
                <Row className='control-buttons'>
                  <Col sm='4' className='btn-back'>
                    <Button onClick={this.goToEditMode} alt={introLabel.alt.step2Back}>{introLabel.button.step2}</Button>
                  </Col>
                  <Col sm='4' className='btn-cancel'>
                    <ButtonModal id='cancel' step={3} course={this.courseCode} buttonLabel={introLabel.button.cancel} infoText={introLabel.info_cancel} />
                  </Col>
                  <Col sm='4' className='btn-last'>
                    <ButtonModal id='publish' buttonLabel={introLabel.button.publish}
                      handleConfirm={this.handlePublish} infoText={introLabel.info_publish} alt={introLabel.alt.publish} />
{/*
                    <Button id='publish' key='publish' onClick={this.toggleModal} color='success' alt={introLabel.alt.publish}>
                      {introLabel.button.publish}
                    </Button> */}
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        )}
      </div>
    )
  }
}

export default SellingInfo
