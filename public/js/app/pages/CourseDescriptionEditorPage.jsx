import { Component } from 'inferno'
import { inject, observer } from 'inferno-mobx'
import i18n from '../../../../i18n'

import CourseTitle from '../components/CourseTitle.jsx'
import { KURSINFO_IMAGE_BLOB_URL } from '../util/constants'
import ProgressBar from '../components/ProgressBar.jsx'

import PictureUpload from './PictureUpload.jsx'
import SellingInfo from './SellingInfo.jsx'

@inject(['adminStore']) @observer
class CourseDescriptionEditorPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      enteredUploadMode: this.props.adminStore.enteredUploadMode,
      progress: 1
    }
    this.courseAdminData = this.props.adminStore.courseAdminData
    this.courseCode = this.courseAdminData.courseTitleData.course_code
    this.userLang = this.courseAdminData.lang
    this.langIndex = this.courseAdminData.lang === 'en' ? 0 : 1
    this.doNextStep = this.doNextStep.bind(this)
  }
  componentDidMount () {
    console.log('componentDidMount')
  }

  componentWillUnmount () {
    console.log('componentDidMount')
  }

  componentDidUpdate () {
    console.log('componentDidUpdate')
  }

  componentWillReceiveProps (nextProps) {
    console.log('componentWillReceiveProps')
    // if (nextProps.scrollTop !== 0) {
    //   this.setState({scrollTop: nextProps.scrollTop})
    // }
  }
  doNextStep (isNewFile, tempFile, progress) {
    // event.preventDefault()
    console.log('efter next step event', isNewFile, tempFile)
    this.setState({
      isNewFile,
      tempFile,
      enteredUploadMode: false,
      progress
    })
  }
  render ({adminStore}) {
    const { courseAdminData, userLang, langIndex } = this
    const { courseImage, pageTitles, sellingTextLabels } = i18n.messages[langIndex]
    let courseImageID = courseImage[courseAdminData.imageFileName]
    if (courseImageID === undefined) courseImageID = courseImage.default
    const imageUrl = `${KURSINFO_IMAGE_BLOB_URL}${courseImageID}`
    return (
      <div key='kursinfo-container' className='kursinfo-main-page col'>
        {/* ---COURSE TITEL--- */}
        <CourseTitle key='title'
          courseTitleData={courseAdminData.courseTitleData}
          pageTitle={pageTitles.edit_course_introduction}
          language={userLang}
          />
        <ProgressBar active={this.state.progress} language={langIndex} />
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
