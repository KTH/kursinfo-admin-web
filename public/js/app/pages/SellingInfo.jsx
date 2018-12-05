import { Component } from 'inferno'
import { inject, observer } from 'inferno-mobx'
import i18n from '../../../../i18n'
// import { Schema } from 'isomorphic-schema'

import CourseTitle from '../components/CourseTitle.jsx'
import Button from 'kth-style-inferno-bootstrap/dist/Button'
// import ButtonGroup from 'kth-style-inferno-bootstrap/dist/ButtonGroup'


@inject(['routerStore']) @observer
class SellingInfo extends Component {
  constructor (props) {
    super(props)
    this.state = {value: 'Initial editor content'}
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)


    // this.state = {
    //   activeRoundIndex: 0,
    //   dropdownsIsOpen: {
    //     dropDown1: false,
    //     dropdown2: false
    //   }
    // }
    // this.handleDropdownChange = this.handleDropdownChange.bind(this)
    // this.handleDropdownSelect = this.handleDropdownSelect.bind(this)
    // this.toggle = this.toggle.bind(this)
  }

  static fetchData (routerStore, params) {
    return routerStore.getCourseInformation('sf1624', 'sv')
      .then((data) => {
        console.log('data', data)
        return courseData = data
      })
  }

  handleSubmit (event) {
    alert('A name was submitted: ' + this.state.value)
    event.preventDefault()
  }

  handleChange (event) {
    this.setState({value: CKEDITOR.instances.editor1.getData()})
    alert('New state is: ' + this.state.value)
  }

  render ({routerStore}) {
    const courseData = routerStore['courseData']
    console.log('routerStore in CoursePage', courseData)
    const courseInformationToRounds = {
      course_code: courseData.coursePlanModel.course_code,
      course_grade_scale: courseData.coursePlanModel.course_grade_scale,
      course_level_code: courseData.coursePlanModel.course_level_code,
      course_main_subject: courseData.coursePlanModel.course_main_subject,
      course_valid_from: courseData.coursePlanModel.course_valid_from
    }

    return (
        <div key='kursinfo-container' className='kursinfo-main-page col' >
            {/* ---COURSE TITEL--- */}
            <CourseTitle key='title'
              courseTitleData={courseData.courseTitleData}
              language={courseData.language}
            />

            {/* ---INTRO TEXT--- */}
            <div id='courseIntroText'
              className='col-12'
              dangerouslySetInnerHTML={{ __html:courseData.coursePlanModel.course_recruitment_text}}>
            </div>
            <form id='editSellingTextForm' onSubmit={this.handleSubmit}>
                <label for='editor1'>
                    Säljandetexten på svenska:
                </label>
                    <textarea name='editor1' id='editor1' value={this.state.value} onChange={this.handleChange}></textarea>
                    <span className='button_group'>
                        <button className='btn btn-secondary' data-bind="click: function() { console.log('hello') }, text: buttonText">Avbryt</button>
                        <button className='btn btn-primary' onClick={this.handleChange}>Granska</button>
                        <button className='btn btn-success' type='submit'>Publicera</button>
                    </span>
            </form>
        </div>
    )
  }
}

export default SellingInfo
