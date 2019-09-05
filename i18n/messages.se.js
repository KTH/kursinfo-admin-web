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
    title: 'Kursens utveckling och historik',
    description: 'Här kan du, som kursansvarig eller examinator för kursen, administrera den information på platsen ”Om kursen” som inte hämtas från KOPPS. I dagsläget är det endast ”Introduktion till Kursen som administreras här.',
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
    course_admin_title: 'Administrera',
    header_progress_select_pic: '1. Välja bild',
    header_progress_edit: '2. Redigera text',
    header_progress_review: '3. Granska och publicera',
    about_course: 'Om kursen',
    administrate: 'Administrera Om kursen',
    editSelling: 'Redigera introduktion till kursen',
    previewSelling: 'Förhandsgranska introduktion till kursen',
    instruction_1: 'Här kan du, som kursansvarig eller examinator för kursen, administrera den information på platsen ”Om kursen” som inte hämtas från KOPPS.',
    instruction_kopps_1: 'Vill du ändra den grundinformation som hämtas eller ändra roller/ behörigheter för kursen så görs det i ',
    instruction_kopps_2: 'av ',
    instruction_kopps_3_link: 'personal som har behörighet i KOPPS ',
    instruction_kopps_4: 'läs mer om Kopps ',
    instruction_kopps_5_link: 'behörigheter.',
    instruction_kopps_alt: 'Till KOPPS',
    link_user_manual: 'Information och hjälp för att administrera Om kursen',
    links_to: {
      kutv: {
        aTitle: 'Kursens utveckling och historik',
        aAlt: 'Till Kursens utveckling och historik vy'
      },
      pm: {
        aTitle: 'Kursinformation',
        aAlt: 'Till Kursinformation vy'
      },
      kinfo: {
        aTitle: 'Kursinformation',
        aAlt: 'Till Kursinformation vy'
      }
    },
    alertMessages: {
      kutv: {
        save: 'Utkast för kursanalys och kursdata har sparats',
        s_msg: 'Du hittar det sparade utkastet under Kursanalys och kursdata/ Publicera ny',
        pub: 'Kursanalys och kursdata har publicerats',
        delete: 'Utkast för kursanalys och kursdata har raderats'
      },
      pm: {
        save: 'Utkast för kurs-pm har sparats',
        s_msg: 'Du hittar det sparade utkastet under Kurs-pm/ Publicera ny',
        pub: 'Kurs-pm har publicerats',
        delete: 'Utkast för kurs-pm har raderats'
      },
      kinfo: {
        save: 'Ny svensk och engelsk version av introduktion till kursen har publicerats på sidan '
      },
      see_more: 'Se',
      term: 'Termin',
      course_round: 'Kursomgång',
      over_text_limit: 'Texten får bara bestå av 1 500 tecken',
      over_html_limit: 'HTML texten får bara bestå av 10 000 tecken',
      api_error: 'Det gick inte att spara texten på grund av teknisk fel. Kopiera texten och försök igen senare',
      kopps_api_down: 'Det går för närvarande inte att hämta information från KOPPS så viss information kommer att saknas. Eller kurskoden är felstavade.'
    },
    course_short_semester: {
      1: 'VT ',
      2: 'HT '
    }
  },
  startCards: {
    sellingText_hd: 'Introduktion till kursen',
    sellingText_desc_p1: 'Ersätt kortbeskrivningen i Kopps med en mer informativ introduktion till kursen för att hjälpa studenten att göra rätt kursval.',
    sellingText_desc_p2: '”Introduktion till kursen” visas överst på sidan ”Kursinformation”.',
    sellingText_btn: 'Redigera',
    sellingText_alt: 'Redigera introduktion till kursen',
    coursePM_hd: 'Kurs-pm',
    coursePM_desc: 'Publicera kurs-pm för kommande kursomgångar. Publicerat kurs-pm kommer att visas på sidan Kursinformation för vald termin och kursomgång.',
    coursePM_btn: 'Publicera',
    courseDev_hd: 'Kursanalys och kursdata',
    courseDev_decs_p1: 'Publicera eller ändra publicerad kursanalys och kursdata för kursens utveckling och historik.',
    courseDev_decs_p2: 'Publicerade kursanalyser med kursdata visas på sidan ”Kursens utveckling och historik”',
    courseDev_btn_edit: 'Ändra publicerad',
    courseDev_btn_new: 'Publicera ny',
    courseDev_link: 'Kursens utveckling - mer information och hjälp',
    beta_coursePm: 'Funktionalitet för att att ladda upp Kurs-PM är under utveckling.',
    beta_more_link: 'Vill du veta mer eller delta?',
    altLabel: {
      start_link_back: 'Till kursinformationssida',
      sellingText_btn: 'Redigera introduktion till kursen',
      coursePM_btn: 'Ladda upp kurs-pm',
      courseDev_btn: 'Redigera kusanalys och kursdata'
    }
  },
  introLabel: {
    info_publish: {
      header: 'Att tänka på innan du publicerar!',
      body: `<br/>
        <br/> 
        Publicering kommer att ske på sidan: Kursinformation och ersätta befintlig introduktion (bild och text) till kursen.
        <br/>
        <br/>
        Vill du fortsätta att publicera?`,
      btnCancel: 'Nej, gå tillbaka',
      btnConfirm: 'Ja, fortsätt publicera',
      infoCourse: `Du har valt...<br/>
      <br/>
      Kurs: `
    },
    info_cancel: {
      header: 'Att tänka på innan du avbryter!',
      body: `Ändringar för text och bild kommer att försvinna om du avbryter. 
      <br/>  
      <br/> 
            Vill du fortsätta att avbryta?`,
      btnCancel: 'Nej, gå tillbaka',
      btnConfirm: 'Ja, fortsätt avbryta',
      infoCourse: `Du har valt...<br/>
      <br/>
      Kurs: `
    },
    editCourseIntro: 'Administrera kursinformation',
    image: {
      reset: 'Återställ till sparad bild',
      choose: 'Välj bild',
      name: 'Bildnamn:',
      noChosen: 'Ingen bild vald',
      choiceInfo: 'Välj bild som ska visas på kursinformationssidan:',
      firstOption: 'Bild utvald utifrån huvudområde',
      secondOption: 'Egen vald bild',
      agreeCheck: 'Jag garanterar härmed att jag har rätt att använda och publicera uppladdat material och att jag vid brott mot detta är medveten om att jag har ett personligt ansvar. Läs mer i användarvillkoren.',
      modalInfo: 'Välj bild att visa på sidan Kursinformation. Du kan välja att visa en standardbild baserat på kursens huvudområde/ämne eller välja att ladda upp en egen bild. Bilden kommer att visas med formatet 300px * 400px. Filformatet måste vara .png eller .jpg.'
    },
    step_1_desc: 'Börja med att välja vilken bild som ska visas på kursinformationssidan (steg 1 av 3). I nästa steg (2 av 3) kommer du att kunna redigera den inledande texten. I sista steget (3 av 3) ges möjlighet att först granska bild och text och sedan publicera det på sidan Kursinformation.',
    step_2_desc: 'Du kan här skapa / redigera introduktion till kursen i form av text som ersätter kortbeskrivningen som finns i KOPPS. Vill man återgå till kortbeskrivningen tar man bort introduktion till kursen nedan',
    step_3_desc: 'I detta steg (3 av 3) visas hur bild med text kommer att se ut på sidan Kursinformation (svensk och engelsk sida). Här finns möjlighet att gå tillbaka för att redigera text (och ett steg till för att välja ny bild) eller publicera introduktionen på Kursinformationssidan.',
    label_max_number_letters: 'Maximalt antal tecken är 1500.',
    label_left_number_letters: 'Antal tecken kvar att använda:',
    label_step_1: 'Välja bild',
    label_step_2: 'Redigera text',
    label_step_3: 'Granska och publicera',
    langLabelKopps: {
      en: 'Kortbeskrivning i KOPPS (EN)',
      sv: 'Kortbeskrivning i KOPPS (SV)'
    },
    langLabelIntro: {
      en: 'Introduktion till kursen (EN)',
      sv: 'Introduktion till kursen (SV)'
    },
    langLabel: {
      en: 'Engelsk text',
      sv: 'Svensk text'
    },
    changed_by: 'Senast ändrad av:',
    button: {
      cancel: 'Avbryt',
      publish: 'Publicera',
      step1: 'Välj bild',
      step2: 'Redigera text',
      step3: 'Granska'
    },
    alt: {
      step1: 'Till förra steg att välja bild',
      step2Next: 'Till nästa steg att redigera text',
      step2Back: 'Till förra steg att redigera text',
      step3: 'Till nästa steg att Förhandsgranska introduktion till kursen',
      cancel: 'Avbryt och gå till admin startsida',
      publish: 'Spara och publicera introduktion till kursen',
      image: 'Bild för kurssidasdekoration'
    }
  },
  courseImage: {
    Arkitektur: 'Picture_by_MainFieldOfStudy_01_Architecture.jpg',
    Bioteknik: 'Picture_by_MainFieldOfStudy_02_Biotechnology.jpg',
    'Datalogi och datateknik': 'Picture_by_MainFieldOfStudy_03_Computer_Science.jpg',
    Elektroteknik: 'Picture_by_MainFieldOfStudy_04_Electrical_Engineering.jpg',
    Fysik: 'Picture_by_MainFieldOfStudy_05_Physics.jpg',
    'Industriell ekonomi': 'Picture_by_MainFieldOfStudy_06_Industrial_Management.jpg',
    Informationsteknik: 'Picture_by_MainFieldOfStudy_07_Information_Technology.jpg',
    'Informations- och kommunikationsteknik': 'Picture_by_MainFieldOfStudy_08_Information_Communication.jpg',
    Kemiteknik: 'Picture_by_MainFieldOfStudy_09_Chemical_Science.jpg',
    'Kemi och kemiteknik': 'Picture_by_MainFieldOfStudy_10_Chemistry_Chemical.jpg',
    Matematik: 'Picture_by_MainFieldOfStudy_11_Mathematics.jpg',
    Miljöteknik: 'Picture_by_MainFieldOfStudy_12_Environmental_Engineering.jpg',
    'Molekylära livsvetenskaper': 'Picture_by_MainFieldOfStudy_13_Molecular_Life_Science.jpg',
    Maskinteknik: 'Picture_by_MainFieldOfStudy_14_Mechanical_Engineering.jpg',
    Materialvetenskap: 'Picture_by_MainFieldOfStudy_15_Materials_Science.jpg',
    'Medicinsk teknik': 'Picture_by_MainFieldOfStudy_16_Medical_Engineering.jpg',
    Materialteknik: 'Picture_by_MainFieldOfStudy_17_Materials_Engineering.jpg',
    Samhällsbyggnad: 'Picture_by_MainFieldOfStudy_18_Built_Environment.jpg',
    'Teknisk fysik': 'Picture_by_MainFieldOfStudy_19_Engineering_Physics.jpg',
    'Teknik och ekonomi': 'Picture_by_MainFieldOfStudy_20_Technology_Economics.jpg',
    'Teknik och hälsa': 'Picture_by_MainFieldOfStudy_21_Technology_Health.jpg',
    'Teknik och management': 'Picture_by_MainFieldOfStudy_22_Technology_Management.jpg',
    Teknik: 'Picture_by_MainFieldOfStudy_23_Technology.jpg',
    'Teknik och lärande': 'Picture_by_MainFieldOfStudy_25_Technology_Learning.jpg',
    default: 'Picture_by_MainFieldOfStudy_26_Default_picture.jpg'
  }
}
