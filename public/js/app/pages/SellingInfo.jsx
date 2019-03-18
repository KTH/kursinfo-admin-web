import { Component } from 'inferno'
import { inject, observer } from 'inferno-mobx'
import i18n from '../../../../i18n'

import CourseTitle from '../components/CourseTitle.jsx'
import Button from 'inferno-bootstrap/lib/Button'
import Alert from 'inferno-bootstrap/lib/Alert'
import {Link} from 'inferno-router'
import Row from 'inferno-bootstrap/dist/Row'
import Col from 'inferno-bootstrap/dist/Col'

function TextBlock ({text}) {
  return (
    <span className='textBlock' dangerouslySetInnerHTML={{__html: text}}>
    </span>
    )
}

function KoppsText ({header, text, label}) {
  return (
    <div className='courseIntroTextCollapse'>
      <div className='card collapsible blue'>
        <div className='card-header' role='tab' id={'headingWhite' + label} tabindex='0'>
          <h4 className='mb-0'>
            <a className='collapse-header' data-toggle='collapse' href={'#collapseWhite' + label} load='false' aria-expanded='false' aria-controls={'collapseWhite' + label}>{header}</a>
          </h4>
        </div>
        <div id={'collapseWhite' + label} className='collapse hide' role='tabpanel' aria-labelledby={'headingWhite' + label}>
          <div className='card-body  col'>
            <TextBlock text={text} />
          </div>
        </div>
      </div>
    </div>
  )
}

@inject(['adminStore']) @observer
class SellingInfo extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sellingText_sv: this.props.adminStore.sellingText.sv,
      sellingText_en: this.props.adminStore.sellingText.en,
      sellingTextAuthor: this.props.adminStore.sellingTextAuthor,
      leftTextSign_sv: undefined,
      leftTextSign_en: undefined,
      enteredEditMode: true,
      hasDoneSubmit: false,
      isError: false,
      errMsg: ''
    }
    this.doChangeText = this.doChangeText.bind(this)
    this.doPreview = this.doPreview.bind(this)
    this.doSubmit = this.doSubmit.bind(this)
    this.doOpenEditorAndCount = this.doOpenEditorAndCount.bind(this)
  }

  componentDidMount () {
    window.addEventListener('load', this.doOpenEditorAndCount)
  }

  componentWillUnmount () {
    window.removeEventListener('load', this.doOpenEditorAndCount)
  }

  doChangeText (event) {
    event.preventDefault()
    this.setState({
      hasDoneSubmit: false,
      enteredEditMode: true,
      isError: false
    })
    this.doOpenEditorAndCount(event)
  }

  doSubmit (event) {
    event.preventDefault()
    const adminStore = this.props.adminStore
    const courseCode = adminStore.courseAdminData.courseTitleData.course_code
    const sellingTexts = {
      sv: this.state.sellingText_sv,
      en: this.state.sellingText_en
    }
    adminStore.doUpsertItem(sellingTexts, courseCode).then(() => {
      this.setState({
        hasDoneSubmit: true,
        isError: false
      })
      this.props.history.push({
        pathname: `/admin/kurser/kurs/${courseCode}?l=${adminStore.courseAdminData.lang}`,
        data: 'success'
      })
    }).catch(err => {
      var langIndex = i18n.isSwedish() ? 1 : 0
      this.setState({
        hasDoneSubmit: false,
        isError: true,
        errMsg: i18n.messages[langIndex].pageTitles.alertMessages.api_error
      })
    })
  }

  doPreview (event) {
    event.preventDefault()
    this.setState({
      enteredEditMode: false,
      isError: false
    })
    CKEDITOR.instances.editorSV.destroy(true)
    CKEDITOR.instances.editorEN.destroy(true)
  }

  doOpenEditorAndCount () {
    var lang = i18n.isSwedish() ? 'sv' : 'en'
    var langIndex = lang === 'en' ? 0 : 1
    const translation = i18n.messages[langIndex].pageTitles.alertMessages
    const conf = {
      toolbarGroups: [
        {name: 'mode'},
        {name: 'find'},
        {name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ]},
        {name: 'list'},
        {name: 'links'},
        {name: 'about'}
      ],
      removeButtons: 'CopyFormatting,Underline,Strike,Subscript,Superscript,Anchor',
      language: lang,
      width: ['550px']
    }
    const _doCalculateLength = (event, l) => {
      this.setState({
        isError: false,
        errMsg: ''
      })
      const cleanText = event.editor.document.getBody().getText().replace(/\n/g, '')
      const cleanTextLen = cleanText.length
      const htmlTextLen = event.editor.getData().length
      if (htmlTextLen > 10000) { // this is max in api
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
          [`sellingText_${l}`]: ''
        })
      } else {
        this.setState({
          [`sellingText_${l}`]: event.editor.getData()
        })
      }
      this.setState({[`leftTextSign_${l}`]: 1500 - cleanTextLen})
    }

    ['editorSV', 'editorEN'].map(editorId => {
      CKEDITOR.replace(editorId, conf)
    })

    CKEDITOR.instances.editorSV.on('instanceReady', event => {
      const text = event.editor.document.getBody().getText().replace(/\n/g, '')
      this.setState({leftTextSign_sv: 1500 - text.length})
    })
    CKEDITOR.instances.editorEN.on('instanceReady', event => {
      const text = event.editor.document.getBody().getText().replace(/\n/g, '')
      this.setState({leftTextSign_en: 1500 - text.length})
    })
    CKEDITOR.instances.editorSV.on('change', event => _doCalculateLength(event, 'sv'))

    CKEDITOR.instances.editorEN.on('change', event => _doCalculateLength(event, 'en'))
  }

  render ({adminStore}) {
    const courseAdminData = adminStore['courseAdminData']
    const lang = courseAdminData.lang === 'en' ? 0 : 1
    const courseCode = courseAdminData.courseTitleData.course_code
    const translation = i18n.messages[lang]
    const pageTitles = translation.pageTitles
    const sellingTextLabels = translation.sellingTextLabels

    return (
      <div key='kursinfo-container' className='kursinfo-main-page col' >
        {/* ---COURSE TITEL--- */}
        <CourseTitle key='title'
          courseTitleData={courseAdminData.courseTitleData}
          pageTitle={this.state.enteredEditMode ? pageTitles.editSelling : pageTitles.previewSelling}
          language={courseAdminData.lang}
          />

        {this.state.errMsg ? <Alert color='info'><p>{this.state.errMsg}</p></Alert> : ''}

        {/* ---IF in edit mode or preview mode--- */}
        {this.state.enteredEditMode ? (
          <div className='TextEditor--SellingInfo col'>
            {/* ---TEXT Editors for each language--- */}
            <p>{sellingTextLabels.label_selling_info}</p>
            <span class='Editors--Area' key='editorsArea' role='tablist'>
              <span className='left' key='leftEditorForSwedish'>
                <h3 className='text-center'>{sellingTextLabels.label_sv}</h3>
                <KoppsText header={sellingTextLabels.label_kopps_text_sv} text={courseAdminData.koppsCourseDesc['sv']} label='sv' />
                <p>{sellingTextLabels.label_max_number_letters}</p>
                <p>{sellingTextLabels.label_left_number_letters}<span className='badge badge-warning badge-pill'>{this.state.leftTextSign_sv}</span></p>
                <textarea name='editorSV' id='editorSV' className='editor' style='visibility: hidden; display: none;'>{this.state.sellingText_sv}</textarea>
              </span>
              <span className='right' key='rightEditorForEnglish'>
                <h3 className='text-center'>{sellingTextLabels.label_en}</h3>
                <KoppsText header={sellingTextLabels.label_kopps_text_en} text={courseAdminData.koppsCourseDesc['en']} label='en' />
                <p>{sellingTextLabels.label_max_number_letters}</p>
                <p>{sellingTextLabels.label_left_number_letters}<span className='badge badge-warning badge-pill'>{this.state.leftTextSign_en}</span></p>
                <textarea name='editorEN' id='editorEN' className='editor' style='visibility: hidden; display: none;'>{this.state.sellingText_en}</textarea>
              </span>
            </span>
            <p>{sellingTextLabels.changed_by} {this.state.sellingTextAuthor}</p>
            <span className='button_group' key='controlButtons'>
              <Link to={`/admin/kurser/kurs/${courseCode}?l=${courseAdminData.lang}`} className='btn btn-secondary' alt={sellingTextLabels.altLabel.button_cancel}>
                {sellingTextLabels.sellingTextButtons.button_cancel}
              </Link>
              <Button onClick={this.doPreview} color='primary' alt={sellingTextLabels.altLabel.button_preview} disabled={this.state.isError}>{sellingTextLabels.sellingTextButtons.button_preview}</Button>
            </span>
          </div>
        ) : (
          <Row id='pageContainer' key='pageContainer'>
            {/* <Col sm='1' xs='1' id='left' key='left'> </Col> */}
            <Col id='middle' key='middle'>
              <Row className='courseIntroText'>
                <Col sm='12' xs='12' className='sellingText'>
                  <h3>{sellingTextLabels.label_sv}</h3>
                  <img src={this.props.adminStore.image} alt={sellingTextLabels.altLabel.image} height='auto' width='300px' />
                  {this.state.sellingText_sv === '' ? <TextBlock text={courseAdminData.koppsCourseDesc.sv} /> : <TextBlock text={this.state.sellingText_sv} />}
                </Col>
              </Row>
              <Row className='courseIntroText'>
                <Col sm='12' xs='12' className='sellingText'>
                  <h3>{sellingTextLabels.label_en}</h3>
                  <img src={this.props.adminStore.image} alt={sellingTextLabels.altLabel.image} height='auto' width='300px' />
                  {this.state.sellingText_en === '' ? <TextBlock text={courseAdminData.koppsCourseDesc.en} /> : <TextBlock text={this.state.sellingText_en} />}
                </Col>
              </Row>
              <Row className='button_group'>
                <Link to={`/admin/kurser/kurs/${courseCode}?l=${courseAdminData.lang}`} className='btn btn-secondary'>
                  {sellingTextLabels.sellingTextButtons.button_cancel}
                </Link>
                <Button onClick={this.doChangeText} color='primary' alt={sellingTextLabels.altLabel.button_cancel}>{sellingTextLabels.sellingTextButtons.button_change}</Button>
                <Button onClick={this.doSubmit} color='success' alt={sellingTextLabels.altLabel.button_submit}>{sellingTextLabels.sellingTextButtons.button_submit}</Button>
              </Row>
            </Col>
          </Row>
        )}
      </div>
    )
  }
}

export default SellingInfo
