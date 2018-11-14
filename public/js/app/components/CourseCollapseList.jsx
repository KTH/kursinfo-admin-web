import { Component } from 'inferno'
import { inject, observer } from 'inferno-mobx'
import { globalRegistry } from 'component-registry'

import i18n from "../../../../i18n"
import CourseCollapse from './CourseCollapse.jsx'
import { EMPTY } from '../util/constants';

@inject(['routerStore']) @observer
class CourseCollapseList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      openMenue: 0,
      store:this.props.routerStore["courseData"]
    }
  }

  getIntro(translation){
    const course = this.state.store.coursePlanModel
    const round = this.state.store.courseRoundList[this.props.roundIndex]
    const intro = [
      {header: translation.courseRoundInformation.round_target_group, text: round ? round.round_target_group : EMPTY },
      {header: translation.courseRoundInformation.round_part_of_programme, text:round ? round.round_part_of_programme : EMPTY },
      {header: translation.courseRoundInformation.round_time_slots, text: round ?round.round_time_slots : EMPTY },
      {header: translation.courseRoundInformation.round_periods, text: round ?round.round_periods : EMPTY },
      {header: translation.courseRoundInformation.round_end_date, text: round ?round.round_end_date : EMPTY },
      {header: translation.courseRoundInformation.round_max_seats, text: round ? round.round_max_seats : EMPTY },

      {header:translation.courseInformation.course_eligibility, text:course.course_eligibility},
      {header:translation.courseInformation.course_content, text:course.course_content},
      {header:translation.courseInformation.course_goals, text:course.course_goals},
      {header:translation.courseInformation.course_disposition, text:course.course_disposition}
    
    ]
    return intro
  }

  getPrepare(translation){
    const course = this.state.store.coursePlanModel
    const round = this.state.store.courseRoundList[this.props.roundIndex]
    const prepare = [
      {header:translation.courseInformation.course_suggested_addon_studies, text:course.course_suggested_addon_studies},
      {header:translation.courseInformation.course_required_equipment, text:course.course_required_equipment},
      {header:translation.courseInformation.course_literature, text:course.course_literature},

      {header: translation.courseRoundInformation.round_teacher, text:round ? round.round_teacher : EMPTY },
      {header: translation.courseRoundInformation.round_time_slots, text:round ? round.round_responsibles : EMPTY },
      {header: translation.courseRoundInformation.round_schedule, text:round ? round.round_schedule : EMPTY}
      
    ]
    return prepare
  }

  getDuring(translation){
    const course = this.state.store.coursePlanModel
    const round = this.state.store.courseRoundList[this.props.roundIndex]
    const during = [
      {header:"Kurs-PM", text:"Här visas kurs-PM"},
      {header:"Canavas länk", text:"Länk till Canavas"},
      {header:"Kurswebb länk??", text:"Visas här? Endast om den är ikryssad i admin?"}

    ]
    return during
  }

  getFinalize(translation){
    const course = this.state.store.coursePlanModel
    const prepare = [
      {header:translation.courseInformation.course_examination, text:course.course_examination},
      {header:translation.courseInformation.course_examination_comments, text:course.course_examination_comments},
      {header:translation.courseInformation.course_requirments_for_final_grade, text:course.course_requirments_for_final_grade},
      {header:translation.courseInformation.course_examiners, text:course.course_examiners}
    ]
    return prepare
  }

  getOther(translation){
    const course = this.state.store.coursePlanModel
    const prepare = [
      {header:translation.courseInformation.course_department, text:course.course_department},
      {header:translation.courseInformation.course_contact_name, text:course.course_contact_name},
      {header:translation.courseInformation.course_supplemental_information, text:course.course_supplemental_information},
      {header:translation.courseInformation.course_supplemental_information_url, text:course.course_supplemental_information_url},
      {header:translation.courseInformation.course_supplemental_information_url_text, text:course.course_supplemental_information_url_text}
    ]
    return prepare
  }
  

  render({ routerStore }) {
    //console.log(this.routerStore)
    const translation = i18n.messages[this.state.store.language]
    return (
      <div>
        <CourseCollapse courseData = {this.getIntro(translation)} header={translation.courseInformationLabels.label_course_intro} className="collapseHeader" isOpen={false} color="blue"/>
        <CourseCollapse courseData = {this.getPrepare(translation)} header={translation.courseInformationLabels.label_course_prepare} className="collapseHeader" isOpen={false} color="blue"/>
        <CourseCollapse courseData = {this.getDuring(translation)} header={translation.courseInformationLabels.label_course_during} className="collapseHeader" isOpen={false} color="blue"/>
        <CourseCollapse courseData = {this.getFinalize(translation)} header={translation.courseInformationLabels.label_course_finalize} className="collapseHeader" isOpen={false} color="blue"/>
        <CourseCollapse courseData = {this.getOther(translation)} header={translation.courseInformationLabels.label_course_other} className="collapseHeader" isOpen={false} color="blue"/>
      </div>  
    )
  }
}

export default CourseCollapseList