// Please make sure to use the correct quotes:
// - in Swedish, use closing double quote (” ,\u201d) both before and after the text to be quoted,
// - in English, use opening double quote (“, \u201c) before and closing double quote (” \u201d) after the text.
module.exports = {
  shortNames: ['en'],
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

    error_bad_request: 'Sorry, the server cannot or will not process the request',
    error_not_found: "Sorry, we can't find your requested page",
    error_generic: 'Something went wrong on the server, please try again later.',
    error_invalid_semester: 'Invalid semester',
    error_invalid_semester_for_statistics: 'This service cannot provide accurate statistics from earlier than 2019.',

    /**
     * Authentication message
     */

    contact_support: 'Contact',
    for_questions: 'if you have any questions.',
    friendly_message_have_not_rights: "You don't have permission to use About course's administration tool",
    message_have_not_rights: `You don't have permission to use About course's administration tool. Permission is automatically given to those who are added as an examiner, course coordinator or teacher for the course in Kopps.`,
    message_have_not_rights_link_pre_text: 'It is possible',
    message_have_not_rights_link_href:
      'https://intra.kth.se/en/utbildning/systemstod/om-kursen/behorighet-for-om-kursen-1.1051642',
    message_have_not_rights_link_text: 'to apply for administrator access to the About course administration tool',
    message_have_not_rights_link_after_text:
      "The application must be made by the school's Educational Administration Manager.",

    /**
     * Message keys
     */
    service_name: 'course information administration',
    title: 'Administer About course information',
    description:
      'Here a course coordinator or examinator for this course can administrate information for “About course” pages.',

    example_message_key: 'This is an english translation of a label',

    button_label_example: 'Click me to send data to server!',

    field_text_example: 'Data to be sent to API',

    field_label_get_example: 'My modelData(Response from api call GET): ',
    field_label_post_example: 'My modelData(Response from api call POST): ',

    lang_block_id: '1.77273',
    locale_text: 'This page in English',

    site_name: 'Course information admin',
    host_name: 'KTH',
    page_admin: 'COURSE INFO ADMIN',
    page_course_programme: 'COURSE AND PROGRAMME DIRECTORY',
  },
  pageTitles: {
    course_admin_title: 'Administer',
    header_progress_select_pic: '1. Choose image',
    header_progress_edit: '2. Edit text',
    header_progress_review: '3. Review and publish',
    about_course: 'About course',
    administrate: 'Administer About course',
    editSelling: 'Edit a course introduction',
    previewSelling: 'Preview a course introduction',
    instruction_kopps_1:
      'The \u201CAbout course\u201D pages contain information retrieved from KOPPS and information edited here in the \u201CAbout course\u201D administration tool. Information retrieved from KOPPS is the course syllabus, information valid for all course offerings, and course instance information. The latter include examiners, course coordinators, and teachers. Make changes to this information in KOPPS.',
    instruction_kopps_2: 'Instructions and help for ',
    instruction_kopps_detail_title: 'Authorizations to edit information',
    instruction_kopps_detail_1:
      'Anyone listed as an examiner, course coordinator, or teacher on the course in KOPPS, will automatically be allowed to use the \u201CAbout course\u201D administration tool; see below. Teachers can administrate \u201CCourse memos.\u201D Examiners and course coordinators can administrate \u201CCourse memos,\u201D as well as \u201CCourse introduction\u201D and “Course analysis and course data.”',
    instruction_kopps_detail_2: 'Authorization to edit course information in KOPPS is described on the page ',
    instruction_kopps_detail_2_link: 'Retrieved course information',
    link_user_manual: 'About course',
    links_to: {
      kutv: {
        aTitle: 'Course development',
        ariaLabel: 'To Course development view',
      },
      pm: {
        aTitle: 'Prepare and take course/Course memo',
        ariaLabel: 'To the Prepare and take course/Course memo page',
      },
      pmdata: {
        aTitle: 'Prepare and take course/Course memo',
        ariaLabel: 'To the Prepare and take course/Course memo page',
      },
      kinfo: {
        aTitle: 'Course information',
        ariaLabel: 'To Course information page',
      },
    },
    alertMessages: {
      noMemoHeader: '... but it is missing a published course memo',
      kutv: {
        save: 'Draft for course analysis and course data has been saved',
        s_msg: 'You can find saved drafts under Course analysis and course data / Publish new',
        pub: 'Course analysis and course data have been published',
        delete: 'Draft for course analysis and course data has been removed',
      },
      pm: {
        save: 'Draft for course memo has been saved',
        s_msg: 'You can find saved drafts under Course memo / Publish new',
        pub: 'Course memo has been published',
        pub_changed: 'A new version of the course memo has been published',
        delete: 'Draft for course memo has been removed',
      },
      pmdata: {
        save: 'Draft for course memo has been saved',
        removedPublished: 'Draft for published version has been removed',
        s_msg: 'You can find saved drafts under ',
        r_msg: 'Draft for course memo has been removed after cancelation you can go back to ',
        fast_admin_link_label: {
          save: 'Create and publish course memo',
          removedPublished: 'Edit published',
        },
        pub: 'Course memo has been published',
        pub_changed: 'A new version of the course memo has been published',
        delete: 'Draft for course memo has been removed',
      },
      kinfo: {
        pub: 'New version of the course introduction has been published ',
      },
      see_more: 'Look at',
      semester: 'Semester',
      course_offering: 'Course offering',
      over_text_limit: 'The text can consist of no more than 1 500 chars',
      over_html_limit: 'HTML texten should be less than 10 000 chars',
      api_error: 'Failed to save text due to technical issues. Copy text and try again later',
      storage_api_error:
        'Failed to save the image you chose, due to technical issues mightly. Go back to “1. Choose image” and change the image. Then try to Publish again.',
      kopps_api_down:
        'Failed to get data from KOPPS for now therefore some information is missing. Or course code is mispelled.',
    },
    course_short_semester: {
      1: 'Spring ',
      2: 'Autumn ',
    },
  },
  startCards: {
    sellingText_hd: 'Course introduction',
    sellingText_desc_p1:
      'Select your own decorative image and/or replace the short course description from Kopps to a more informative introduction to the course, to help students select a course that suits them.',
    sellingText_desc_p2: 'Course introduction is displayed at the page: Before course selection.',
    sellingText_btn: 'Edit',
    coursePM_hd: 'Course memo',
    coursePM_create_desc_p1:
      'Create and publish new course memo for forthcoming course offerings or edit a published course memo.',
    coursePM_create_desc_p2: 'A published course memo will be available on the subpage: Prepare and take course.',
    coursePM_create_desc_p3:
      'It is also possible to use the function: Upload or change course memo as a PDF, to upload and publish a course memo created outside the tool at About course. The file you publish must be in PDF format and meet web accessibility guidelines.',
    coursePM_link_upload_memo: 'Upload or change course memo as a PDF',
    coursePM_btn_edit: 'Change published',
    coursePM_btn_new: 'Create, publish',
    courseDev_hd: 'Course analysis and course data',
    courseDev_decs_p1:
      'Publish course analysis and course data for a completed course offering or edit a published course analysis.',
    courseDev_decs_p2: 'A published course analysis with course data is displayed on the page: Course development.',
    courseDev_btn_edit: 'Edit published',
    courseDev_btn_new: 'Publish new',
  },
  introLabel: {
    alertMessages: {
      approve_term: 'You must approve the terms (see red markings below)',
      failed_compression_of_file: 'Något gick fel vid laddning eller komprimering av en bild',
      no_file_chosen: 'You must first choose an image to continue to “Edit text”.',
      not_correct_format_choose_another: `You need to choose an image in the correct format (see red markings below)
        to be able to continue to “Edit text”.`,
      not_correct_format_return_to_api_pic: `You need to choose an image in the correct format (see red markings below) 
        to be able to continue to “Edit text”.`,
      replace_api_with_default: `Notice: your previously published image will be deleted when you publish in step 3.`,
    },
    info_publish: {
      header: 'To be aware of before publishing!',
      body: `<br/>  
        <br/> 
          The information will be published on the page Course information (image and text)
        <br/> 
        <br/> 
        Do you want to publish?`,
      btnCancel: 'No, go back',
      btnConfirm: 'Yes, publish',
      infoCourse: 'Course: ',
    },
    info_cancel: {
      header: 'To be aware of before cancelling!',
      body: 'Unsaved changes will be lost if you cancel the publishing of course information (image and text) <br/>  <br/> Do you want to cancel?',
      btnCancel: 'No, go back',
      btnConfirm: 'Yes, cancel',
      infoCourse: 'Course: ',
    },
    info_image: {
      header: 'Choose image',
      body: `Choose a decorative image that will be displayed on the page Course information. The image should be decorative rather than informative, to fulfill accessibility requirements.
      You can choose a default image based on the main subject of the course or choose to upload an image on your own choice. 
      The image will be displayed with 400px width and 300px height. The file format must be .png or .jpg.`,
      btnCancel: 'Close',
    },
    editCourseIntro: 'Edit course introduction',
    image: {
      reset: 'Restore to previous published image',
      choose: 'Choose image',
      name: 'Image name:',
      noChosen: 'No image chosen',
      choiceInfo: 'Choose decorative image that will be displayed on the course',
      firstOption: 'Image based on the course main subject',
      secondOption: 'Choose your own picture',
      agreeCheck:
        'I hereby declare that I have a right to use and publish the uploaded material, and I for breach of this am aware that I have a personal responsibility. For more information please read about',
      imagesOnTheWeb: 'Images on the web.',
    },
    step_1_desc: `Choose a decorative image to display on the Course information page (step 1 of 3). Edit the introducing text in the next step (2 of 3). 
    Review the image and the text in the last step (3 of 3). The Introduction to the course will then be published on the page Course information.`,
    step_2_desc: `You can create / edit a course introduction of course in form of text which will replace the short description from KOPPS. 
    If you want to use KOPPS short description then remove a course introduction text`,
    step_3_desc: `In this step (3 of 3) a preview of the decorative image and the text is presented as it will 
    be published on the page Course information. It is possible to go back to change the image and edit text or move forward to 
    publish the information on the page Course information.`,
    label_left_number_letters: 'Number of characters left to use (of 1500 in total):',
    label_step_1: 'Choose image',
    label_step_2: 'Edit swedish and english text',
    label_step_3: 'Preview',
    langLabelKopps: {
      en: 'Short description from KOPPS (EN)',
      sv: 'Short description from KOPPS (SW)',
    },
    langLabelIntro: {
      en: 'Course introduction (EN)',
      sv: 'Course introduction (SW)',
    },
    langLabelText: {
      en: 'English text',
      sv: 'Swedish text',
    },
    langLabelPreview: {
      en: 'English introduction to the course',
      sv: 'Swedish introduction to the course',
    },
    button: {
      cancel: 'Cancel',
      publish: 'Publish',
      step1: 'Choose image',
      step2: 'Edit text',
      step3: 'Preview',
    },
    alt: {
      step1: 'Go to previous step to choose image',
      step2Next: 'Go to next step to edit introduction text',
      step2Back: 'Go back to edit introduction text',
      step3: 'Preview a course introduction',
      cancel: 'Cancel and go back to admin start page',
      publish: 'Save and publish course introduction',
      image: 'Picture for a course description decoration',
      tempImage: 'Placeholder to show up a chosen picture',
    },
    required: {
      image: 'Required (format: .png or .jpg)',
      agreement: 'Required',
    },
    redirectToStart: 'Success, redirecting to start page...',
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
    default: 'Picture_by_MainFieldOfStudy_26_Default_picture.jpg',
  },
}
