import { Component } from 'inferno'
import { inject, observer } from 'inferno-mobx'
import i18n from '../../../../i18n'

import CourseTitle from '../components/CourseTitle.jsx'
import EditSellingText from '../components/EditSellingText.jsx'
import PreviewSellingDesc from '../components/PreviewSellingDesc.jsx'

@inject(['adminStore']) @observer
class new_SellingInfo extends Component {
  constructor (props) {
    super(props)
    this.state = {
      enteredEditMode: true,
      // isError: false, it is used only in edit mode to disable button
      errMsg: ''
    }
    this.doPreview = this.doPreview.bind(this)
    this.doEdit = this.doEdit.bind(this)
  }
  doPreview (event) {
    event.preventDefault()
    this.setState({
      enteredEditMode: false,
      errMsg: ''
    })

    CKEDITOR.instances.editorSV.destroy(true)
    CKEDITOR.instances.editorEN.destroy(true)
  }
  doEdit (event) {
    event.preventDefault()
    console.log('SUCCESS doEdit', this.props)

    this.setState({
      enteredEditMode: true,
      errMsg: ''
    })
  }
  // doSetErrorMsg
  render ({adminStore}) {
    const courseAdminData = adminStore['courseAdminData']
    const translation = i18n.messages[courseAdminData.lang === 'sv' ? 1 : 0] // move it to pagetitles

    return (
      <div key='kursinfo-container' className='kursinfo-main-page col' >
        {/* ---COURSE TITEL--- */}
        <CourseTitle key='title'
          courseTitleData={courseAdminData.courseTitleData}
          mode={this.state.enteredEditMode}
          language={courseAdminData.lang}
          />
        {/* ---IF in edit mode or preview mode--- */}
        {this.state.enteredEditMode ? (
          <EditSellingText changeMode={this.doPreview} courseAdminData={courseAdminData}
            sellingTextLabels={translation.sellingTextLabels} />
        ) : (
          <PreviewSellingDesc changeMode={this.doEdit} courseAdminData={courseAdminData}
            sellingTextLabels={translation.sellingTextLabels} />
        )}
      </div>
    )
  }
}

export default new_SellingInfo
