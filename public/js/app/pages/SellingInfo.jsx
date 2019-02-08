import { Component, linkEvent } from 'inferno'
import { inject, observer } from 'inferno-mobx'
import i18n from '../../../../i18n'

import CourseTitle from '../components/CourseTitle.jsx'
import Button from 'inferno-bootstrap/lib/Button'
import Alert from 'inferno-bootstrap/lib/Alert'
import {Link} from 'inferno-router'

function TextBlock ({text}) {
  return (
    <span className='textBlock' dangerouslySetInnerHTML={{__html: text}}>
    </span>
    )
}

function KoppsText ({text}) {
  return (
    <div id='courseIntroText'>
      <TextBlock text={text} />
    </div>
  )
}

function filterClick (e) {
  var selector = e.target.getAttribute('data-lang-selector')
  console.log('selector ', selector)
  if (selector) {
    var filter = e.target.closest('.filter'),
      section = filter.closest('.TextEditor--SellingInfo'),
      active = filter.querySelector('a.active')
    console.log('if selelctore')
    if (active) {
      console.log('active ')
      active.classList.remove('active')
      section.classList.remove(active.getAttribute('data-lang-selector'))
    }
    e.target.classList.add('active')
    e.target.blur()
    section.classList.add(selector)
    e.preventDefault()
    e.stopPropagation()
  }
}

@inject(['adminStore']) @observer
class SellingInfo extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sellingText: this.props.adminStore.sellingText.sv,
      textLang: 'sv',
      enteredEditMode: true,
      hasDoneSubmit: false,
      leftTextSign: undefined,
      isError: false,
      errMsg: '',
      isKopps: false
    }
    this.doChangeText = this.doChangeText.bind(this)
    this.doPreview = this.doPreview.bind(this)
    this.doSubmit = this.doSubmit.bind(this)
    this.doOpenEditorAndCount = this.doOpenEditorAndCount.bind(this)
    this.doSwitchTextLang = this.doSwitchTextLang.bind(this)
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
    adminStore.doUpsertItem(this.state.sellingText, courseCode, this.state.textLang).then(() => {
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
      // sellingText: CKEDITOR.instances.editor1.getData(), need to treem and replace empty space
      enteredEditMode: false,
      isError: false
    })
    CKEDITOR.instances.editor1.destroy(true)
    console.log('Enter Preview Mode', this.state.sellingText)
  }

  doSwitchTextLang (event) {
    filterClick(event)
    const lang = event.target.getAttribute('data-lang-selector')
    this.setState({
      textLang: lang,
      sellingText: this.props.adminStore.sellingText[lang]
    })
    CKEDITOR.instances.editor1.setData(this.state.sellingText)
  }

  doOpenEditorAndCount () {
    var lang = i18n.isSwedish() ? 'sv' : 'en'

    CKEDITOR.replace('editor1', {
      toolbarGroups: [
        {name: 'mode'},
        {name: 'find'},
        {name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ]},
        {name: 'list'},
        {name: 'links'},
        {name: 'about'}
      ],
      removeButtons: 'CopyFormatting,Underline,Strike,Subscript,Superscript,Anchor',
      language: lang

    })
    CKEDITOR.instances.editor1.on('instanceReady', (event) => {
      const text = event.editor.document.getBody().getText().replace(/\n/g, '')
      this.setState({leftTextSign: 1500 - text.length})
      console.log('tetetete', text)
    })
    CKEDITOR.instances.editor1.on('change', (event) => {
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
          sellingText: '',
          errMsg: 'Om säljande text är tomt då ersättades det med kopps kortberskrivning'
        })
      } else {
        this.setState({
          sellingText: event.editor.getData()
        })
      }
      console.log('HTLM text length: ', htmlTextLen)
      this.setState({leftTextSign: 1500 - cleanTextLen})
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
          language={courseAdminData.lang}
            />

        {this.state.errMsg ? <Alert color='info'><p>{this.state.errMsg}</p></Alert> : ''}

        <div className='AdminPage--EditDescription col'>
          {/* ---IF in edit mode or preview mode--- */}
          {this.state.enteredEditMode ? (
            <div className='TextEditor--SellingInfo'>
              {/* ---INTRO TEXT Editor--- */}
              <h3>{i18n.messages[lang].sellingTextLabels.label_kopps_text}</h3>
              <KoppsText text={courseAdminData.koppsCourseDesc[this.state.textLang]} />
              <h3>{i18n.messages[lang].sellingTextLabels.label_selling_text}</h3>
              <p>{i18n.messages[lang].sellingTextLabels.label_selling_info}</p>
              {/* FILTER */}
              <p className='filter'>
                <span><a href='#' onclick={this.doSwitchTextLang} data-lang-selector='sv' className='active'>{i18n.messages[lang].sellingTextLabels.label_sv}</a></span>
                <span><a href='#' onclick={this.doSwitchTextLang} data-lang-selector='en' className=''>{i18n.messages[lang].sellingTextLabels.label_en}</a></span>
              </p>
              <p>{i18n.messages[lang].sellingTextLabels.label_selling_text_length}<span class='badge badge-danger badge-pill'>{this.state.leftTextSign}</span></p>
              <textarea name='editor1' id='editor1' style='visibility: hidden; display: none;'>{this.state.sellingText}</textarea>
              <span className='button_group'>
                <Link to={`/admin/kurser/kurs/start/${courseCode}?l=${courseAdminData.lang}`} className='btn btn-secondary'>
                  {i18n.messages[lang].sellingTextButtons.button_cancel}
                </Link>
                <Button onClick={this.doPreview} color='primary' disabled={this.state.isError}>{i18n.messages[lang].sellingTextButtons.button_preview}</Button>
              </span>
            </div>
          ) : (
            <div className='Description--TextBlock'>
              {/* ---INTRO TEXT Editor 2 steg Granska innan Publicering--- */}
              {this.state.sellingText === '' ? <KoppsText text={courseAdminData.koppsCourseDesc[this.state.textLang]} /> : <TextBlock text={this.state.sellingText} />}
              <span className='button_group'>
                <Link to={`/admin/kurser/kurs/start/${courseCode}?l=${courseAdminData.lang}`} className='btn btn-secondary'>
                  {i18n.messages[lang].sellingTextButtons.button_cancel}
                </Link>
                <Button onClick={this.doChangeText} color='primary'>{i18n.messages[lang].sellingTextButtons.button_change}</Button>
                <Button onClick={this.doSubmit} color='success'>{i18n.messages[lang].sellingTextButtons.button_submit}</Button>
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default SellingInfo
