import { Component } from 'inferno'
import { inject, observer } from 'inferno-mobx'
import i18n from '../../../../i18n'

import CourseTitle from '../components/CourseTitle.jsx'
import { KURSINFO_IMAGE_BLOB_URL } from '../util/constants'
import ProgressBar from '../components/ProgressBar.jsx'
import PictureUpload from './PictureUpload.jsx'
import SellingInfo from './SellingInfo.jsx'
import Progress from 'inferno-bootstrap/dist/Progress'

const _getTodayDate = (date = '') => {
  let today = date.length > 0 ? new Date(date) : new Date()
  let dd = String(today.getDate()).padStart(2, '0')
  let mm = String(today.getMonth() + 1).padStart(2, '0') // January is 0!
  let yyyy = today.getFullYear()
  return yyyy + '-' + mm + '-' + dd
}

@inject(['adminStore']) @observer
class CourseDescriptionEditorPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      // enteredUploadMode: this.props.adminStore.enteredUploadMode,
      progress: 1,
      isNewFile: false, // ????
      imageFile: undefined,
      fileProgress: 0, // ???
      isPublished: 'published' // false
    }
    this.courseAdminData = this.props.adminStore.courseAdminData
    this.courseCode = this.courseAdminData.courseTitleData.course_code
    this.userLang = this.courseAdminData.lang
    this.langIndex = this.courseAdminData.lang === 'en' ? 0 : 1
    // this.doNextStep = this.doNextStep.bind(this)
    this.doUpdateStates = this.doUpdateStates.bind(this)
    this.handleUploadImage = this.handleUploadImage.bind(this)
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
  }

  _handleAction () {
    console.log('MAYBE UPLOAD FILE')
  }

  doUpdateStates (states) {
    console.log('WOHO', states)
    if (states) this.setState(states)
    this._handleAction()
  }

  handleUploadImage (/** */) {
    const formData = this.state.imageFile
    const thisInstance = this
    let fileProgress = this.state.fileProgress
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest()
      req.upload.addEventListener('progress', event => {
        if (event.lengthComputable) {
          fileProgress = (event.loaded / event.total) * 100
          console.log(fileProgress)
          this.setState({ fileProgress: fileProgress })
        }
      })

      req.onreadystatechange = function () {
        // console.log('onreadystatechange values', values)

        if (this.readyState === 4 && this.status === 200) {
          if (formData) {
            thisInstance.state.fileSavedDate = _getTodayDate()
            thisInstance.setState({
              isError: false, // todo: remove
              successMsg: 'Success', // i18n.messages[thisInstance.props.routerStore.language].messages.alert_uploaded_file,
              errMsg: undefined,
              hasNewUploadedImage: true
            })
            console.log('Ura 1', thisInstance.state)
          }
          console.log('Ura 2')
        }
      }
      req.open('POST',
        `${this.props.adminStore.browserConfig.hostUrl}${this.props.adminStore.paths.storage.saveFile.uri.split(':')[0]}${this.courseCode}/${this.state.isPublished}`)
      req.send(formData)
    })
  }

  render () {
    const { courseAdminData, userLang, langIndex } = this
    const { courseImage, introLabel } = i18n.messages[langIndex]
    let courseImageID = courseImage[courseAdminData.imageFileName]
    if (courseImageID === undefined) courseImageID = courseImage.default
    const imageUrl = `${KURSINFO_IMAGE_BLOB_URL}${courseImageID}`
    return (
      <div key='kursinfo-container' className='kursinfo-main-page col'>
        <CourseTitle key='title'
          courseTitleData={courseAdminData.courseTitleData}
          pageTitle={introLabel.editCourseIntro}
          language={userLang}
          />
        <ProgressBar active={this.state.progress} language={langIndex} />
        {this.state.progress === 1
        ? <PictureUpload imageUrl={imageUrl} introLabel={introLabel}
          courseAdminData={courseAdminData}
          updateParent={this.doUpdateStates} />
        : <SellingInfo courseAdminData={courseAdminData} updateParent={this.doUpdateStates}
          uploadFinalPic={this.handleUploadImage}
          />
        }
        <span>
          <div className='text-center'>{this.state.fileProgress}%</div>
          <Progress value={this.state.fileProgress} />
        </span>
      </div>
    )
  }

}

export default CourseDescriptionEditorPage
