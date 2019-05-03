import { Component } from 'inferno'
import { inject, observer } from 'inferno-mobx'
import i18n from '../../../../i18n'
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

@inject(['adminStore']) @observer
class SellingDescEditor extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sellingText: {
        sv: this.props.adminStore.sellingText.sv,
        en: this.props.adminStore.sellingText.en
      },
      sellingText_sv: this.props.adminStore.sellingText.sv,
      sellingText_en: this.props.adminStore.sellingText.en,
      leftTextSign_sv: undefined,
      leftTextSign_en: undefined

    //   isError: false,
    //   errMsg: ''
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
    ['sv', 'en'].map(editorId => {
      CKEDITOR.replace(editorId, conf)
      CKEDITOR.instances[editorId].on('instanceReady', event => {
        const text = event.editor.document.getBody().getText().replace(/\n/g, '')
        this.setState({[`leftTextSign_${editorId}`]: 1500 - text.length})
      })
      CKEDITOR.instances[editorId].on('change', event => _doCalculateLength(event, editorId))
    })
  }

  render () {
    const courseAdminData = this.props.courseAdminData
    const sellingTextLabels = this.props.sellingTextLabels
    const lang = this.props.lang

    return (
      <span class='Editors--Area' key='editorsArea' role='tablist'>
        {['sv', 'en'].map((lang) =>
          <EditorForEachLang lang={lang} sellingTextLabels={sellingTextLabels} koppsCourseDesc={courseAdminData.koppsCourseDesc[lang]}>
            <p>{sellingTextLabels.label_left_number_letters}<span className='badge badge-warning badge-pill'>{this.state[`leftTextSign_${lang}`]}</span></p>
            <textarea name={lang} id={lang} className='editor' style='visibility: hidden; display: none;'>{this.state.sellingText[lang]}</textarea>
          </EditorForEachLang>
        )}
      </span>
    //   <span className={lang} key='leftEditorForSwedish'>
    //     <h3 className='text-center'>{sellingTextLabels.label[lang]}</h3>
    //     <KoppsText header={sellingTextLabels.label_kopps_text_sv} text={courseAdminData.koppsCourseDesc[lang]} label={lang} />
    //     <p>{sellingTextLabels.label_max_number_letters}</p>
    //     <p>{sellingTextLabels.label_left_number_letters}<span className='badge badge-warning badge-pill'>{this.state[`leftTextSign_${lang}`]}</span></p>
    //     <textarea name={lang} id={lang} className='editor' style='visibility: hidden; display: none;'>{this.state.sellingText[lang]}</textarea>
    //   </span>

      )
  }
  }

export default SellingDescEditor
