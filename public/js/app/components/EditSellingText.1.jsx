import { Component } from 'inferno'
import { inject, observer } from 'inferno-mobx'
import i18n from '../../../../i18n'
import Button from 'inferno-bootstrap/lib/Button'
import {Link} from 'inferno-router'
import SellingDescEditor from '../components/SellingDescEditor.jsx'

function TextBlock ({text}) {
  return (
    <span className='textBlock' dangerouslySetInnerHTML={{__html: text}}>
    </span>
    )
}

function KoppsText ({header, text, label}) {
  return (
    <div className='courseIntroTextCollapse'>
      <div className='card collapsible'>
        <div className='card-header primary' role='tab' id={'headingWhite' + label} tabindex='0'>
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

function EditorForEachLang (props) {
  const textLang = props.lang
  return (
    <span className={textLang} key='leftEditorForSwedish'>
      <h3 className='text-center'>{props.sellingTextLabels.label[textLang]}</h3>
      <KoppsText header={props.sellingTextLabels.label_kopps_text[textLang]} text={props.koppsCourseDesc} label={textLang} />
      <p>{props.sellingTextLabels.label_max_number_letters}</p>
        {props.children}
    </span>
    )
}

@inject(['adminStore']) @observer
class EditSellingText extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sellingText_sv: this.props.adminStore.sellingText.sv,
      sellingText_en: this.props.adminStore.sellingText.en,
      sellingTextAuthor: this.props.adminStore.sellingTextAuthor,
      leftTextSign_sv: undefined,
      leftTextSign_en: undefined,
      leftTextSign: {
        sv: undefined,
        en: undefined
      },
      isError: false,
      errMsg: ''
    }
    // this.doOpenEditorAndCount = this.doOpenEditorAndCount.bind(this)
  }

  componentDidMount () {
    window.addEventListener('load', this.doOpenEditorAndCount)
  }

  componentWillUnmount () {
    window.removeEventListener('load', this.doOpenEditorAndCount)
  }

//   doOpenEditorAndCount () {
//     var lang = i18n.isSwedish() ? 'sv' : 'en'
//     var langIndex = lang === 'en' ? 0 : 1
//     const translation = i18n.messages[langIndex].pageTitles.alertMessages
//     const conf = {
//       toolbarGroups: [
//         {name: 'mode'},
//         {name: 'find'},
//         {name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ]},
//         {name: 'list'},
//         {name: 'links'},
//         {name: 'about'}
//       ],
//       removeButtons: 'CopyFormatting,Underline,Strike,Subscript,Superscript,Anchor',
//       language: lang,
//       width: ['550px']
//     }
//     const _doCalculateLength = (event, l) => {
//       this.setState({
//         isError: false,
//         errMsg: ''
//       })
//       const cleanText = event.editor.document.getBody().getText().replace(/\n/g, '')
//       const cleanTextLen = cleanText.length
//       const htmlTextLen = event.editor.getData().length
//       if (htmlTextLen > 10000) { // this is max in api
//         this.setState({
//           isError: true,
//           errMsg: translation.over_html_limit
//         })
//       } else if (cleanTextLen > 1500) { // this is an abstract max
//         this.setState({
//           isError: true,
//           errMsg: translation.over_text_limit
//         })
//       } else if (cleanText.trim().length === 0) {
//         this.setState({
//           [`sellingText_${l}`]: ''
//         })
//       } else {
//         this.setState({
//           [`sellingText_${l}`]: event.editor.getData()
//         })
//       }
//       this.setState({[`leftTextSign_${l}`]: 1500 - cleanTextLen})
//     }

//     ['en', 'sv'].map(editorId => {
//       CKEDITOR.replace(editorId, conf)
//       const text = CKEDITOR.instances[editorId].document.getBody().getText().replace(/\n/g, '')
//       this.setState({[`leftTextSign_${editorId}`]: 1500 - text.length})
//     })

//     // CKEDITOR.instances.sv.on('instanceReady', event => {
//     //   const text = event.editor.document.getBody().getText().replace(/\n/g, '')
//     //   this.setState({leftTextSign_sv: 1500 - text.length})
//     // })
//     // CKEDITOR.instances.en.on('instanceReady', event => {
//     //   const text = event.editor.document.getBody().getText().replace(/\n/g, '')
//     //   this.setState({leftTextSign_en: 1500 - text.length})
//     // })
//     CKEDITOR.instances.sv.on('change', event => _doCalculateLength(event, 'sv'))

//     CKEDITOR.instances.en.on('change', event => _doCalculateLength(event, 'en'))
//   }

  render () {
    const courseAdminData = this.props.courseAdminData
    const courseCode = courseAdminData.courseTitleData.course_code
    const sellingTextLabels = this.props.sellingTextLabels
    return (
      <div className='TextEditor--SellingInfo col'>
      {/* ---TEXT Editors for each language--- */}
        <p>{sellingTextLabels.label_selling_info}</p>
        {/* <SellingDescEditor sellingTextLabels={sellingTextLabels} courseAdminData={courseAdminData} /> */}
        <span class='Editors--Area' key='editorsArea' role='tablist'>
        {['sv', 'en'].forEach((lang) =>
          <EditorForEachLang lang={lang} sellingTextLabels={sellingTextLabels} koppsCourseDesc={courseAdminData.koppsCourseDesc[lang]}>
            <p>{sellingTextLabels.label_left_number_letters}<span className='badge badge-warning badge-pill'>{this.state[`leftTextSign_${lang}`]}</span></p>
            <textarea name={lang} id={lang} className='editor' style='visibility: hidden; display: none;'>{this.state.sellingText[lang]}</textarea>
          </EditorForEachLang>
        )}
        </span>


        <span class='Editors--Area' key='editorsArea' role='tablist'>
          <EditorForEachLang lang='sv' key='leftEditorForSwedish' sellingTextLabels={sellingTextLabels.label['sv']}
            koppsCourseDesc={courseAdminData.koppsCourseDesc['sv']} labelKopps={sellingTextLabels.label_kopps_text['sv']}>
            <p>{sellingTextLabels.label_left_number_letters}<span className='badge badge-warning badge-pill'>{this.state.leftTextSign_sv}</span></p>
            <textarea name='sv' id='sv' className='editor' style='visibility: hidden; display: none;'>{this.state.sellingText_sv}</textarea>
          </EditorForEachLang>
          <EditorForEachLang lang='en' key='rightEditorForEnglish' sellingTextLabels={sellingTextLabels.label['en']}
            koppsCourseDesc={courseAdminData.koppsCourseDesc['en']} labelKopps={sellingTextLabels.label_kopps_text['en']}>
            <p>{sellingTextLabels.label_left_number_letters}<span className='badge badge-warning badge-pill'>{this.state.leftTextSign_en}</span></p>
            <textarea name='en' id='en' className='editor' style='visibility: hidden; display: none;'>{this.state.sellingText_en}</textarea>
          </EditorForEachLang>
        </span>


        <span class='Editors--Area' key='editorsArea' role='tablist'>
          <EditorForEachLang lang='sv' key='leftEditorForSwedish' sellingTextLabels={sellingTextLabels} koppsCourseDesc={courseAdminData.koppsCourseDesc['sv']}>
            <p>{sellingTextLabels.label_left_number_letters}<span className='badge badge-warning badge-pill'>{this.state.leftTextSign_sv}</span></p>
            <textarea name='sv' id='sv' className='editor' style='visibility: hidden; display: none;'>{this.state.sellingText_sv}</textarea>
          </EditorForEachLang>
          <EditorForEachLang lang='en' key='rightEditorForEnglish' sellingTextLabels={sellingTextLabels} koppsCourseDesc={courseAdminData.koppsCourseDesc['en']}>
            <p>{sellingTextLabels.label_left_number_letters}<span className='badge badge-warning badge-pill'>{this.state.leftTextSign_en}</span></p>
            <textarea name='en' id='en' className='editor' style='visibility: hidden; display: none;'>{this.state.sellingText_en}</textarea>
          </EditorForEachLang>
        </span>
          {/* <SellingDescEditor loc='left' sellingTextLabels={sellingTextLabels} courseAdminData={courseAdminData} />
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
          </span> */}
        <p>{sellingTextLabels.changed_by} {this.state.sellingTextAuthor}</p>
        <span className='button_group' key='controlButtons'>
          <Link to={`/admin/kurser/kurs/${courseCode}?l=${courseAdminData.lang}`} className='btn btn-secondary' alt={sellingTextLabels.altLabel.button_cancel}>
            {sellingTextLabels.sellingTextButtons.button_cancel}
          </Link>
          <Button onClick={this.props.changeMode} color='primary' alt={sellingTextLabels.altLabel.button_preview} disabled={this.state.isError}>{sellingTextLabels.sellingTextButtons.button_preview}</Button>
        </span>
      </div>
    )
  }
}

export default EditSellingText
