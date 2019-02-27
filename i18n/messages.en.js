module.exports = {
  shortNames: [ 'en' ],
  longNameSe: 'Engelska',
  longNameEn: 'English',
  messages: {
    /**
     * General stuff
     */
    date_format_short: '%d-%b-%Y',

    /**
     * Error messages
     */

    error_not_found: 'Sorry, we can\'t find your requested page',
    error_generic: 'Something went wrong on the server, please try again later.',

    /**
     * Message keys
     */
    service_name: 'course information administation',

    example_message_key: 'This is an english translation of a label',

    button_label_example: 'Click me to send data to server!',

    field_text_example: 'Data to be sent to API',

    field_label_get_example: 'My modelData(Response from api call GET): ',
    field_label_post_example: 'My modelData(Response from api call POST): ',

    lang_block_id: '1.77273',
    locale_text: 'Course information administration in English',

    site_name: 'Course information administration',
    host_name: 'KTH',
    page_admin: 'ADMIN AT KTH COURSE INFORMATION',
    page_course_programme: 'COURSE AND PROGRAMME DIRECTORY'
  },
  alertMessages: {
    success: 'Data has been saved successfully',
    over_text_limit: 'You exceeded the limit of letters. The text must have no more 1 500',
    over_html_limit: 'HTML texten should be less than 10 000 signs',
    api_error: 'Failed to post data to API'
  },
  altLabel: {
    start_link_back: 'To course information page',
    sellingText_btn: 'Edit selling description',
    coursePM_btn: 'Create course PM',
    courseDev_btn: 'Edit course development information',
    button_preview: 'Preview selling description',
    button_cancel: 'Cancel and go back to admin start page',
    button_submit: 'Save and publish selling description',
    image: 'Picture for a course description decoration'
  },
  pageTitles: {
    administrate: 'Administrate course information',
    editSelling: 'Edit a selling description',
    previewSelling: 'Preview a selling description'
  },
  startCards: {
    sellingText_hd: 'Selling description',
    sellingText_desc: 'Add a selling text to attract students to the course',
    sellingText_btn: 'Edit',
    sellingText_alt: 'Edit a selling description',
    coursePM_hd: 'Course-PM',
    coursePM_desc: 'Create course pm as PDF',
    coursePM_btn: 'Create',
    courseDev_hd: 'Course development',
    courseDev_decs: 'Add a course development information to show course progress and control automated information',
    courseDev_btn: 'Edit'
  },
  sellingTextButtons: {
    button_cancel: 'Cancel',
    button_change: 'Change text',
    button_preview: 'Preview',
    button_course_info: 'Course information',
    button_submit: 'Publish'
  },
  sellingTextLabels: {
    label_kopps_text_en: 'Short description from KOPPS in English',
    label_kopps_text_sv: 'Short description from KOPPS in Swedish',
    label_selling_info: 'You can create / edit a selling text of course in form of text which will replace the short description from KOPPS. If you want to use KOPPS short description then remove a selling text',
    label_max_number_letters: 'The maximum amount of signs is 1500.',
    label_left_number_letters: 'Left to use:',
    label_en: 'English text',
    label_sv: 'Swedish text'
  },
  courseInformationLabels: {
    label_course_syllabus: 'Course Syllabus',
    label_course_syllabus_valid_from: 'Valid from',
    label_programme_year: 'year ',
    label_course_intro: 'Intoduction',
    label_course_prepare: 'Prepare',
    label_course_during: 'During course',
    label_course_finalize: 'Finalize course',
    label_course_other: 'Contact and additional information',
    label_postgraduate_course: 'Postgraduate courses at '
  },
  courseInformation: {
    course_title:'Title english',
    course_other_title:'Title swedish',
    course_code:'Course code',
    course_credits:'Credits',
    course_grade_scale:'Grading scale',
    course_goals:'Intended learning outcomes',
    course_content:'Course main content',
    course_disposition:'Disposition',
    course_eligibility:'Eligibility',
    course_requirments_for_final_grade:'Requirements for final grade',
    course_literature:'Literature',
    course_examination_comments:'Examination comment',
    course_examination:'Examination',
    course_valid_from:'Valid from',
    course_main_subject:'Main field of study',
    course_language:'Language of instruction',
    course_required_equipment:'Required equipment',
    course_level_code:'Education cycle',
    course_level_code_label: {
      PREPARATORY: 'Pre-university level',
      BASIC: 'First cycle',
      ADVANCED: 'Second cycle',
      RESEARCH: 'Third cycle'
    },
    course_department:'Offered by',
    course_contact_name:'Contact ',
    course_suggested_addon_studies:'Recommended prerequisites',
    course_supplemental_information_url:'Supplementary information link',
    course_supplemental_information_url_text:'Supplementary information link text',
    course_supplemental_information:'Supplementary information ',
    course_examiners:'Examiner',
    course_recruitment_text:'Abstract'
  },
  courseRoundInformation:{
    round_application_code: 'Application code',
    round_max_seats: 'Number of places',
    round_part_of_programme: 'Part of programme',
    round_responsibles: 'Course responsible',
    round_end_date: 'End date',
    round_start_date: 'Start date',
    round_teacher: 'Teacher',
    round_target_group: 'Target group',
    round_short_name: 'Short name',
    round_periods: 'Periods',
    round_schedule: 'Schedule',
    round_course_term: 'Start semester',
    round_course_place: 'Course place',
    round_tutoring_form: 'Form of study',
    round_tutoring_form_label: {
      NML: 'Normal',
      DST: 'Distance',
      ITD: 'IT based distance'
    },
    round_tutoring_language: 'Language of instruction',
    round_campus: 'Campus',
    round_tutoring_time: 'Tutoring time',
    round_tutoring_time_label: {
      DAG: 'Daytime',
      KVA: 'Evenings',
      KVÄ: 'Evenings',
      VSL: 'Weekends'
    },
    round_type: 'Type of round',
    round_time_slots: 'Planned timeslots',
    round_application_link: 'Application link'
  }
}
