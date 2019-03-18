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
  pageTitles: {
    administrate: 'Administrate course information',
    editSelling: 'Edit a selling description',
    previewSelling: 'Preview a selling description',
    alertMessages: {
      success: 'New version of selling description has been published in english and swedish languages.',
      over_text_limit: 'You exceeded the limit of letters. The text must have no more 1 500',
      over_html_limit: 'HTML texten should be less than 10 000 signs',
      api_error: 'Failed to post data to API',
      kopps_api_down: 'Something wrong with KOPPS api therefore some information is missing'
    }
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
    courseDev_btn: 'Edit',
    courseInfo_linkBack: 'Course information',
    altLabel: {
      start_link_back: 'To course information page',
      sellingText_btn: 'Edit selling description',
      coursePM_btn: 'Create course PM',
      courseDev_btn: 'Edit course development information'
    }
  },
  sellingTextLabels: {
    label_kopps_text_en: 'Short description from KOPPS in English',
    label_kopps_text_sv: 'Short description from KOPPS in Swedish',
    label_selling_info: 'You can create / edit a selling text of course in form of text which will replace the short description from KOPPS. If you want to use KOPPS short description then remove a selling text',
    label_max_number_letters: 'The maximum amount of signs is 1500.',
    label_left_number_letters: 'Left to use:',
    label_en: 'English text',
    label_sv: 'Swedish text',
    changed_by: 'Last changed by user with kthId:',
    sellingTextButtons: {
      button_cancel: 'Cancel',
      button_change: 'Change text',
      button_preview: 'Preview',
      button_submit: 'Publish'
    },
    altLabel: {
      start_link_back: 'To course information page',
      button_preview: 'Preview selling description',
      button_cancel: 'Cancel and go back to admin start page',
      button_submit: 'Save and publish selling description',
      image: 'Picture for a course description decoration'
    }
  }
}
