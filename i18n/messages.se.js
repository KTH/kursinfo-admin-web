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
    service_name: 'Node-applikationsnamn',

    example_message_key: 'Här är en svensk översättning på en label',

    button_label_example: 'Klicka här för att skicka data till servern!',

    field_text_example: 'Data att skicka till API',

    field_label_get_example: 'Min datamodell(Svar från api anrop GET): ',
    field_label_post_example: 'Min datamodell(Svar från api anrop POST): ',

    lang_block_id: '1.272446',
    locale_text: 'Kursinformation på svenska',

    site_name: 'Course information',
    host_name: 'KTH'
  },
  courseInformationLabels: {
    label_course_syllabus: "Kursplan",
    label_course_syllabus_valid_from:  "Gäller från och med",
    label_programme_year: "Åk  ",
    label_course_intro: "Inför kursval",
    label_course_prepare: "Förbereda",
    label_course_during: "Under kursen",
    label_course_finalize: "Slutföra kurs",
    label_course_other: "Kontakt och övrig information",
    label_postgraduate_course: "Forskarkurser på "
  },
  courseInformation:{
    roundId:"Kursomgångs nr",
    course_title:"Benämning svenska",
    course_other_title:"Benämning engelska",
    course_code:"Kurskod",
    course_credits:"Högskolepoäng",
    course_grade_scale:"Betygsskala",
    course_goals:"Lärandemål",
    course_content:"Kursens huvudsakliga innehåll",
    course_disposition:"Kursupplägg",
    course_eligibility:"Behörighet",
    course_requirments_for_final_grade:"Krav för slutbetyg",
    course_literature:"Kurslitteratur",
    course_examination_comments:"Kommentar till examinationsmoment",
    course_examination:"Examination",
    course_valid_from:"Giltig från",
    course_main_subject:"Huvudområden",
    course_language:"Undervisningsspråk",
    course_required_equipment:"Utrustningskrav",
    course_level_code:"Utbildningsnivå",
    course_level_code_label: {
      PREPARATORY: "Förberedande nivå",
      BASIC: "Grundnivå",
      ADVANCE: "Avancerad nivå",
      RESEARCH: "Forskarnivå"
    },
    course_department:"Ges av",
    course_contact_name:"Kontaktperson",
    course_suggested_addon_studies:"Rekommenderade förkunskaper",
    course_supplemental_information_url:"Övrig information - länk",
    course_supplemental_information_url_text:"Övrig information - länk text",
    course_supplemental_information:"Övrig information",
    course_examiners:"Examinator",
    course_recruitment_text:"Kort beskrivning svenska"

  },
  courseRoundInformation: {
    round_application_code: "Anmälningskod",
    round_max_seats: "Antal platser",
    round_part_of_programme: "Del av program",
    round_responsibles: "Kursansvarig",
    round_end_date: "Kursen slutar",
    round_start_date: "Kursen startar",
    round_teacher: "Lärare",
    round_target_group: "Målgrupp",
    round_short_name: "Namn - kort ",
    round_periods: "Perioder",
    round_schedule: "Schema",
    round_course_term: "Start termin",
    round_course_place: "Studielokalisering",
    round_tutoring_form: "Undervisningsform",
    round_tutoring_form_label: {
      NML: "Normal",
      DST: "Distans",
      ITD: "IT-baserad distans"
    },
    round_tutoring_language: "Undervisningsspråk",
    round_campus: "Skola",
    round_tutoring_time: "Undervisningstid",
    round_tutoring_time_label: {
      DAG: "Dagtid",
      KVA: "Kvällstid",
      KVÄ: "Kvällstid",
      VSL: "Veckoslut"
    },
    round_application_link: "Anmälningslänk",
    round_type: "Typ av kurstillfälle",
    round_time_slots: "Planerade moduler"
  }

}
