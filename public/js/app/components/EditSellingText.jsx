import { Component } from 'inferno'
import { inject, observer } from 'inferno-mobx'
import i18n from '../../../../i18n'
import Button from 'inferno-bootstrap/lib/Button'
import {Link} from 'inferno-router'
import Alert from 'inferno-bootstrap/lib/Alert'
import Collapse from 'inferno-bootstrap/dist/Collapse'
// import SellingDescEditor from '../components/SellingDescEditor.jsx'

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
  width: ['550px']
}
const TextBlock = ({text}) => {
  return (
    <span className='textBlock' dangerouslySetInnerHTML={{__html: text}}>
    </span>
    )
}

const KoppsText = ({header, text, label}) => {
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

// class EditorForEachLang extends Component {
//   // componentDidMount () {
//   //   window.addEventListener('load', this.props.handler)
//   // }
//   // componentWillUnmount () {
//   //   window.removeEventListener('load', this.doOpenEditorAndCount)
//   // }
//   render () {
//     const textLang = this.props.lang
//     return (
//         <span className={textLang}>
//           <h3 className='text-center'>{this.props.sellingTextLabels}</h3>
//           <KoppsText header={this.props.labelKopps} text={this.props.koppsCourseDesc} label={textLang} />
//           <p>{this.props.sellingTextLabels.label_max_number_letters}</p>
//             {this.props.children}
//         </span>
//         )
//   }
//   }

const EditorForEachLang = (props) => {
  const textLang = props.lang
  return (
    <span className={textLang}>
      <h3 className='text-center'>{props.sellingTextLabels}</h3>
      <KoppsText header={props.labelKopps} text={props.koppsCourseDesc} label={textLang} />
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
    this.doOpenEditorAndCount = this.doOpenEditorAndCount.bind(this)
  }

  componentDidMount () {
    window.addEventListener('load', this.doOpenEditorAndCount)
  }

  componentWillUnmount () {
    window.removeEventListener('load', this.doOpenEditorAndCount)
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

  render () {
    const courseAdminData = this.props.courseAdminData
    const sellingTextLabels = this.props.sellingTextLabels
    return (
      <div className='TextEditor--SellingInfo col'>
        {this.state.errMsg ? <Alert color='info'><p>{this.state.errMsg}</p></Alert> : ''}
        <p>{sellingTextLabels.label_selling_info}</p>
        <span class='Editors--Area' key='editorsArea' role='tablist'>
        {['sv', 'en'].map((lang) =>
          <EditorForEachLang lang={lang} sellingTextLabels={sellingTextLabels.label[lang]}
            koppsCourseDesc={courseAdminData.koppsCourseDesc[lang]} labelKopps={sellingTextLabels.label_kopps_text[lang]} handler={this.doOpenEditorAndCount}>
            <p>{sellingTextLabels.label_left_number_letters}<span className='badge badge-warning badge-pill'>{this.state[`leftTextSign_${lang}`]}</span></p>
            <textarea name={lang} id={lang} className='editor' style='visibility: hidden; display: none;'>{this.state[`sellingText_${lang}`]}</textarea>
          </EditorForEachLang>
        )}
        </span>

        <p>{sellingTextLabels.changed_by} {this.state.sellingTextAuthor}</p>
        <span className='button_group' key='controlButtons'>
          <Link to={`/admin/kurser/kurs/${courseAdminData.courseTitleData.course_code}?l=${courseAdminData.lang}`} className='btn btn-secondary' alt={sellingTextLabels.altLabel.button_cancel}>
            {sellingTextLabels.sellingTextButtons.button_cancel}
          </Link>
          <Button onClick={this.props.changeMode} color='primary' alt={sellingTextLabels.altLabel.button_preview} disabled={this.state.isError}>{sellingTextLabels.sellingTextButtons.button_preview}</Button>
        </span>
      </div>
    )
  }
}

export default EditSellingText
