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

    language_link_lang_sv: 'Svenska',

    /**
     * Error messages
     */

    error_bad_request: 'Sorry, the server cannot or will not process the request',
    error_not_found: "Sorry, we can't find your requested page",
    error_generic: 'Something went wrong on the server, please try again later.',

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
    title: 'Administer About course',
    description:
      'Here a course coordinator or examinator for this course can administrate information for “About course” pages.',

    example_message_key: 'This is an english translation of a label',

    button_label_example: 'Click me to send data to server!',

    field_text_example: 'Data to be sent to API',

    field_label_get_example: 'My modelData(Response from api call GET): ',
    field_label_post_example: 'My modelData(Response from api call POST): ',

    lang_block_id: '1.77273',
    locale_text: 'This page in English',

    site_name: 'Administer About course',
    host_name: 'KTH',
    page_admin: 'COURSE INFO ADMIN',
    page_course_programme: 'COURSE AND PROGRAMME DIRECTORY',
  },
  pageTitles: {
    course_admin_title: 'Administer',
    about_course: 'About course',
    administrate: 'Administer About course',
    instruction_p1:
      'Here in the administration tool for About course there are three functions for editing some of the information that is displayed on About course. You can edit some information on the page Before course selection, create and publish Course memo and publish Course analysis and course data.',
    instruction_p2:
      'About course also contains information retrieved from Kopps. It is the course syllabus, the course common information and the administrative course instances/course offerings, including examiner, course coordinator, teacher and teacher assistants. This information is edited in Kopps.',
    instruction_p3_start:
      'What functions you have access to in the administration tool for About course depends on which role you have in the system.',
    instruction_p3_link_label: 'Instructions and information about access to About course ',
    instruction_p3_conclusion: 'can be found on the intranet.',
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
        aTitle: 'Before course selection.',
        ariaLabel: 'To Course information page',
      },
      canvas: {
        aTitle: 'The Syllabus function in Canvas',
        ariaLabel: 'The Syllabus function in Canvas',
      },
    },
    alertMessages: {
      noMemoHeader: '... but it is missing a published course memo',
      kutv: {
        save: 'Draft for course analysis and course data has been saved',
        s_msg: 'You can find saved drafts under Course analysis and course data / Publish new',
        pub: 'Course analysis and course data have been published',
        delete: 'Draft for course analysis and course data has been removed',
        see_more: 'Look at',
      },
      pm: {
        save: 'Draft for course memo has been saved',
        s_msg: 'You can find saved drafts under Course memo / Publish new',
        pub: 'Course memo has been published',
        pub_changed: 'A new version of the course memo has been published',
        delete: 'Draft for course memo has been removed',
        see_more: 'Look at',
        pub_info:
          'Remember to link to your course memo from the course room in Canvas. Read more on the intranet about ',
        pub_changed_info:
          'Remember to inform your students that there is a new version of the course memo. Also inform about what changes that have been made in the last version.',
      },
      pmdata: {
        save: 'Draft for course memo has been saved',
        removedPublished: 'Draft for published version has been removed',
        s_msg: 'You can find saved drafts under ',
        r_msg: 'Draft for course memo has been removed after cancelation you can go back to ',
        fast_admin_link_label: {
          save: {
            create: 'Create and publish course memo',
            change: 'Edit published course memo',
          },
          removedPublished: 'Edit published',
        },
        pub: 'Course memo has been published',
        pub_changed: 'A new version of the course memo has been published',
        delete: 'Draft for course memo has been removed',
        see_more: 'Look at',
        pub_info:
          'Remember to link to your course memo from the course room in Canvas. Read more on the intranet about ',
        pub_changed_info:
          'Remember to inform your students that there is a new version of the course memo. Also inform about what changes that have been made in the last version.',
      },
      kinfo: {
        pub: 'The page Before course selection has been published',
        see_more: 'Image and text has been published on the page ',
      },
      alertinfo: {
        pub_info:
          'Remember to link to your course memo from the course room in Canvas. Read more on the intranet about ',
        pub_changed_info:
          'Remember to inform your students that there is a new version of the course memo. Also inform about what changes that have been made in the last version.',
      },
      semester: 'Semester',
      course_offering: 'Course offering',
      over_text_limit: 'The text can consist of no more than 2 000 chars',
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
    sellingText_hd: 'The page Before course selection',
    sellingText_desc_p1:
      'Select your own image and write a course introduction to the help the students select a course that suits them. The course introduction is displayed on the page Before course selection.',
    sellingText_desc_p2:
      'You can also choose to write information about the course disposition and add supplementary information.',
    sellingText_btn: 'Edit',
    coursePM_hd: 'Course memo',
    coursePM_create_desc_p1:
      'Create and publish new course memo for forthcoming course offerings or edit a published course memo.',
    coursePM_create_desc_p2: 'A published course memo will be available on the subpage: Prepare and take course.',
    coursePM_create_desc_p3:
      'It is also possible to use the function: Upload course memo as a PDF, to upload and publish a course memo created outside the tool at About course. The file you publish must be in PDF format and meet web accessibility guidelines.',
    coursePM_link_upload_memo: 'Upload course memo as PDF',
    coursePM_btn_edit: 'Edit published',
    coursePM_btn_new: 'Create, publish',
    courseDev_hd: 'Course analysis and course data',
    courseDev_decs_p1:
      'Publish course analysis and course data for a completed course offering or edit a published course analysis.',
    courseDev_decs_p2: 'A published course analysis with course data is displayed on the page: Course development.',
    courseDev_decs_alert_title: 'Please note!',
    courseDev_decs_alert_p1:
      'In mid-December 2024, this tool for publishing and editing course analysis and course data will be discontinued. Last use is for courses taken during period 1 in HT24. Thereafter, from period 2 in HT24, the course analysis is filled in and published in Canvas.',
    courseDev_decs_alert_p2: 'Read about the new automated system in Canvas here:',
    courseDev_decs_alert_p2_link: 'New IT system support for course evaluation and course analysis',
    courseDev_btn_edit: 'Edit published',
    courseDev_btn_new: 'Publish new',
  },
  editCourseStart: {
    pageHeader: 'Before course selection',
    intro:
      'Start by choosing which part of the page you want to edit. In the next step, you can edit your content. Image and text will be published on the page Before course selection.',
    header: 'Choose part to edit',
    options: {
      description: 'Image, course introduction and course disposition',
      recommendedPrerequisites: 'Recommended prerequisites',
      otherInformation: 'Supplementary information',
    },
    nextButton: 'Edit',
  },
  editRecommendedPrerequisites: {
    pageHeader: 'Recommended prerequisites',
    step1: {
      title: 'Edit text',
      intro: `The heading “Recommended prerequisites” should describe what knowledge and skills (in addition to the eligibility requirements) the students need to be able to take the course. 
              Students can use the information to prepare for the course or as a basis for choosing the course or not.
              Preferably state explicit knowledge and skills and not just course names, for example “programming in Python” or “boundary value calculations”.`,
      alert: `Note that the texts are displayed for all course offerings. If the course is offered at multiple times in the same semester, you may need to customize the text. Specify a maximum of 2000 characters per text.`,
      nextButton: 'Preview',
      fields: {
        recommendedPrerequisitesSv: 'Recommended prerequisites (SV)',
        recommendedPrerequisitesEn: 'Recommended prerequisites (EN)',
      },
    },
    step2: {
      title: 'Preview and publish',
      header: 'Preview',
      nextButton: 'Publish',
      backButton: 'Edit text',
      fields: {
        recommendedPrerequisitesSv: 'Rekommenderade förkunskaper',
        recommendedPrerequisitesEn: 'Recommended prerequisites',
      },
    },
  },
  editOtherInformation: {
    pageHeader: 'Supplementary information',
    step1: {
      title: 'Edit text',
      intro: `Here you add any additional information that may be important for the student to know. The text will be displayed at the bottom of the page Before course selection.`,
      alert: `Note that the texts are displayed for all course offerings. If the course is offered at multiple times in the same semester, you may need to customize the text. Specify a maximum of 2000 characters per text.`,
      nextButton: 'Preview',
      fields: {
        supplementaryInfoSv: 'Supplementary information (SV)',
        supplementaryInfoEn: 'Supplementary information (EN)',
      },
    },
    step2: {
      title: 'Preview and publish',
      header: 'Preview',
      nextButton: 'Publish',
      backButton: 'Edit text',
      fields: {
        supplementaryInfoSv: 'Övrig information',
        supplementaryInfoEn: 'Supplementary information',
      },
    },
  },

  editDescription: {
    pageHeader: 'Course introduction and course disposition',
    step1: {
      title: 'Choose image',
      intro: 'In this step, you can choose between a standard image or upload your own.',
      nextButton: 'Edit text',
      headerModal: {
        header: 'Choose image',
        body: `Choose a image to display on Before course selection and in your course memo. You can either use the default image based on the course main subject or upload an image of your own. In order for the image to meet the requirements for accessibility, the image should not convey necessary information. 
        <br/> 
        <br/> 
        The image you select will be displayed in the format 400x300 pixels. The image must be in PNG or JPG file format.`,
        btnCancel: 'Close',
      },
      image: {
        reset: 'Restore to previous published image',
        choose: 'Choose image',
        noChosen: 'No image chosen',
        choiceInfo: 'Choose an image to display on Before course selection',
        firstOption: 'Image based on the course main subject',
        secondOption: 'Own selected image',
        agreeCheck_1: 'I declare that KTH is entitled to use the image. For more information, please read about',
        imagesOnTheWeb: 'Images on the web.',
        agreeCheck_2: ' ',
        alt: 'Picture for a course description decoration',
      },
      alertMessages: {
        approve_term: 'You must approve the terms (see red markings below)',
        failed_compression_of_file: 'Något gick fel vid laddning eller komprimering av en bild',
        no_file_chosen: 'You must first choose an image to continue to “Edit text”.',
        replace_api_with_default: `Notice: your previously published image will be deleted when you publish in step 3.`,
      },
    },
    step2: {
      title: 'Edit text',
      intro: `Describe briefly the course content under “Introduction to the course” and provide a brief overview of how the teaching is structured under “Course disposition.” The page is displayed in both Swedish and English, so include text in both languages.`,
      alert: `Note that the texts are displayed for all course offerings. If the course is offered at multiple times in the same semester, you may need to customize the text. Specify a maximum of 2000 characters per text.`,
      nextButton: 'Preview',
      backButton: 'Choose image',
      fields: {
        sellingTextSv: 'Introduction to the course (SV)',
        sellingTextEn: 'Introduction to the course (EN)',
        courseDispositionSv: 'Course disposition (SV)',
        courseDispositionEn: 'Course disposition (EN)',
      },
    },
    step3: {
      title: 'Preview and publish',
      nextButton: 'Publish',
      backButton: 'Edit text',
      headersSv: {
        page: 'Inför kursval',
        content: 'Innehåll och lärandemål',
        courseDisposition: 'Kursupplägg',
      },
      headersEn: {
        page: 'Before course selection',
        content: 'Content and learning outcomes',
        courseDisposition: 'Course disposition',
      },
    },
  },

  compontents: {
    editButton: {
      open: 'Open edit',
      close: 'Close edit',
    },

    editorSection: {
      close: 'Stäng',
      noText: 'Ingen text tillgad',
    },

    controlButtons: {
      back: 'Back',
      cancel: 'Cancel',
      next: 'Next',
      confirmModals: {
        publish: {
          header: 'To be aware of before publishing!',
          body: `<br/>  
              The information will be published on the page Before course selection.
            <br/> 
            <br/> 
            Do you want to publish?`,
          btnCancel: 'No, go back',
          btnConfirm: 'Yes, publish',
          infoCourse: 'Course: ',
        },
        cancel: {
          header: 'To be aware of before cancelling!',
          body: 'Unsaved changes will be lost if you cancel the publishing of course information (image and text) <br/>  <br/> Do you want to cancel?',
          btnCancel: 'No, go back',
          btnConfirm: 'Yes, cancel',
          infoCourse: 'Course: ',
        },
      },
    },
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
