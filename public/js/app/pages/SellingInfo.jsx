import { Component, linkEvent } from 'inferno'
import { inject, observer } from 'inferno-mobx'
import i18n from '../../../../i18n'

import CourseTitle from '../components/CourseTitle.jsx'
import Button from 'inferno-bootstrap/lib/Button'
import Alert from 'inferno-bootstrap/lib/Alert'
import {Link} from 'inferno-router'

import Card from 'inferno-bootstrap/lib/Card/Card'
import CardBody from 'inferno-bootstrap/lib/Card/CardBody'
import CardTitle from 'inferno-bootstrap/lib/Card/CardTitle'
import CardText from 'inferno-bootstrap/lib/Card/CardText'
import CardHeader from 'inferno-bootstrap/lib/Card/CardHeader'
import CardFooter from 'inferno-bootstrap/lib/Card/CardFooter'

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
    <div className='courseIntroText'>
      <div className='card collapsible white'>
        <div className='card-header primary' role='tab' id={'headingWhite' + label}>
          <h4 className='mb-0'>
            <a className='collapse-header' data-toggle='collapse' href={'#collapseWhite' + label} aria-expanded='false' aria-controls={'collapseWhite' + label}>{header}</a>
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
      leftTextSign_sv: undefined,
      leftTextSign_en: undefined,
      enteredEditMode: true,
      hasDoneSubmit: false,
      isError: false, // TODO: en-sv
      errMsg: '', // TODO: en-sv
      isKopps: false
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

  doChangeText (event) { // TODO: better name showing up from gransking to changing instaead of publishing
    event.preventDefault()
    this.setState({
      hasDoneSubmit: false,
      enteredEditMode: true,
      isError: false
    })
    this.doOpenEditorAndCount(event)
    console.log('Do some extra changes to text after Preview or Failed Submission')
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
      console.log('didSubmit')
      this.setState({
        hasDoneSubmit: true,
        isError: false
      })
      this.props.history.push({
        pathname: `/admin/kurser/kurs/${courseCode}?l=${adminStore.courseAdminData.lang}`,
        data: 'success'
      })
    }).catch(err => {
      console.log('#########Eroror', err) // TODO: improve error handling
      this.setState({
        hasDoneSubmit: false,
        isError: true,
        errMsg: 'Failed to post data to API'
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

    CKEDITOR.replace('editorSV', {
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
    })
    CKEDITOR.instances.editorSV.setData(this.state.sellingText_sv)
    CKEDITOR.replace('editorEN', {
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
    })
    CKEDITOR.instances.editorEN.setData(this.state.sellingText_en)

    CKEDITOR.instances.editorSV.on('instanceReady', (event) => {
      const text = event.editor.document.getBody().getText().replace(/\n/g, '')
      this.setState({leftTextSign_sv: 1500 - text.length})
    })
    CKEDITOR.instances.editorEN.on('instanceReady', (event) => {
      const text = event.editor.document.getBody().getText().replace(/\n/g, '')
      this.setState({leftTextSign_en: 1500 - text.length})
    })
    CKEDITOR.instances.editorSV.on('change', (event) => {
      this.setState({
        isError: false,
        errMsg: ''
      })
      const cleanText = event.editor.document.getBody().getText().replace(/\n/g, '')
      const cleanTextLen = cleanText.length
      console.log('cleanTextLencleanTextLen', cleanText.trim().length)
      const htmlTextLen = event.editor.getData().length
      if (htmlTextLen > 10000) { // this is max in api
        this.setState({
          isError: true,
          errMsg: 'Din html texten måste vara mindre än 10 000 tecken'
        })
      } else if (cleanTextLen > 1500) { // this is an abstract max
        this.setState({
          isError: true,
          errMsg: 'Din texten måste vara mindre än 1 500 tecken'
        })
      } else if (cleanText.trim().length === 0) {
        this.setState({
          sellingText_sv: '',
          errMsg: 'Om säljande text är tomt då ersättades det med kopps kortberskrivning'
        })
      } else {
        this.setState({
          sellingText_sv: event.editor.getData()
        })
      }
      console.log('HTLM text length: ', htmlTextLen)
      this.setState({leftTextSign_sv: 1500 - cleanTextLen})
    })

    CKEDITOR.instances.editorEN.on('change', (event) => {
      this.setState({
        isError: false,
        errMsg: ''
      })
      const cleanText = event.editor.document.getBody().getText().replace(/\n/g, '')
      const cleanTextLen = cleanText.length
      console.log('cleanTextLencleanTextLen', cleanText.trim().length)
      const htmlTextLen = event.editor.getData().length
      if (htmlTextLen > 10000) { // this is max in api
        this.setState({
          isError: true,
          errMsg: 'Din html texten måste vara mindre än 10 000 tecken'
        })
      } else if (cleanTextLen > 1500) { // this is an abstract max
        this.setState({
          isError: true,
          errMsg: 'Din texten måste vara mindre än 1 500 tecken'
        })
      } else if (cleanText.trim().length === 0) {
        this.setState({
          sellingText_en: '',
          errMsg: ''
        })
      } else {
        this.setState({
          sellingText_en: event.editor.getData()
        })
      }
      console.log('HTLM text length: ', htmlTextLen)
      this.setState({leftTextSign_en: 1500 - cleanTextLen})
    })
  }

  render ({adminStore}) {
    const courseAdminData = adminStore['courseAdminData']
    const lang = courseAdminData.lang === 'en' ? 0 : 1
    const courseCode = courseAdminData.courseTitleData.course_code

    return (
      <div key='kursinfo-container' className='kursinfo-main-page col' >
        {/* ---COURSE TITEL--- */}
        <CourseTitle key='title'
          courseTitleData={courseAdminData.courseTitleData}
          pageTitle={this.state.enteredEditMode ? i18n.messages[lang].pageTitles.editSelling : i18n.messages[lang].pageTitles.previewSelling}
          language={courseAdminData.lang}
          />

        {this.state.errMsg ? <Alert color='info'><p>{this.state.errMsg}</p></Alert> : ''}

        {/* ---IF in edit mode or preview mode--- */}
        {this.state.enteredEditMode ? (
          <div className='TextEditor--SellingInfo col'>
            {/* ---TEXT Editors for each language--- */}
            <p>{i18n.messages[lang].sellingTextLabels.label_selling_info}</p>
            <span class='Editors--Area'>
              <span className='left'>
                <h3 className='text-center'>{i18n.messages[lang].sellingTextLabels.label_sv}</h3>
                <KoppsText header={i18n.messages[lang].sellingTextLabels.label_kopps_text_sv} text={courseAdminData.koppsCourseDesc['sv']} label='sv' />
                <p>{i18n.messages[lang].sellingTextLabels.label_max_number_letters}</p>
                <p>{i18n.messages[lang].sellingTextLabels.label_left_number_letters}<span className='badge badge-warning badge-pill'>{this.state.leftTextSign_sv}</span></p>
                <textarea name='editorSV' id='editorSV' style='visibility: hidden; display: none;'>{this.state.sellingText}</textarea>
              </span>
              <span className='right'>
                <h3 className='text-center'>{i18n.messages[lang].sellingTextLabels.label_en}</h3>
                <KoppsText header={i18n.messages[lang].sellingTextLabels.label_kopps_text_en} text={courseAdminData.koppsCourseDesc['en']} label='en' />
                <p>{i18n.messages[lang].sellingTextLabels.label_max_number_letters}</p>
                <p>{i18n.messages[lang].sellingTextLabels.label_left_number_letters}<span className='badge badge-warning badge-pill'>{this.state.leftTextSign_en}</span></p>
                <textarea name='editorEN' id='editorEN' style='visibility: hidden; display: none;'>{this.state.sellingText}</textarea>
              </span>
            </span>
            <span className='button_group'>
              <Link to={`/admin/kurser/kurs/${courseCode}?l=${courseAdminData.lang}`} className='btn btn-secondary'>
                {i18n.messages[lang].sellingTextButtons.button_cancel}
              </Link>
              <Button onClick={this.doPreview} color='primary' disabled={this.state.isError}>{i18n.messages[lang].sellingTextButtons.button_preview}</Button>
            </span>
          </div>
        ) : (
         // <div className='Description--TextBlock row'>
          <Row>
            <Col sm='1' xs='1'></Col>
            <Col sm='10' xs='12'>
              <Row className='courseIntroText'>
                <Col>
                  <h3>{i18n.messages[lang].sellingTextLabels.label_sv}</h3>
                  <img src={this.props.adminStore.image} alt='' height='auto' width='300px' />
                  {this.state.sellingText_sv === '' ? <TextBlock text={courseAdminData.koppsCourseDesc.sv} /> : <TextBlock text={this.state.sellingText_sv} />}
                </Col>
              </Row>
              <Row className='courseIntroText'>
                <Col>
                  <h3>{i18n.messages[lang].sellingTextLabels.label_en}</h3>
                  <img src={this.props.adminStore.image} alt='' height='auto' width='300px' />
                  {this.state.sellingText_en === '' ? <TextBlock text={courseAdminData.koppsCourseDesc.en} /> : <TextBlock text={this.state.sellingText_en} />}
                </Col>
              </Row>
              <Row className='button_group'>
                <Link to={`/admin/kurser/kurs/${courseCode}?l=${courseAdminData.lang}`} className='btn btn-secondary'>
                  {i18n.messages[lang].sellingTextButtons.button_cancel}
                </Link>
                <Button onClick={this.doChangeText} color='primary'>{i18n.messages[lang].sellingTextButtons.button_change}</Button>
                <Button onClick={this.doSubmit} color='success'>{i18n.messages[lang].sellingTextButtons.button_submit}</Button>
              </Row>
            </Col>
          </Row>
          // </div>
        )}
      </div>
    )
  }
}

export default SellingInfo
