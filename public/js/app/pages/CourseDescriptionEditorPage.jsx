import { Component } from 'inferno'
import { inject, observer } from 'inferno-mobx'
import i18n from '../../../../i18n'

import CourseTitle from '../components/CourseTitle.jsx'
import { KURSINFO_IMAGE_BLOB_URL } from '../util/constants'
import ProgressBar from '../components/ProgressBar.jsx'
import PictureUpload from './PictureUpload.jsx'
import SellingInfo from './SellingInfo.jsx'
import Preview from '../components/PreviewText.jsx'

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
      progress: 1
    }
    this.koppsData = this.props.adminStore.koppsData
    this.courseCode = this.koppsData.courseTitleData.course_code
    this.userLang = this.koppsData.lang
    this.langIndex = this.koppsData.lang === 'en' ? 0 : 1
    this.doUpdateStates = this.doUpdateStates.bind(this)
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

  render () {
    const { koppsData, userLang, langIndex } = this
    const { courseImage, introLabel } = i18n.messages[langIndex]
    let courseImageID = courseImage[koppsData.defaultPicName]
    if (courseImageID === undefined) courseImageID = courseImage.default
    const defaultImageUrl = `${KURSINFO_IMAGE_BLOB_URL}${courseImageID}`
    return (
      <div key='kursinfo-container' className='kursinfo-main-page col'>
        <CourseTitle key='title'
          courseTitleData={koppsData.courseTitleData}
          pageTitle={introLabel.editCourseIntro}
          language={userLang}
          />
        <ProgressBar active={this.state.progress} language={langIndex} />
        {this.state.progress === 1
        ? <PictureUpload defaultImageUrl={defaultImageUrl} introLabel={introLabel}
          koppsData={koppsData}
          updateParent={this.doUpdateStates} />
        : this.state.progress === 2
          ? <SellingInfo koppsData={koppsData} updateParent={this.doUpdateStates}
          />
          : <Preview introLabel={introLabel} defaultImageUrl={defaultImageUrl}
            updateParent={this.doUpdateStates} /* uploadFinalPic={this.handleUploadImage} */
          />
        }
      </div>
    )
  }

}

export default CourseDescriptionEditorPage
