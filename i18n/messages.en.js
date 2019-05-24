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

    site_name: 'Course information admin',
    host_name: 'KTH',
    page_admin: 'COURSE INFO ADMIN',
    page_course_programme: 'COURSE AND PROGRAMME DIRECTORY'
  },
  pageTitles: {
    course_dev_title: 'Course development and history',
    course_info_title: 'Course information',
    course_admin_title: 'Administrate',
    about_course: 'About course',
    info_text: 'På denna ... ....',
    info_admin_text: 'Ansvariga .......',
    administrate: 'Administrate About course information',
    editSelling: 'Edit a course introduction',
    previewSelling: 'Preview a course introduction',
    start_link_back: 'To course information page',
    instruction_1: 'Here a course responsible or examinator for this course can administrate information for "About course" pages. For now it is possible to edit only "Course Introduction to this course" here',
    instruction_kopps_1: 'If you need to change information or roles / access rights for this course it is possible to do it in ',
    instruction_kopps_2: 'for ',
    instruction_kopps_3_link: 'those who has access rights in KOPPS ',
    instruction_kopps_4: 'read more about KOPPS ',
    instruction_kopps_5_link: 'access rights.',
    instruction_kopps_alt: 'To KOPPS',
    link_user_manual: 'Information and help to administrate About course pages',
    alertMessages: {
      success: 'New version of the course introduction has been published in english and swedish languages on the page ',
      over_text_limit: 'The text can consist of no more than 1 500 chars',
      over_html_limit: 'HTML texten should be less than 10 000 chars',
      api_error: 'Failed to save text due to technical issues. Copy text and try again later',
      kopps_api_down: 'Failed to get data from KOPPS for now therefore some information is missing'
    }
  },
  startCards: {
    sellingText_hd: 'Course introduction',
    sellingText_desc_p1: 'Replace a short description from kopps to a more informative introduction to a course to help students to make a right choice',
    sellingText_desc_p2: '”Introduktion to course" displayed on top of ”Course Information” page.',
    sellingText_btn: 'Edit',
    sellingText_alt: 'Edit a course introduction',
    coursePM_hd: 'Course-PM',
    coursePM_desc: 'Upload a course pm file as PDF',
    coursePM_btn: 'Upload',
    courseDev_hd: 'Course analysis with course data',
    courseDev_decs: 'Edit and publish course data and course analysis on the page "Course progress and history"',
    courseDev_btn: 'Edit and publish',
    courseDev_link: 'Kursutveckling - mer information och hjälp',
    beta_courseDev: 'The course progress and history, course analysis and course data are under development now',
    beta_coursePm: 'Functionality to upload a course PM is under development now.',
    beta_more_link: 'Are you interested to know more or participate in development?',
    altLabel: {
      sellingText_btn: 'Edit selling description',
      coursePM_btn: 'Create course PM',
      courseDev_btn: 'Edit course development information'
    }
  },
  sellingTextLabels: {
    label_selling_info: 'You can create / edit a course introduction of course in form of text which will replace the short description from KOPPS. If you want to use KOPPS short description then remove a course introduction text',
    label_max_number_letters: 'The maximum amount of signs is 1500.',
    label_left_number_letters: 'Left to use:',
    label_step_1: 'Edit swedish and english text (step 1 out of 2)',
    label_step_2: 'Preview and publish (step 2 out of 2)',
    langLabelKopps: {
      en: 'Short description from KOPPS (EN)',
      sv: 'Short description from KOPPS (SW)'
    },
    langLabelIntro: {
      en: 'Course introduction (EN)',
      sv: 'Course introduction (SW)'
    },
    langLabel: {
      en: 'English text',
      sv: 'Swedish text'
    },
    changed_by: 'Last changed by user with kthId:',
    sellingTextButtons: {
      button_cancel: 'Cancel',
      button_change: 'Change text',
      button_preview: 'Preview',
      button_submit: 'Publish'
    },
    altLabel: {
      start_link_back: 'To course information page',
      button_preview: 'Preview a course introduction',
      button_cancel: 'Cancel and go back to admin start page',
      button_submit: 'Save and publish course introduction',
      image: 'Picture for a course description decoration'
    }
  },
  courseImage: {
    Architecture: 'Picture_by_MainFieldOfStudy_01_Architecture.jpg',
    Biotechnology: 'Picture_by_MainFieldOfStudy_02_Biotechnology.jpg',
    'Computer Science and Engineering': 'Picture_by_MainFieldOfStudy_03_Computer_Science.jpg',
    'Electrical Engineering': 'Picture_by_MainFieldOfStudy_04_Electrical_Engineering.jpg',
    Physics: 'Picture_by_MainFieldOfStudy_05_Physics.jpg',
    'Industrial Management': 'Picture_by_MainFieldOfStudy_06_Industrial_Management.jpg',
    'Information Technology': 'Picture_by_MainFieldOfStudy_07_Information_Technology.jpg',
    'Information and Communication Technology': 'Picture_by_MainFieldOfStudy_08_Information_Communication.jpg',
    'Chemical Science and Engineering': 'Picture_by_MainFieldOfStudy_09_Chemical_Science.jpg',
    'Chemistry and Chemical Engineering': 'Picture_by_MainFieldOfStudy_10_Chemistry_Chemical.jpg',
    Mathematics: 'Picture_by_MainFieldOfStudy_11_Mathematics.jpg',
    'Environmental Engineering': 'Picture_by_MainFieldOfStudy_12_Environmental_Engineering.jpg',
    'Molecular Life Science': 'Picture_by_MainFieldOfStudy_13_Molecular_Life_Science.jpg',
    'Mechanical Engineering': 'Picture_by_MainFieldOfStudy_14_Mechanical_Engineering.jpg',
    'Materials Science': 'Picture_by_MainFieldOfStudy_15_Materials_Science.jpg',
    'Medical Engineering': 'Picture_by_MainFieldOfStudy_16_Medical_Engineering.jpg',
    'Materials Science and Engineering': 'Picture_by_MainFieldOfStudy_17_Materials_Engineering.jpg',
    'Built Environment': 'Picture_by_MainFieldOfStudy_18_Built_Environment.jpg',
    'Engineering Physics': 'Picture_by_MainFieldOfStudy_19_Engineering_Physics.jpg',
    'Technology and Economics': 'Picture_by_MainFieldOfStudy_20_Technology_Economics.jpg',
    'Technology and Health': 'Picture_by_MainFieldOfStudy_21_Technology_Health.jpg',
    'Technology and Management': 'Picture_by_MainFieldOfStudy_22_Technology_Management.jpg',
    Technology: 'Picture_by_MainFieldOfStudy_23_Technology.jpg',
    'Engineering and Management': 'Picture_by_MainFieldOfStudy_24_Engineering_Management.jpg',
    'Technology and Learning': 'Picture_by_MainFieldOfStudy_25_Technology_Learning.jpg',
    default: 'Picture_by_MainFieldOfStudy_26_Default_picture.jpg'
  }
}
