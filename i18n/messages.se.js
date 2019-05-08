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
    page_admin: 'KURSINFO ADMIN',
    page_course_programme: 'KURS- OCH PROGRAMKATALOGEN'
  },
  pageTitles: {
    administrate: 'Administrera kursinformationssida',
    editSelling: 'Redigera introduktion till kursen',
    previewSelling: 'Förhandsgranska introduktion till kursen',
    alertMessages: {
      success: 'Ny svensk och engelsk version av introduktion till kursen har publicerats på kursinformationssidan',
      over_text_limit: 'Texten får bara bestå av 1 500 tecken',
      over_html_limit: 'HTML texten får bara bestå av 10 000 tecken',
      api_error: 'Det gick inte att spara texten på grund av teknisk fel. Kopiera texten och försök igen senare',
      kopps_api_down: 'Det går för närvarande inte att hämta information från KOPPS så viss information kommer att saknas'
    }
  },
  startCards: {
    sellingText_hd: 'Introduktion till kursen',
    sellingText_desc: 'Lägg till introduktion till kursen för att väcka studenternas intresse för kursen inför kursval',
    sellingText_btn: 'Redigera',
    sellingText_alt: 'Redigera introduktion till kursen',
    coursePM_hd: 'Kurs-PM',
    coursePM_desc: 'Skapa kurs-pm i form av PDF',
    coursePM_btn: 'Skapa',
    courseDev_hd: 'Kursutveckling',
    courseDev_decs: 'Granska utkast, lägg till en ny information om kursomgångsutveckling eller redigera en redan tillagd kursomgång',
    courseDev_btn: 'Granska och redigera',
    courseDev_link: 'Courde development - more information and help',
    courseInfo_linkBack: 'Kursinformationssida',
    altLabel: {
      start_link_back: 'Till kursinformationssida',
      sellingText_btn: 'Redigera introduktion till kursen',
      coursePM_btn: 'Skapa kurs-pm',
      courseDev_btn: 'Redigera kursutveckling'
    }
  },
  sellingTextLabels: {
    label_selling_info: 'Du kan här skapa / redigera introduktion till kursen i form av text som ersätter kortbeskrivningen som finns i KOPPS. Vill man återgå till kortbeskrivningen tar man bort introduktion till kursen nedan',
    label_max_number_letters: 'Maximalt antal tecken är 1500.',
    label_left_number_letters: 'Antal tecken kvar att använda:',
    langLabelKopps: {
      en: 'Kortbeskrivning i KOPPS på engleska',
      sv: 'Kortbeskrivning i KOPPS på svenska'
    },
    langLabel: {
      en: 'Engelsk text',
      sv: 'Svensk text'
    },
    changed_by: 'Senast ändrad av:',
    sellingTextButtons: {
      button_cancel: 'Avbryt',
      button_change: 'Redigera',
      button_preview: 'Förhandsgranska',
      button_submit: 'Publicera'
    },
    altLabel: {
      start_link_back: 'Till kursinformationssida',
      button_preview: 'Förhandsgranska introduktion till kursen',
      button_cancel: 'Avbryt och gå till admin startsida',
      button_submit: 'Spara och publicera introduktion till kursen',
      image: 'Bild för kurssidasdekoration'
    }
  }
}
