/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { Alert, Button, Col, Row } from 'reactstrap'
import i18n from '../../../../i18n'
import KoppsTextCollapse from '../components/KoppsTextCollapse'
import ButtonModal from '../components/ButtonModal'
import { ADMIN_OM_COURSE, CANCEL_PARAMETER } from '../util/constants'
import { useWebContext } from '../context/WebContext'
import { param } from 'jquery'

const nodeEnvTest = process.env.NODE_ENV.toLowerCase() === 'test'
const editorConf = {
  toolbarGroups: [
    { name: 'mode' },
    { name: 'find' },
    { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
    { name: 'list' },
    { name: 'links' },
    { name: 'about' },
  ],
  removeButtons: 'CopyFormatting,Underline,Strike,Subscript,Superscript,Anchor',
  language: i18n.isSwedish() ? 'sv' : 'en',
  width: ['98%'],
}

const paramsReducer = (state, action) => ({ ...state, ...action })

function SellingInfo() {
  const [webContext] = useWebContext()
  const context = React.useMemo(() => webContext, [webContext])

  const [state, setState] = React.useReducer(paramsReducer, {
    sv: context.sellingText.sv || '',
    en: context.sellingText.en || '',
    leftTextSign_sv: undefined,
    leftTextSign_en: undefined,
    isError: false,
    errMsg: '',
  })

  React.useEffect(() => {
    startEditor()
    window.addEventListener('load', this.startEditor)
    return () => {
      window.removeEventListener('load', startEditor)
    }
  }, [])

  const { sellingTextAuthor, koppsData } = context
  const courseCode = koppsData.courseTitleData.course_code
  const langIndex = koppsData.lang === 'en' ? 0 : 1

  function _countTextLen(event, editorId) {
    const text = event.editor.document.getBody().getText().replace(/\n/g, '')
    const { length } = text
    setState({
      [`leftTextSign_${editorId}`]: 1500 - length,
      isError: false,
      errMsg: '',
    })
    return [text, length]
  }

  function _validateLen(event, l) {
    const translation = i18n.messages[langIndex].pageTitles.alertMessages
    const [cleanText, cleanTextLen] = _countTextLen(event, l)
    const htmlText = event.editor.getData()
    if (htmlText.length > 10000) {
      // this is max in api
      setState({
        isError: true,
        errMsg: translation.over_html_limit,
      })
    } else if (cleanTextLen > 1500) {
      // this is an abstract max
      setState({
        isError: true,
        errMsg: translation.over_text_limit,
      })
    } else if (cleanText.trim().length === 0) {
      setState({
        [l]: '',
      })
    } else {
      setState({
        [l]: htmlText,
      })
    }
  }

  function _shapeText() {
    const { sv, en } = state
    return {
      sv,
      en,
    }
  }

  function startEditor() {
    if (!nodeEnvTest) {
      ;['sv', 'en'].map(editorId => {
        // eslint-disable-next-line no-undef
        CKEDITOR.replace(editorId, editorConf)
        // eslint-disable-next-line no-undef
        CKEDITOR.instances[editorId].on('instanceReady', event => _countTextLen(event, editorId))
        // eslint-disable-next-line no-undef
        CKEDITOR.instances[editorId].on('change', event => _validateLen(event, editorId))
      })
    }
  }

  function quitEditor(event) {
    event.preventDefault()
    const sellingTexts = _shapeText()
    const progress = event.target.id === 'back-to-image' ? 1 : 3
    context.tempSaveText(sellingTexts)
    setState({ isError: false })
    if (!nodeEnvTest) {
      // eslint-disable-next-line no-undef
      CKEDITOR.instances.sv.destroy(true)
      // eslint-disable-next-line no-undef
      CKEDITOR.instances.en.destroy(true)
    }
    props.updateParent({ progress })
  }

  const { introLabel } = i18n.messages[langIndex]

  return (
    <div className="TextEditor--SellingInfo col">
      {/* ---TEXT Editors for each language--- */}
      {state.errMsg && (
        <Alert color="info">
          <p>{state.errMsg}</p>
        </Alert>
      )}
      <span className="title_and_info">
        <h2>{introLabel.label_step_2}</h2>{' '}
      </span>
      <span className="Editors--Area" key="editorsArea" role="tablist">
        <span className="left" key="leftEditorForSwedish">
          <KoppsTextCollapse instructions={introLabel} koppsText={koppsData.koppsText.sv} lang="sv" />
          <p>
            {introLabel.label_left_number_letters}
            <span className="badge badge-warning badge-pill">{state.leftTextSign_sv}</span>
          </p>
          <textarea name="sv" id="sv" className="editor" defaultValue={state.sv} />
        </span>
        <span className="right" key="rightEditorForEnglish">
          <KoppsTextCollapse instructions={introLabel} koppsText={koppsData.koppsText.en} lang="en" />
          <p>
            {introLabel.label_left_number_letters}
            <span className="badge badge-warning badge-pill">{state.leftTextSign_en}</span>
          </p>
          <textarea name="en" id="en" className="editor" defaultValue={state.en} />
        </span>
      </span>
      <Row className="control-buttons">
        <Col sm="4" className="step-back">
          <Button onClick={quitEditor} className="back" id="back-to-image" aria-label={introLabel.alt.step1}>
            {introLabel.button.step1}
          </Button>
        </Col>
        <Col sm="4" className="btn-cancel">
          <ButtonModal
            id="cancelStep2"
            type="cancel"
            course={courseCode}
            returnToUrl={`${ADMIN_OM_COURSE}${this.courseCode}${CANCEL_PARAMETER}`}
            btnLabel={introLabel.button.cancel}
            modalLabels={introLabel.info_cancel}
          />
        </Col>
        <Col sm="4" className="step-forward">
          <Button
            onClick={quitEditor}
            id="to-peview"
            className="next"
            color="success"
            aria-label={introLabel.alt.step3}
            disabled={state.isError}
          >
            {introLabel.button.step3}
          </Button>
        </Col>
      </Row>
    </div>
  )
}

export default SellingInfo
