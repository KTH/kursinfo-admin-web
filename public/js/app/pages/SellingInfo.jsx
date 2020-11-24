/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import i18n from '../../../../i18n'

import KoppsTextCollapse from '../components/KoppsTextCollapse'
import { Alert, Button, Col, Row } from 'reactstrap'
import ButtonModal from '../components/ButtonModal'
import { ADMIN_OM_COURSE, CANCEL_PARAMETER } from '../util/constants'

const nodeEnvTest = process.env.NODE_ENV.toLowerCase() === 'test'
const editorConf = {
  toolbarGroups: [
    { name: 'mode' },
    { name: 'find' },
    { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
    { name: 'list' },
    { name: 'links' },
    { name: 'about' }
  ],
  removeButtons: 'CopyFormatting,Underline,Strike,Subscript,Superscript,Anchor',
  language: i18n.isSwedish() ? 'sv' : 'en',
  width: ['98%']
}

@inject(['adminStore'])
@observer
class SellingInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sv: this.props.adminStore.sellingText.sv || '',
      en: this.props.adminStore.sellingText.en || '',
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

  componentDidMount() {
    this.startEditor()
  }

  componentDidUpdate() {
    window.addEventListener('load', this.startEditor)
  }

  componentWillUnmount() {
    window.removeEventListener('load', this.startEditor)
  }

  _countTextLen(event, editorId) {
    const text = event.editor.document.getBody().getText().replace(/\n/g, '')
    const { length } = text
    this.setState({
      [`leftTextSign_${editorId}`]: 1500 - length,
      isError: false,
      errMsg: ''
    })
    return [text, length]
  }

  _validateLen(event, l) {
    const translation = i18n.messages[this.langIndex].pageTitles.alertMessages
    const [cleanText, cleanTextLen] = this._countTextLen(event, l)
    const htmlText = event.editor.getData()
    if (htmlText.length > 10000) {
      // this is max in api
      this.setState({
        isError: true,
        errMsg: translation.over_html_limit
      })
    } else if (cleanTextLen > 1500) {
      // this is an abstract max
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

  _shapeText() {
    const { sv, en } = this.state
    return {
      sv,
      en
    }
  }

  startEditor() {
    if (!nodeEnvTest) {
      ;['sv', 'en'].map((editorId) => {
        // eslint-disable-next-line no-undef
        CKEDITOR.replace(editorId, editorConf)
        // eslint-disable-next-line no-undef
        CKEDITOR.instances[editorId].on('instanceReady', (event) =>
          this._countTextLen(event, editorId)
        )
        // eslint-disable-next-line no-undef
        CKEDITOR.instances[editorId].on('change', (event) => this._validateLen(event, editorId))
      })
    }
  }

  quitEditor(event) {
    event.preventDefault()
    const sellingTexts = this._shapeText()
    const progress = event.target.id === 'back-to-image' ? 1 : 3
    this.props.adminStore.tempSaveText(sellingTexts)
    this.setState({ isError: false })
    if (!nodeEnvTest) {
      // eslint-disable-next-line no-undef
      CKEDITOR.instances.sv.destroy(true)
      // eslint-disable-next-line no-undef
      CKEDITOR.instances.en.destroy(true)
    }
    this.props.updateParent({ progress })
  }

  render() {
    const { koppsData, langIndex } = this
    const { introLabel } = i18n.messages[langIndex]

    return (
      <div className="TextEditor--SellingInfo col">
        {/* ---TEXT Editors for each language--- */}
        {this.state.errMsg && (
          <Alert color="info">
            <p>{this.state.errMsg}</p>
          </Alert>
        )}
        <span className="title_and_info">
          <h2>{introLabel.label_step_2}</h2>{' '}
        </span>
        <span className="Editors--Area" key="editorsArea" role="tablist">
          <span className="left" key="leftEditorForSwedish">
            <KoppsTextCollapse
              instructions={introLabel}
              koppsText={koppsData.koppsText.sv}
              lang="sv"
            />
            <p>
              {introLabel.label_left_number_letters}
              <span className="badge badge-warning badge-pill">{this.state.leftTextSign_sv}</span>
            </p>
            <textarea name="sv" id="sv" className="editor" defaultValue={this.state.sv} />
          </span>
          <span className="right" key="rightEditorForEnglish">
            <KoppsTextCollapse
              instructions={introLabel}
              koppsText={koppsData.koppsText.en}
              lang="en"
            />
            <p>
              {introLabel.label_left_number_letters}
              <span className="badge badge-warning badge-pill">{this.state.leftTextSign_en}</span>
            </p>
            <textarea name="en" id="en" className="editor" defaultValue={this.state.en} />
          </span>
        </span>
        <Row className="control-buttons">
          <Col sm="4" className="step-back">
            <Button
              onClick={this.quitEditor}
              className="back"
              id="back-to-image"
              alt={introLabel.alt.step1}
            >
              {introLabel.button.step1}
            </Button>
          </Col>
          <Col sm="4" className="btn-cancel">
            <ButtonModal
              id="cancelStep2"
              type="cancel"
              course={this.courseCode}
              returnToUrl={`${ADMIN_OM_COURSE}${this.courseCode}${CANCEL_PARAMETER}`}
              btnLabel={introLabel.button.cancel}
              modalLabels={introLabel.info_cancel}
            />
          </Col>
          <Col sm="4" className="step-forward">
            <Button
              onClick={this.quitEditor}
              id="to-peview"
              className="next"
              color="success"
              alt={introLabel.alt.step3}
              disabled={this.state.isError}
            >
              {introLabel.button.step3}
            </Button>
          </Col>
        </Row>
      </div>
    )
  }
}

export default SellingInfo
