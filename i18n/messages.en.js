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
    alertMessages: {
      success: 'New version of the course introduction has been published in english and swedish languages.',
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
    courseDev_hd: 'Course analys and course data',
    courseDev_decs: 'Edit and publish course data and course analys on the page "Course progress and history"',
    courseDev_btn: 'Edit and publish',
    courseDev_link: 'Kursutveckling - mer information och hjälp',
    courseInfo_linkBack: 'Course information',
    altLabel: {
      start_link_back: 'To course information page',
      sellingText_btn: 'Edit selling description',
      coursePM_btn: 'Create course PM',
      courseDev_btn: 'Edit course development information'
    }
  },
  sellingTextLabels: {
    label_selling_info: 'You can create / edit a course introduction of course in form of text which will replace the short description from KOPPS. If you want to use KOPPS short description then remove a course introduction text',
    label_max_number_letters: 'The maximum amount of signs is 1500.',
    label_left_number_letters: 'Left to use:',
    langLabelKopps: {
      en: 'Short description from KOPPS in English',
      sv: 'Short description from KOPPS in Swedish'
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
  }
}
