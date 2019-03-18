module.exports = {
  shortNames: [ 'sv', 'se' ],
  longNameSe: 'Svenska',
  longNameEn: 'Swedish',
  messages: {
    /**
     * General stuff
     */
    date_format_short: '%Y-%m-%d',

    /**
     * Error messages
     */

    error_not_found: 'Tyvärr kunde vi inte hitta sidan du söker',
    error_generic: 'Något gick fel på servern, var god försök igen senare',

    /**
     * Message keys
     */
    service_name: 'Kursinfo-admin-web',

    example_message_key: 'Här är en svensk översättning på en label',

    button_label_example: 'Klicka här för att skicka data till servern!',

    field_text_example: 'Data att skicka till API',

    field_label_get_example: 'Min datamodell(Svar från api anrop GET): ',
    field_label_post_example: 'Min datamodell(Svar från api anrop POST): ',

    lang_block_id: '1.272446',
    locale_text: 'Kursinformationsadmin på svenska',

    site_name: 'Kursinformationsadmin',
    host_name: 'KTH',
    page_admin: 'ADMIN PÅ KURSINFO',
    page_course_programme: 'KURS- OCH PROGRAMKATALOGEN'
  },
  pageTitles: {
    administrate: 'Administrera kursinformationssida',
    editSelling: 'Redigera säljande beskrivning',
    previewSelling: 'Förhandsgranska säljande beskrivning',
    alertMessages: {
      success: 'Ny svensk och engelsk version av säljande beskrivning har publicerats på kursinformationssidan',
      over_text_limit: 'Din texten måste vara mindre än 1 500 tecken',
      over_html_limit: 'Din html texten måste vara mindre än 10 000 tecken',
      api_error: 'Failed to post data to API',
      kopps_api_down: 'Nånting fel med KOPPS-api så information delvis kommer att saknas'
    }
  },
  startCards: {
    sellingText_hd: 'Säljande beskrivning',
    sellingText_desc: 'Lägg till säljande beskrivning för att väcka studenternas intresse för kursen inför kursval',
    sellingText_btn: 'Redigera',
    sellingText_alt: 'Redigera säljande beskrivning',
    coursePM_hd: 'Kurs-PM',
    coursePM_desc: 'Skapa kurs-pm i form av PDF',
    coursePM_btn: 'Skapa',
    courseDev_hd: 'Kursutveckling',
    courseDev_decs: 'Lägg till Kursutveckling information för att studenter kan titta hur kursen utvecklas',
    courseDev_btn: 'Redigera',
    courseInfo_linkBack: 'Kursinformationssida',
    altLabel: {
      start_link_back: 'Till kursinformationssida',
      sellingText_btn: 'Redigera säljande beskrivning',
      coursePM_btn: 'Skapa kurs-pm',
      courseDev_btn: 'Redigera kursutveckling'
    }
  },
  sellingTextLabels: {
    label_kopps_text_en: 'Kortbeskrivning i KOPPS på engleska',
    label_kopps_text_sv: 'Kortbeskrivning i KOPPS på svenska',
    label_selling_info: 'Du kan här skapa / redigera säljande beskrivning av kursen i form av text som ersätter kortbeskrivningen som finns i KOPPS. Vill man återgå till kortbeskrivningen tar man bort säljande beskrivningen nedan',
    label_max_number_letters: 'Maximalt antal tecken är 1500.',
    label_left_number_letters: 'Antal tecken kvar att använda:',
    label_en: 'Engelsk text',
    label_sv: 'Svensk text',
    changed_by: 'Senast ändrad av:',
    sellingTextButtons: {
      button_cancel: 'Avbryt',
      button_change: 'Redigera',
      button_preview: 'Förhandsgranska',
      button_submit: 'Publicera'
    },
    altLabel: {
      start_link_back: 'Till kursinformationssida',
      button_preview: 'Förhandsgranska säljande beskrivning',
      button_cancel: 'Avbryt och gå till admin startsida',
      button_submit: 'Spara och publicera säljande beskrivning',
      image: 'Bild för kurssidasdekoration'
    }
  }
}
