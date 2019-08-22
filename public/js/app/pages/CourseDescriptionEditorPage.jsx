import { Component } from 'inferno'
import { inject, observer } from 'inferno-mobx'
import i18n from '../../../../i18n'

import CourseTitle from '../components/CourseTitle.jsx'
import Button from 'inferno-bootstrap/lib/Button'
import Alert from 'inferno-bootstrap/lib/Alert'
import {Link} from 'inferno-router'
import Row from 'inferno-bootstrap/dist/Row'
import Col from 'inferno-bootstrap/dist/Col'

import { KURSINFO_IMAGE_BLOB_URL } from '../util/constants'

import PictureUpload from './PictureUpload.jsx'
import SellingInfo from './SellingInfo.jsx'



@inject(['adminStore']) @observer
class CourseDescriptionEditorPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      enteredUploadMode: this.props.adminStore.enteredUploadMode
    }
    this.courseAdminData = this.props.adminStore.courseAdminData
    this.courseCode = this.courseAdminData.courseTitleData.course_code
    this.userLang = this.courseAdminData.lang
    this.langIndex = this.courseAdminData.lang === 'en' ? 0 : 1
    this.doNextStep = this.doNextStep.bind(this)
  }
  doNextStep () {
    // event.preventDefault()
    this.setState({
      enteredUploadMode: false
    })
  }

  render ({adminStore}) {
    // this.props.adminStore.courseAdminData.courseTitleData.course_code = 'aaaaaa'
    const { courseAdminData, courseCode, userLang, langIndex } = this
    const { courseImage, pageTitles, sellingTextLabels } = i18n.messages[langIndex]
    let courseImageID = courseImage[courseAdminData.imageFileName]
    if (courseImageID === undefined) courseImageID = courseImage.default
    const imageUrl = `${KURSINFO_IMAGE_BLOB_URL}${courseImageID}`
    return (
        <div key='kursinfo-container' className='kursinfo-main-page col'>
        {/* ---COURSE TITEL--- */}
        <CourseTitle key='title'
          courseTitleData={courseAdminData.courseTitleData}
          pageTitle={this.state.enteredEditMode ? pageTitles.editSelling : pageTitles.previewSelling}
          language={userLang}
          />
        {this.state.enteredUploadMode
            ? <PictureUpload imageUrl={imageUrl} sellingTextLabels={sellingTextLabels}
              courseAdminData={courseAdminData}
              nextStep={this.doNextStep} />
            : <SellingInfo courseAdminData={courseAdminData} />
          }
        </div>
      )
  }

}

export default CourseDescriptionEditorPage
