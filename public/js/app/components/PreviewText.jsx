import Row from 'inferno-bootstrap/dist/Row'
import Col from 'inferno-bootstrap/dist/Col'
import { Component } from 'inferno'
import { inject, observer } from 'inferno-mobx'
import i18n from '../../../../i18n'

import KoppsTextCollapse from '../components/KoppsTextCollapse.jsx'
import Button from 'inferno-bootstrap/lib/Button'
import Alert from 'inferno-bootstrap/lib/Alert'
import ButtonModal from '../components/ButtonModal.jsx'

import { KURSINFO_IMAGE_BLOB_URL } from '../util/constants'


function PreviewText ({introLabel, whichLang, imageUrl, sellingText, koppsTexts}) {
  const text = sellingText === '' ? koppsTexts[whichLang] : sellingText
  return (
    <Row className='courseIntroText'>
      <Col sm='12' xs='12' className='sellingText'>
        <h3>{introLabel.langLabel[whichLang]}</h3>
        <img src={imageUrl} alt={introLabel.alt.image} height='auto' width='300px' />
        <span className='textBlock' dangerouslySetInnerHTML={{__html: text}}></span>
      </Col>
    </Row>
    )
}

@inject(['adminStore']) @observer
class PreviewText1 extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sv: this.props.adminStore.sellingText.sv,
      en: this.props.adminStore.sellingText.en,
      sellingTextAuthor: this.props.adminStore.sellingTextAuthor,
      leftTextSign_sv: undefined,
      leftTextSign_en: undefined,
      enteredEditMode: true,
      hasDoneSubmit: false,
      isError: false,
      errMsg: ''
    }
    this.courseAdminData = this.props.adminStore.courseAdminData
    this.courseCode = this.courseAdminData.courseTitleData.course_code
    this.userLang = this.courseAdminData.lang
    this.langIndex = this.courseAdminData.lang === 'en' ? 0 : 1
    this.sellingTexts = {
      sv: this.state.sv,
      en: this.state.en
    }
    this.goToEditMode = this.goToEditMode.bind(this)
    this.handlePublish = this.handlePublish.bind(this)
  }
}

export default PreviewText
