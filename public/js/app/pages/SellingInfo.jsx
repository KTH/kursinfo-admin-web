import { Component, linkEvent } from 'inferno'
import { inject, observer } from 'inferno-mobx'
import i18n from '../../../../i18n'

import CourseTitle from '../components/CourseTitle.jsx'
import Container from 'kth-style-inferno-bootstrap/dist/Container'
import Button from 'inferno-bootstrap/lib/Button'
// import Col from 'inferno-bootstrap/lib/Col'
// import Form from 'inferno-bootstrap/lib/Form/Form'
// import Input from 'inferno-bootstrap/lib/Form/Input'
// import Row from 'inferno-bootstrap/lib/Row'
import Card from 'inferno-bootstrap/lib/Card/Card'
import CardBody from 'inferno-bootstrap/lib/Card/CardBody'
import CardTitle from 'inferno-bootstrap/lib/Card/CardTitle'
import CardText from 'inferno-bootstrap/lib/Card/CardText'
import CardFooter from 'inferno-bootstrap/lib/Card/CardFooter'
import CardHeader from 'inferno-bootstrap/lib/Card/CardHeader'
import Alert from 'inferno-bootstrap/lib/Alert'

function TextBlock ({text}) {
  return (
    <span className='textBlock' dangerouslySetInnerHTML={{__html: text}}>
    </span>
    )
}

function SellingTextContainer ({mode, text}) { // redo, isEditing, isPreviewing,
  return (
    <form id='editSellingTextForm'>
      <label for='editor1'>
          Säljandetexten på svenska:
      </label>
      {mode === 'isEditing' ? (
        <div>
          <textarea name='editor1' id='editor1'>{{text}}</textarea>
          <span className='button_group'>
            <button className='btn btn-secondary'>Avbryt</button>
            <button className='btn btn-primary'>Granska</button>
            <button className='btn btn-success' type='submit'>Publicera</button>
          </span>
        </div>
      ) : (
        <div>
          <TextBlock text={text} />
          <span className='button_group'>
            <button className='btn btn-secondary'>Avbryt</button>
            <button className='btn btn-primary'>Redigera</button>
            <button className='btn btn-success' type='submit'>Publicera</button>
          </span>
        </div>
      )}
    </form>
  )
}

function KoppsText ({className, koppsVisibilityStatus, text}) {
  return (
    <div id='courseIntroText'>
    {koppsVisibilityStatus === 'isEditing' ?
      (<TextBlock text={text} />
      ) : (
      <div id='courseIntroText'>
      </div>)
    }
    </div>
  )
}

function AlertMessage ({hasDoneSubmit, isError, errMsg}) {
  if (hasDoneSubmit && !isError) {
    return (
      <Alert color='success'>
        <p>Texten uppdaterad</p>
      </Alert>
    )
  } else if (isError) {
    return (
      <Alert color='info'>
        <p>{errMsg}</p>
      </Alert>
    )
  }
}

@inject(['adminStore']) @observer
class SellingInfo extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sellingText: this.props.adminStore.sellingText,
      enteredEditMode: false,
      hasDoneSubmit: false,
      editDescription: false,
      validationError: undefined,
      leftTextSign: undefined, // 5000 - this.props.adminStore.sellingText.replace(/<("[^"]*"|'[^']*'|[^'">])*>/gi, '').replace(/^\s+|\s+$/g, '').length,
      isError: false,
      errMsg: 'Something went wrong'
    }
    this.doStartTextEditor = this.doStartTextEditor.bind(this)
    this.doCancel = this.doCancel.bind(this)
    this.doChangeText = this.doChangeText.bind(this)
    this.doPreview = this.doPreview.bind(this)
    this.doSubmit = this.doSubmit.bind(this)
    this.doOpenEditorAndCount = this.doOpenEditorAndCount.bind(this)
  }

  doCancel (event) {
    event.preventDefault()
    this.setState({
      sellingText: this.props.adminStore.sellingText,
      editDescription: false,
      enteredEditMode: false,
      hasDoneSubmit: false,
      isError: false
    })
    CKEDITOR.instances.editor1.destroy(true)
    console.log('doCancelled')
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

  doStartTextEditor (event) {
    event.preventDefault()
    this.setState({
      hasDoneSubmit: false,
      editDescription: true,
      enteredEditMode: true
    })
    this.doOpenEditorAndCount(event)
    console.log('Open Editor')
  }

  // Made able to submit only after review mode to avoid 'silly' submission
  // TODO: Before submission remove all empty spaces, like
    //   <p>&nbsp;</p>
    //
    // <p>&nbsp;</p>
  doSubmit (event) {
    event.preventDefault()
    const adminStore = this.props.adminStore
    const value = this.state.sellingText
    const courseCode = adminStore.courseAdminData.courseTitleData.course_code
    adminStore.doUpsertItem(value, courseCode).then(() => {
      console.log('didSubmit')
      this.setState({
        hasDoneSubmit: true,
        editDescription: false,
        isError: false,
        enteredEditMode: false
      })
    }).catch(err => {
      console.log('#########Eroror', err) // TODO: improve error handling
      this.setState({
        hasDoneSubmit: false,
        isError: true,
        errMsg: 'Failed to post data to API'
        // enteredEditMode: false
      })
    })
  }

  doPreview (event) {
    event.preventDefault()
    this.setState({
      sellingText: CKEDITOR.instances.editor1.getData(),
      enteredEditMode: false,
      isError: false
    })
    CKEDITOR.instances.editor1.destroy(true)
    console.log('Enter Preview Mode', this.state.sellingText)
  }

  doOpenEditorAndCount (event) {
    var lang = i18n.isSwedish() ? 'sv' : 'en'

    CKEDITOR.replace('editor1', {
      language: lang,
      removeButtons: 'Mathjax,Save,NewPage,Print,Templates,Cut,Copy,Paste,PasteText,PasteFromWord,Preview,Undo,Redo,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Underline,Strike,Subscript,Superscript,CopyFormatting,Blockquote,CreateDiv,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock,BidiLtr,BidiRtl,Language,Anchor,Math,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Styles,Font,FontSize,TextColor,BGColor,ShowBlocks'

    })
    CKEDITOR.instances.editor1.on('instanceReady', (event) => {
      const text = event.editor.document.getBody().getText().replace(/\n/g, '')
      this.setState({leftTextSign: 5000 - text.length})
    })
    CKEDITOR.instances.editor1.on('change', (event) => {
      this.setState({
        isError: false,
        errMsg: ''
      })
      const cleanTextLen = event.editor.document.getBody().getText().replace(/\n/g, '').length
      const htmlTextLen = event.editor.getData().length
      if (htmlTextLen > 10000) { // this is max in api
        this.setState({
          isError: true,
          errMsg: 'Din html texten måste vara mindre än 10 000 tecken'
        })
      } else if (cleanTextLen > 5000) { // this is abstract max
        this.setState({
          isError: true,
          errMsg: 'Din texten måste vara mindre än 5 000 tecken'
        })
      }
      console.log('HTLM text length: ', htmlTextLen)
      console.log('Clean text Length:', cleanTextLen)
      this.setState({leftTextSign: 5000 - cleanTextLen})
    })
  }

  render ({adminStore}) {
    const courseAdminData = adminStore['courseAdminData']
    console.log('routerStore in CoursePage', courseAdminData)
    const language = courseAdminData.language === 'en' ? 0 : 1
    // console.log('SELLLING TEXT', this.state.sellingText)

    return (
      <div key='kursinfo-container' className='kursinfo-main-page col' >
        {/* ---COURSE TITEL--- */}
        <CourseTitle key='title'
          courseTitleData={courseAdminData.courseTitleData}
          language={courseAdminData.language}
            />

          {/* ---IF in edit mode or not--- */}

        <AlertMessage hasDoneSubmit={this.state.hasDoneSubmit} isError={this.state.isError} errMsg={this.state.errMsg} />

        {this.state.editDescription === true ? (
          <div className='AdminPage--EditDescription col'>

            <KoppsText className='koppsText' koppsVisibilityStatus={this.state.reviewEditedText}
              text={courseAdminData.koppsCourseDesc.course_recruitment_text} />
            {/* ---In edit mode 2 conditions, if editing text or previewing before publishing */}
            {this.state.enteredEditMode ? (
              <div className='TextEditor--SellingInfo'>
                {/* ---INTRO TEXT Editor--- */}
                <h3>{i18n.messages[language].sellingTextLabels.label_kopps_text}</h3>
                <KoppsText className='koppsText' koppsVisibilityStatus='isEditing'
                  text={courseAdminData.koppsCourseDesc.course_recruitment_text} />
                <h3>{i18n.messages[language].sellingTextLabels.label_selling_text}</h3>
                <p>{i18n.messages[language].sellingTextLabels.label_selling_info}</p>
                {/* FILTER */}
                <p className='filter'>
                  <span><a href='#' className='active'>{i18n.messages[language].sellingTextLabels.label_sv}</a></span>
                  <span><a href='#' className=''>{i18n.messages[language].sellingTextLabels.label_en}</a></span>
                </p>
                <p>{i18n.messages[language].sellingTextLabels.label_selling_text_length}<span class='badge badge-danger badge-pill'>{this.state.leftTextSign}</span></p>
                <textarea name='editor1' id='editor1'>{this.state.sellingText}</textarea>
                <span className='button_group'>
                  <Button onClick={this.doCancel} color='secondary'>{i18n.messages[language].sellingTextButtons.button_cancel}</Button>
                  <Button onClick={this.doPreview} color='primary' disabled={this.state.isError}>{i18n.messages[language].sellingTextButtons.button_preview}</Button>
                </span>
              </div>
            ) : (
              <div className='Description--TextBlock'>
                {/* ---INTRO TEXT Editor 2 steg Granska innan Publicering--- */}
                <TextBlock text={this.state.sellingText} />
                <span className='button_group'>
                  <Button onClick={this.doCancel} color='secondary'>{i18n.messages[language].sellingTextButtons.button_cancel}</Button>
                  <Button onClick={this.doChangeText} color='primary'>{i18n.messages[language].sellingTextButtons.button_change}</Button>
                  <Button onClick={this.doSubmit} color='success'>{i18n.messages[language].sellingTextButtons.button_submit}</Button>
                </span>
              </div>
            )}
          </div>
        ) : (
          <div>
            <span className='Header--Button'>
              <a href={`/student/kurser/kurs/${courseAdminData.courseTitleData.course_code}?l=${courseAdminData.language}`} class='link-back'>{i18n.messages[language].sellingTextButtons.button_course_info}</a>
            </span>
            <span className='AdminPage--ShowDescription row'>
              <Card className='KursInfo--SellingText'>
                <CardBody>
                  <CardTitle>{i18n.messages[language].startCards.sellingText_hd}</CardTitle>
                  <CardText>{i18n.messages[language].startCards.sellingText_desc}</CardText>
                  {/* <CardText><TextBlock text={this.state.sellingText} /></CardText> */}
                </CardBody>
                <CardFooter className='text-right'><Button onClick={this.doStartTextEditor} color='primary'>{i18n.messages[language].startCards.sellingText_btn}</Button></CardFooter>
              </Card>
              <Card>
                <CardBody>
                  <CardTitle>{i18n.messages[language].startCards.coursePM_hd}</CardTitle>
                  <CardText>{i18n.messages[language].startCards.coursePM_desc}</CardText>
                  {/* <CardText><TextBlock text={this.state.sellingText} /></CardText> */}
                </CardBody>
                <CardFooter className='text-right'><Button onClick={this.doEnterEditor} color='primary'>{i18n.messages[language].startCards.coursePM_btn}</Button></CardFooter>
              </Card>
              <Card>
                <CardBody>
                  <CardTitle>{i18n.messages[language].startCards.courseDev_hd}</CardTitle>
                  <CardText>{i18n.messages[language].startCards.courseDev_decs}</CardText>
                  {/* <CardText><TextBlock text={this.state.sellingText} /></CardText> */}
                </CardBody>
                <CardFooter className='text-right'><Button onClick={this.doEnterEditor} color='primary'>{i18n.messages[language].startCards.courseDev_btn}</Button></CardFooter>
              </Card>
            </span>
          </div>
        )}
      </div>
    )
  }
}

export default SellingInfo
