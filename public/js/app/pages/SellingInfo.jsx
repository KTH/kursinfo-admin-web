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

// function filterClick (e) {
//   var selector = e.target.getAttribute('data-lang-selector')
//   console.log('selector ', selector)
//   if (selector) {
//     var filter = e.target.closest('.filter'),
//       section = filter.closest('.TextEditor--SellingInfo'),
//       active = filter.querySelector('a.active')
//     console.log('if selelctore')
//     if (active) {
//       console.log('active ')
//       active.classList.remove('active')
//       section.classList.remove(active.getAttribute('data-lang-selector'))
//     }
//     e.target.classList.add('active')
//     e.target.blur()
//     section.classList.add(selector)
//     e.preventDefault()
//     e.stopPropagation()
//   }
// }

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
      isError: false,
      errMsg: '',
      isKopps: false
    }
    this.doChangeText = this.doChangeText.bind(this)
    this.doPreview = this.doPreview.bind(this)
    this.doSubmit = this.doSubmit.bind(this)
    this.doOpenEditorAndCount = this.doOpenEditorAndCount.bind(this)
    // this.doSwitchTextLang = this.doSwitchTextLang.bind(this)
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
      // sellingText: CKEDITOR.instances.editor1.getData(), need to treem and replace empty space
      enteredEditMode: false,
      isError: false
    })
    CKEDITOR.instances.editorSV.destroy(true)
    CKEDITOR.instances.editorEN.destroy(true)
  }

  // doSwitchTextLang (event) {
  //   filterClick(event)
  //   const lang = event.target.getAttribute('data-lang-selector')
  //   this.setState({
  //     textLang: lang,
  //     sellingText: this.props.adminStore.sellingText[lang]
  //   })
  //   CKEDITOR.instances.editor1.setData(this.state.sellingText)
  // }

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
          errMsg: 'Om säljande text är tomt då ersättades det med kopps kortberskrivning'
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
    console.log('SELLING TEXT sv', this.state.sellingText_sv)
    console.log('SELLING TEXT en', this.state.sellingText_en)

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
              {/* ---TEXT Editors for each language--- */}
              <h3>{i18n.messages[lang].sellingTextLabels.label_kopps_text}</h3>
              <KoppsText text={courseAdminData.koppsCourseDesc['sv']} />
              <h3>{i18n.messages[lang].sellingTextLabels.label_selling_text}</h3>
              <p>{i18n.messages[lang].sellingTextLabels.label_selling_info}</p>
              <p>{i18n.messages[lang].sellingTextLabels.label_selling_text_length}</p>
              {/* FILTER */}
              {/* <p className='filter'>
                <span><a href='#' onclick={this.doSwitchTextLang} data-lang-selector='sv' className='active'>{i18n.messages[lang].sellingTextLabels.label_sv}</a></span>
                <span><a href='#' onclick={this.doSwitchTextLang} data-lang-selector='en' className=''>{i18n.messages[lang].sellingTextLabels.label_en}</a></span>
              </p> */}
              <span class='Editors--Area'>
                <span>
                  <p>{i18n.messages[lang].sellingTextLabels.label_left_number_letters}<span class='badge badge-warning badge-pill'>{this.state.leftTextSign_sv}</span></p>
                  <textarea name='editorSV' id='editorSV' style='visibility: hidden; display: none;'>{this.state.sellingText}</textarea>
                </span>
                <span>
                  <p>{i18n.messages[lang].sellingTextLabels.label_left_number_letters}<span class='badge badge-warning badge-pill'>{this.state.leftTextSign_en}</span></p>
                  <textarea name='editorEN' id='editorEN' style='visibility: hidden; display: none;'>{this.state.sellingText}</textarea>
                </span>
              </span>
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
              <p>Svensk</p>
              {this.state.sellingText_sv === '' ? <KoppsText text={courseAdminData.koppsCourseDesc.sv} /> : <TextBlock text={this.state.sellingText_sv} />}
              <p>Engelsk</p>
              {this.state.sellingText_en === '' ? <KoppsText text={courseAdminData.koppsCourseDesc.en} /> : <TextBlock text={this.state.sellingText_en} />}

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
