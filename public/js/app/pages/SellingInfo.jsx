import { Component } from 'inferno'
import { inject, observer } from 'inferno-mobx'
import i18n from '../../../../i18n'

import KoppsTextCollapse from '../components/KoppsTextCollapse.jsx'
import Button from 'inferno-bootstrap/lib/Button'
import Alert from 'inferno-bootstrap/lib/Alert'
import Row from 'inferno-bootstrap/dist/Row'
import Col from 'inferno-bootstrap/dist/Col'
import ButtonModal from '../components/ButtonModal.jsx'
import { ADMIN_OM_COURSE, CANCEL_PARAMETER } from '../util/constants'

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
      sv: this.props.adminStore.sellingText.sv,
      en: this.props.adminStore.sellingText.en,
      leftTextSign_sv: undefined,
      leftTextSign_en: undefined,
      isError: false,
      errMsg: ''
    }
    this.sellingTextAuthor = this.props.adminStore.sellingTextAuthor
    this.koppsData = this.props.adminStore.koppsData
    this.courseCode = this.koppsData.courseTitleData.course_code
    this.langIndex = this.koppsData.lang === 'en' ? 0 : 1
    this.startEditor = this.startEditor.bind(this)
    this.quitEditor = this.quitEditor.bind(this)
  }

  componentDidMount () {
    this.startEditor()
  }

  componentWillUnmount () {
    window.removeEventListener('load', this.startEditor)
  }

  componentDidUpdate () {
    window.addEventListener('load', this.startEditor)
  }

  _countTextLen (event, editorId) {
    const text = event.editor.document.getBody().getText().replace(/\n/g, '')
    const length = text.length
    this.setState({
      [`leftTextSign_${editorId}`]: 1500 - length,
      isError: false,
      errMsg: ''
    })
    return [text, length]
  }

  _validateLen (event, l) {
    const translation = i18n.messages[this.langIndex].pageTitles.alertMessages
    const [cleanText, cleanTextLen] = this._countTextLen(event, l)
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

  _shapeText () {
    return {
      sv: this.state.sv,
      en: this.state.en
    }
  }

  startEditor () {
    ['sv', 'en'].map((editorId) => {
      CKEDITOR.replace(editorId, editorConf)
      CKEDITOR.instances[editorId].on('instanceReady', event => this._countTextLen(event, editorId))
      CKEDITOR.instances[editorId].on('change', event => this._validateLen(event, editorId))
    })
  }

  quitEditor (event) {
    event.preventDefault()
    const sellingTexts = this._shapeText()
    const progress = event.target.id === 'back-to-image' ? 1 : 3
    this.props.adminStore.tempSaveText(sellingTexts)
    this.setState({ isError: false })
    CKEDITOR.instances.sv.destroy(true)
    CKEDITOR.instances.en.destroy(true)
    this.props.updateParent({progress})
  }

  render () {
    const { koppsData, langIndex } = this
    const { introLabel } = i18n.messages[langIndex]

    return (
      <div className='TextEditor--SellingInfo col'>
        {/* ---TEXT Editors for each language--- */}
        <p>{introLabel.step_2_desc}</p>
        {this.state.errMsg ? <Alert color='info'><p>{this.state.errMsg}</p></Alert> : ''}
        <span className='title_and_info'>
          <h2>{introLabel.label_step_2}</h2> {' '}
          {/* <ButtonModal id='info' step={3} infoText={introLabel.info_image} course={this.courseCode} /> */}
        </span>
        <span className='Editors--Area' key='editorsArea' role='tablist'>
          <span className='left' key='leftEditorForSwedish'>
            <KoppsTextCollapse instructions={introLabel}
              koppsText={koppsData.koppsText['sv']} lang='sv' />
            <p>{introLabel.label_left_number_letters}<span className='badge badge-warning badge-pill'>{this.state.leftTextSign_sv}</span></p>
            <textarea name='sv' id='sv' className='editor' style='visibility: hidden; display: none;'>{this.state.sv}</textarea>
          </span>
          <span className='right' key='rightEditorForEnglish'>
            <KoppsTextCollapse instructions={introLabel}
              koppsText={koppsData.koppsText['en']} lang='en' />
            <p>{introLabel.label_left_number_letters}<span className='badge badge-warning badge-pill'>{this.state.leftTextSign_en}</span></p>
            <textarea name='en' id='en' className='editor' style='visibility: hidden; display: none;'>{this.state.en}</textarea>
          </span>
        </span>
        <p className='changed-by'>{introLabel.changed_by} {this.sellingTextAuthor}</p>
        <Row className='control-buttons'>
          <Col sm='4' className='btn-back'>
            <Button onClick={this.quitEditor} id='back-to-image' alt={introLabel.alt.step1}>
              {introLabel.button.step1}
            </Button>
          </Col>
          <Col sm='4' className='btn-cancel'>
            <ButtonModal id='cancelStep2' type='cancel' course={this.courseCode}
              returnToUrl={`${ADMIN_OM_COURSE}${this.courseCode}${CANCEL_PARAMETER}`}
              btnLabel={introLabel.button.cancel} modalLabels={introLabel.info_cancel} />
          </Col>
          <Col sm='4' className='btn-next'>
            <Button onClick={this.quitEditor} id='to-peview' color='success' alt={introLabel.alt.step3} disabled={this.state.isError}>
              {introLabel.button.step3}
            </Button>
          </Col>
        </Row>
      </div>
    )
  }
}

export default SellingInfo
