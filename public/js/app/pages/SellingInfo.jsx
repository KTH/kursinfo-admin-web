import { Component } from 'inferno'
import { inject, observer } from 'inferno-mobx'
import i18n from '../../../../i18n'

import CourseTitle from '../components/CourseTitle.jsx'
import KoppsTextCollapse from '../components/KoppsTextCollapse.jsx'
import PreviewText from '../components/PreviewText.jsx'
import Button from 'inferno-bootstrap/lib/Button'
import Alert from 'inferno-bootstrap/lib/Alert'
import {Link} from 'inferno-router'
import Row from 'inferno-bootstrap/dist/Row'
import Col from 'inferno-bootstrap/dist/Col'

const userLang = i18n.isSwedish() ? 'sv' : 'en'
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
  language: userLang,
  width: ['98%']
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
        pathname: `/kipadministration/kurser/kurs/${courseCode}?l=${adminStore.courseAdminData.lang}`,
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
    CKEDITOR.instances.sv.destroy(true)
    CKEDITOR.instances.en.destroy(true)
  }

  doOpenEditorAndCount () {
    var langIndex = userLang === 'en' ? 0 : 1
    const translation = i18n.messages[langIndex].pageTitles.alertMessages
    const _doCalculateLength = (event, editorId) => {
      const text = event.editor.document.getBody().getText().replace(/\n/g, '')
      const length = text.length
      this.setState({[`leftTextSign_${editorId}`]: 1500 - length,
        isError: false,
        errMsg: ''
      })
      return [text, length]
    }
    const _doCheckTextLength = (event, l) => {
      const [cleanText, cleanTextLen] = _doCalculateLength(event, l)
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
          [`sellingText_${l}`]: ''
        })
      } else {
        this.setState({
          [`sellingText_${l}`]: htmlText
        })
      }
    }
    ['sv', 'en'].map((editorId) => {
      CKEDITOR.replace(editorId, editorConf)
      CKEDITOR.instances[editorId].on('instanceReady', event => _doCalculateLength(event, editorId))
      CKEDITOR.instances[editorId].on('change', event => _doCheckTextLength(event, editorId))
    })
  }

  render ({adminStore}) {
    const courseAdminData = adminStore['courseAdminData']
    const lang = courseAdminData.lang === 'en' ? 0 : 1
    const courseCode = courseAdminData.courseTitleData.course_code
    const translation = i18n.messages[lang]
    const pageTitles = translation.pageTitles
    const sellingTextLabels = translation.sellingTextLabels
    let courseImage = translation.courseImage[courseAdminData.image_file_name]
    if (courseImage === undefined) courseImage = translation.courseImage.default
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
            <h2>{sellingTextLabels.label_step_1}</h2>
            <p>{sellingTextLabels.label_selling_info}</p>
            <span class='Editors--Area' key='editorsArea' role='tablist'>
              <span className='left' key='leftEditorForSwedish'>
                <KoppsTextCollapse instructions={sellingTextLabels}
                  koppsText={courseAdminData.koppsCourseDesc['sv']} lang='sv' />
                <p>{sellingTextLabels.label_left_number_letters}<span className='badge badge-warning badge-pill'>{this.state.leftTextSign_sv}</span></p>
                <textarea name='sv' id='sv' className='editor' style='visibility: hidden; display: none;'>{this.state.sellingText_sv}</textarea>
              </span>
              <span className='right' key='rightEditorForEnglish'>
                <KoppsTextCollapse instructions={sellingTextLabels}
                  koppsText={courseAdminData.koppsCourseDesc['en']} lang='en' />
                <p>{sellingTextLabels.label_left_number_letters}<span className='badge badge-warning badge-pill'>{this.state.leftTextSign_en}</span></p>
                <textarea name='en' id='en' className='editor' style='visibility: hidden; display: none;'>{this.state.sellingText_en}</textarea>
              </span>
            </span>
            <p className='changed-by'>{sellingTextLabels.changed_by} {this.state.sellingTextAuthor}</p>
            <Row className='control-buttons'>
              <Col sm='4'>
              </Col>
              <Col sm='4' className='btn-cancel'>
                <Link to={`/kipadministration/kurser/kurs/${courseCode}?l=${courseAdminData.lang}`} className='btn btn-secondary text-center' alt={sellingTextLabels.altLabel.button_cancel}>
                  {sellingTextLabels.sellingTextButtons.button_cancel}
                </Link>
              </Col>
              <Col sm='4' className='btn-next'>
                <Button onClick={this.doPreview} color='success' alt={sellingTextLabels.altLabel.button_preview} disabled={this.state.isError}>
                  {sellingTextLabels.sellingTextButtons.button_preview}
                </Button>
              </Col>
            </Row>
          </div>
        ) : (
          <div className='col'>
            <h2>{sellingTextLabels.label_step_2}</h2>
            <Row id='pageContainer' key='pageContainer'>
              <Col sm='12' xs='12' lg='12' id='middle' key='middle'>
                <PreviewText sellingTextLabels={sellingTextLabels} whichLang='sv'
                  image={courseImage}
                  sellingText={this.state.sellingText_sv} koppsTexts={courseAdminData.koppsCourseDesc} />
                <PreviewText sellingTextLabels={sellingTextLabels} whichLang='en'
                  image={courseImage}
                  sellingText={this.state.sellingText_en} koppsTexts={courseAdminData.koppsCourseDesc} />
                <Row className='control-buttons'>
                  <Col sm='4' className='btn-back'>
                    <Button onClick={this.doChangeText} alt={sellingTextLabels.altLabel.button_cancel}>{sellingTextLabels.sellingTextButtons.button_change}</Button>
                  </Col>
                  <Col sm='4' className='btn-cancel'>
                    <Link to={`/kipadministration/kurser/kurs/${courseCode}?l=${courseAdminData.lang}`} className='btn btn-secondary'>
                      {sellingTextLabels.sellingTextButtons.button_cancel}
                    </Link>
                  </Col>
                  <Col sm='4' className='btn-last'>
                    <Button onClick={this.doSubmit} color='success' alt={sellingTextLabels.altLabel.button_submit}>
                      {sellingTextLabels.sellingTextButtons.button_submit}
                    </Button>
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
