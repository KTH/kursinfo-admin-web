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
  // if koppsVisibilityStatus === 'isPreview':
  //   style = {opacity: }

  // else if koppsVisibilityStatus === 'hidden':
  // else:

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

function AlertMessage ({hasDoneSubmit, errorMsg}) {
  if (hasDoneSubmit && !errorMsg) {
    return (
      <Alert color='success'>
        <p>Texten uppdaterad</p>
      </Alert>
    )
  } else if (errorMsg) {
    return (
      <Alert color='info'>
        <p>Nånting gick fel</p>
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
      // textLength: 0,
      leftTextSign: undefined, // 5000 - this.props.adminStore.sellingText.replace(/<("[^"]*"|'[^']*'|[^'">])*>/gi, '').replace(/^\s+|\s+$/g, '').length,
      errorMsg: false
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
      errorMsg: false
    })
    CKEDITOR.instances.editor1.destroy(true)
    console.log('doCancelled')
  }

  doChangeText (event) { // TODO: able to come back here after wrong submission
    event.preventDefault()
    this.setState({
      hasDoneSubmit: false,
      enteredEditMode: true,
      errorMsg: false
    })
    this.doOpenEditorAndCount(event)
    console.log('Do some extra changes to text after Preview or Failed Submission')
  }

  doStartTextEditor (event) {
    event.preventDefault()
    this.setState({
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
        // editDescription: false,
        errorMsg: false,
        enteredEditMode: false
      })
    }).catch(err => {
      console.log('#########Eroror', err) // TODO: improve error handling
      this.setState({
        hasDoneSubmit: false,
        errorMsg: true
        // enteredEditMode: false
      })
    })
  }

  doPreview (event) {
    event.preventDefault()
    this.setState({
      sellingText: CKEDITOR.instances.editor1.getData(),
      enteredEditMode: false,
      errorMsg: false
    })
    CKEDITOR.instances.editor1.destroy(true)
    console.log('Enter Preview Mode', this.state.sellingText)
  }

  doOpenEditorAndCount (event) {
    CKEDITOR.replace('editor1', {
      toolbarGroups: [
          { name: 'mode' },
          { name: 'basicstyles' }
      ]
    })
    CKEDITOR.instances.editor1.on('instanceReady', (event) => {
      const text = event.editor.document.getBody().getText().replace(/\n/g, '')
      this.setState({leftTextSign: 5000 - text.length})
    })
    CKEDITOR.instances.editor1.on('change', (event) => {
      const text = event.editor.document.getBody().getText().replace(/\n/g, '')
      const htmlText = event.editor.getData().length
      console.log('HTLM text length: ', htmlText)
      console.log('Clean text Length:', text.length)
      this.setState({leftTextSign: 5000 - text.length})
    })
  }

  render ({adminStore}) {
    const courseAdminData = adminStore['courseAdminData']
    console.log('routerStore in CoursePage', courseAdminData)
    // console.log('SELLLING TEXT', this.state.sellingText)

    return (
      <div key='kursinfo-container' className='kursinfo-main-page col' >
        {/* ---COURSE TITEL--- */}
        <CourseTitle key='title'
          courseTitleData={courseAdminData.courseTitleData}
          language={courseAdminData.language}
            />

          {/* ---IF in edit mode or not--- */}

        {this.state.editDescription === true ? (
          <div className='AdminPage--EditDescription col'>

            <KoppsText className='koppsText' koppsVisibilityStatus={this.state.reviewEditedText}
              text={courseAdminData.koppsCourseDesc.course_recruitment_text} />
            {/* ---In edit mode 2 conditions, if editing text or previewing before publishing */}
            {this.state.enteredEditMode ? (
              <div className='TextEditor--SellingInfo'>
                {/* ---INTRO TEXT Editor--- */}
                <h3>Kortbeskrivning from KOPPS</h3>
                <KoppsText className='koppsText' koppsVisibilityStatus='isEditing'
                  text={courseAdminData.koppsCourseDesc.course_recruitment_text} />
                <h3>Kurssäljande information som kommer ersätta kortbeskrivning från koops</h3>
                <h4>Maximal längd på text är 5000. Det kvar <span class='badge badge-danger badge-pill'>{this.state.leftTextSign}</span> tecken att använda.</h4>
                <textarea name='editor1' id='editor1'>{this.state.sellingText}</textarea>
                <span className='button_group'>
                  <Button onClick={this.doCancel} color='secondary'>Avbryt</Button>
                  <Button onClick={this.doPreview} color='primary'>Förhandsgranska</Button>
                </span>
              </div>
            ) : (
              <div className='Description--TextBlock'>
                <AlertMessage hasDoneSubmit={this.state.hasDoneSubmit} errorMsg={this.state.errorMsg} />
                {/* ---INTRO TEXT Editor 2 steg Granska innan Publicering--- */}
                <TextBlock text={this.state.sellingText} />
                <span className='button_group'>
                  <Button onClick={this.doCancel} color='secondary'>Avbryt</Button>
                  <Button onClick={this.doChangeText} color='primary'>Redigera / Andra texten</Button>
                  <Button onClick={this.doSubmit} color='success'>Publicera</Button>
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className='AdminPage--ShowDescription row'>
            <Card className='KursInfo--SellingText'>
              <CardBody>
                <CardTitle>Kurssäljande information</CardTitle>
                <CardText>Lägg till kurssäljande information för att tydligare förklare varför studenter behöver den kursen</CardText>
                {/* <CardText><TextBlock text={this.state.sellingText} /></CardText> */}
              </CardBody>
              <CardFooter className='text-right'><Button onClick={this.doStartTextEditor} color='primary'>Lägg till kortbeskrivning</Button></CardFooter>
            </Card>
            <Card>
              <CardBody>
                <CardTitle>Kurs-PM</CardTitle>
                <CardText>Lägg till kurs-pm information som PDF</CardText>
                {/* <CardText><TextBlock text={this.state.sellingText} /></CardText> */}
              </CardBody>
              <CardFooter className='text-right'><Button onClick={this.doEnterEditor} color='primary'>Ladda upp kurs-pm</Button></CardFooter>
            </Card>
            <Card>
              <CardBody>
                <CardTitle>Kursutveckling</CardTitle>
                <CardText>Lägg till kurssäljande information för att tydligare förklare varför studenter behöver den kursen</CardText>
                {/* <CardText><TextBlock text={this.state.sellingText} /></CardText> */}
              </CardBody>
              <CardFooter className='text-right'><Button onClick={this.doEnterEditor} color='primary'>Lägg till kursutveckling</Button></CardFooter>
            </Card>
          </div>
        )}
      </div>
    )
  }
}

export default SellingInfo
