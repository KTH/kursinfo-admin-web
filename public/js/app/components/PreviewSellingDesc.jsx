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

function TextBlockForEachLang ({src, alt, text, langLabel}) {
  return (
    <Row className='courseIntroText'>
      <Col sm='12' xs='12' className='sellingText'>
        <h3>{langLabel}</h3>
        <img src={src} alt={alt} height='auto' width='300px' />
        <TextBlock text={text} />
      </Col>
    </Row>
  )
}

@inject(['adminStore']) @observer
class PreviewSellingDesc extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sellingText_sv: this.props.adminStore.sellingText.sv,
      sellingText_en: this.props.adminStore.sellingText.en,
      errMsg: ''
    }
    this.doSubmit = this.doSubmit.bind(this)
  }

  doSubmit (event) {
    event.preventDefault()
    const adminStore = this.props.adminStore
    const courseCode = adminStore.courseAdminData.courseTitleData.course_code
    const sellingTexts = {
      sv: this.state.sellingText_sv,
      en: this.state.sellingText_en
    }
    console.log('saaaasellingText', sellingTexts)
    console.log('saaaasellingTextcourseCode', courseCode)
    adminStore.doUpsertItem(sellingTexts, courseCode).then(() => {
      this.context.router.history.push({
        pathname: `/admin/kurser/kurs/${courseCode}?l=${adminStore.courseAdminData.lang}`,
        data: 'success'
      })
    }).catch(err => {
      var langIndex = i18n.isSwedish() ? 1 : 0
      console.log('FAILED')
      this.setState({
        // hasDoneSubmit: false,
        // isError: true,
        errMsg: i18n.messages[langIndex].pageTitles.alertMessages.api_error
      })
    })
  }

  render () {
    const courseAdminData = this.props.courseAdminData
    const sellingTextLabels = this.props.sellingTextLabels
    const imageAltLabel = sellingTextLabels.altLabel.image
    const imageSrc = this.props.adminStore.image

    return (
      <Row id='pageContainer' key='pageContainer'>
        {this.state.errMsg ? <Alert color='info'><p>{this.state.errMsg}</p></Alert> : ''}
        <Col id='middle' key='middle'>
          <TextBlockForEachLang text={this.state.sellingText_sv === '' ? courseAdminData.koppsCourseDesc.sv : this.state.sellingText_sv}
            langLabel={sellingTextLabels.label_sv}
            alt={imageAltLabel}
            src={imageSrc}
            />
          <TextBlockForEachLang text={this.state.sellingText_en === '' ? courseAdminData.koppsCourseDesc.en : this.state.sellingText_en}
            langLabel={sellingTextLabels.label_en}
            alt={imageAltLabel}
            src={imageSrc}
            />
          <Row className='button_group'>
            <Link to={`/admin/kurser/kurs/${courseAdminData.courseTitleData.course_code}?l=${courseAdminData.lang}`} className='btn btn-secondary'>
              {sellingTextLabels.sellingTextButtons.button_cancel}
            </Link>
            <Button onClick={this.props.changeMode} color='primary' alt={sellingTextLabels.altLabel.button_cancel}>{sellingTextLabels.sellingTextButtons.button_change}</Button>
            <Button onClick={this.doSubmit} color='success' alt={sellingTextLabels.altLabel.button_submit}>{sellingTextLabels.sellingTextButtons.button_submit}</Button>
          </Row>
        </Col>
      </Row>
    )
  }
}

export default PreviewSellingDesc
