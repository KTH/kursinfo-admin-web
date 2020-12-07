// Please make sure to use the correct quotes:
// - in Swedish, use closing double quote (” ,\u201d) both before and after the text to be quoted,
// - in English, use opening double quote (“, \u201c) before and closing double quote (” \u201d) after the text.
module.exports = {
  shortNames: ['sv', 'se'],
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
    title: 'Kursinformationsadmin',
    description: `Här kan du, som kursansvarig eller examinator för kursen, administrera den information på platsen 
    ”Om kursen” som inte hämtas från KOPPS. I dagsläget är det endast ”Introduktion till kursen” som administreras här.`,
    example_message_key: 'Här är en svensk översättning på en label',

    button_label_example: 'Klicka här för att skicka data till servern!',

    field_text_example: 'Data att skicka till API',

    field_label_get_example: 'Min datamodell(Svar från api anrop GET): ',
    field_label_post_example: 'Min datamodell(Svar från api anrop POST): ',

    lang_block_id: '1.272446',
    locale_text: 'Denna sida på svenska',

    site_name: 'Kursinformationsadmin',
    host_name: 'KTH',
    page_admin: 'KURSINFO ADMIN',
    page_course_programme: 'KURS- OCH PROGRAMKATALOGEN'
  },
  pageTitles: {
    course_admin_title: 'Administrera',
    header_progress_select_pic: '1. Välj bild',
    header_progress_edit: '2. Redigera text',
    header_progress_review: '3. Granska och publicera',
    about_course: 'Om kursen',
    administrate: 'Administrera Om kursen',
    editSelling: 'Redigera introduktion till kursen',
    previewSelling: 'Förhandsgranska introduktion till kursen',
    instruction_kopps_1:
      'Sidorna som tillhör ”Om kursen” består dels av information som hämtas från KOPPS och dels av information som redigeras här i ”Administrera Om kursen”. I KOPPS redigeras kursplan, kursgemensam information och kurstillfälle. Ändring av kursgemensam information samt examinator, kursansvarig och lärare görs i ',
    instruction_kopps_2:
      'av den som är KOPPS-användare. Läs mer om behörigheter och se användare i KOPPS ',
    instruction_kopps_3_link_access_rights: 'Användarbehörighet',
    instruction_kopps_alt: 'Till KOPPS',
    link_user_manual: 'Användarmanual - Om kursen',
    links_to: {
      kutv: {
        aTitle: 'Kursens utveckling och historik',
        aAlt: 'Till Kursens utveckling och historik vy'
      },
      pm: {
        aTitle: 'Kursinformation',
        aAlt: 'Till Kursinformation vy'
      },
      pmdata: {
        aTitle: 'Kurs-PM, Förbereda och gå kurs',
        aAlt: 'Till Kurs-PM vy'
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
        save: 'Utkast för kurs-PM har sparats',
        s_msg: 'Du hittar det sparade utkastet under Kurs-PM/ Publicera ny',
        pub: 'Kurs-PM har publicerats',
        delete: 'Utkast för kurs-PM har raderats'
      },
      pmdata: {
        save: 'Utkast för kurs-PM har sparats',
        removedPublished: 'Utkast för publicerad kurs-PM har togs bort',
        s_msg: 'Du hittar det sparade utkastet under ',
        r_msg: 'Utkast för kurs-PM har togs bort från ',
        fast_admin_link_label: {
          save: 'Skapa och publicera kurs-PM',
          removedPublished: 'Ändra publicerad'
        },
        pub: 'Kurs-PM har publicerats',
        delete: 'Utkast för kurs-PM har raderats'
      },
      kinfo: {
        pub: 'Introduktion till kursen har publicerats '
      },
      see_more: 'Se',
      term: 'Termin',
      course_round: 'Kursomgång',
      over_text_limit: 'Texten får bara bestå av 1 500 tecken',
      over_html_limit: 'HTML texten får bara bestå av 10 000 tecken',
      api_error:
        'Det gick inte att spara texten på grund av teknisk fel. Kopiera texten och försök igen senare',
      storage_api_error: `Det gick inte att publicera den bild du valt. 
      Gå tillbaka till ”Välj bild” för att byta bild. Prova sedan att ”Publicera”.`,
      kopps_api_down: `Det går för närvarande inte att hämta information från KOPPS. 
        Det kan antingen bero på att kurskoden är felaktig eller på kommunikationsfel.`
    },
    course_short_semester: {
      1: 'VT ',
      2: 'HT '
    }
  },
  startCards: {
    sellingText_hd: 'Introduktion till kursen',
    sellingText_desc_p1:
      'Välj en egen dekorativ bild till kurssidan och/eller ersätt kortbeskrivningen i Kopps med en mer informativ introduktion till kursen för att hjälpa studenten att göra rätt kursval.',
    sellingText_desc_p2: '”Introduktion till kursen” visas överst på sidan ”Kursinformation”.',
    sellingText_btn: 'Redigera',
    sellingText_alt: 'Redigera introduktion till kursen',
    coursePM_hd: 'Kurs-PM',
    coursePM_create_desc_p1:
      'Skapa och publicera kurs-PM för kommande kursomgångar eller ändra ett redan publicerat kurs-PM.',
    coursePM_create_desc_p2:
      'Publicerat kurs-PM visas på sidan ”Kursinformation” för vald termin och kursomgång.',
    coursePM_create_desc_p3:
      'Det finns fortfarande möjlighet, men är inte att föredra, att ladda upp ett alternativt kurs-PM.',
    coursePM_link_upload_memo: 'Ladda upp alternativt kurs-PM',
    coursePM_btn_edit: 'Ändra publicerad',
    coursePM_btn_new: 'Skapa, publicera',
    courseDev_hd: 'Kursanalys och kursdata',
    courseDev_decs_p1:
      'Publicera eller ändra publicerad kursanalys och kursdata för kursens utveckling och historik.',
    courseDev_decs_p2:
      'Publicerade kursanalyser med kursdata visas på sidan ”Kursens utveckling och historik”',
    courseDev_btn_edit: 'Ändra publicerad',
    courseDev_btn_new: 'Publicera ny',
    courseDev_link: 'Kursens utveckling - mer information och hjälp',
    beta_coursePm: 'Funktionalitet för att att ladda upp Kurs-PM är under utveckling.',
    beta_more_link: 'Vill du veta mer eller delta?'
  },
  introLabel: {
    alertMessages: {
      approve_term:
        'Du behöver godkänna villkoren (se markering i rött nedan) för att kunna gå vidare till ”Redigera text”.',
      no_file_chosen: `Du behöver välja en bild med rätt format (se markering i rött nedan) 
        för att kunna gå vidare till ”Redigera text”.`,
      not_correct_format_choose_another: `Du behöver välja en bild med rätt format (se markering i rött nedan) 
        för att kunna gå vidare till ”Redigera text”.`,
      not_correct_format_return_to_api_pic: `Du behöver välja en bild med rätt format (se markering i rött nedan) 
        för att kunna gå vidare till ”Redigera text”.`,
      replace_api_with_default: `Observera att den egna valda bilden som nu är publicerad kommer att raderas när du publicerar i steg 3.`
    },
    info_publish: {
      header: 'Att tänka på innan du publicerar!',
      body: `<br/>
        Publicering kommer att ske på sidan ”Kursinformation” och ersätta befintlig introduktion (bild och text) till kursen.
        <br/>
        <br/>
        Vill du fortsätta att publicera?`,
      btnCancel: 'Nej, gå tillbaka',
      btnConfirm: 'Ja, fortsätt publicera',
      infoCourse: 'Kurs: '
    },
    info_cancel: {
      header: 'Att tänka på innan du avbryter!',
      body: `Ändringar för text och bild kommer att försvinna om du avbryter. 
      <br/>  
      <br/> 
            Vill du fortsätta att avbryta?`,
      btnCancel: 'Nej, gå tillbaka',
      btnConfirm: 'Ja, fortsätt avbryta',
      infoCourse: 'Kurs: '
    },
    info_image: {
      header: 'Välj bild',
      body: `Välj dekorativ bild att visa på sidan Kursinformation och Kurs-PM. För att bilden ska uppfylla kraven för Tillgänglighet ska bilden inte vara informationsbärande. Du kan välja att visa en standardbild baserat på kursens huvudområde/ämne eller välja att ladda upp en egen bild. 
      Bilden kommer att visas med formatet 400px i bredd och 300px i höjd. Filformatet måste vara .png eller .jpg.`,
      btnCancel: 'Stäng'
    },
    editCourseIntro: 'Redigera introduktion till kursen',
    image: {
      reset: 'Återställ till sparad bild',
      choose: 'Välj bild',
      name: 'Bildnamn:',
      noChosen: 'Ingen bild vald',
      choiceInfo: 'Välj dekorativ bild som ska visas på kursinformationssidan:',
      firstOption: 'Bild vald utifrån kursens huvudområde',
      secondOption: 'Egen vald bild',
      agreeCheck:
        'Jag garanterar härmed att jag har rätt att använda och publicera uppladdat material och att jag vid brott mot detta är medveten om att jag har ett personligt ansvar. Läs mer om',
      imagesOnTheWeb: 'Bilder på webben'
    },
    step_1_desc: `Börja med att välja en dekorativ bild som ska visas på kursinformationssidan (steg 1 av 3). I nästa steg (2 av 3) kommer du att kunna redigera den inledande texten. 
    I sista steget (3 av 3) ges möjlighet att först granska bild och text och sedan publicera det på sidan ”Kursinformation”.`,
    step_2_desc: `Du kan här skapa / redigera en introduktion till kursen i form av text som ersätter kortbeskrivningen som finns i KOPPS. 
    Vill man återgå till kortbeskrivningen tar man bort texten under ”Introduktion till kursen” nedan. 
    I nästa steg kan du granska bild och text (på svenska och engelska) innan du publicerar på sidan ”Kursinformation”.`,
    step_3_desc: `I detta steg (3 av 3) visas hur den dekorativa bilden med text kommer att se ut på sidan ”Kursinformation” (på svenska och engelska). 
    Här finns möjlighet att gå tillbaka för att redigera text (och ett steg till för att välja ny bild) eller publicera introduktionen på sidan ”Kursinformation”.`,
    label_left_number_letters: 'Antal tecken kvar att använda (av totalt 1500):',
    label_step_1: 'Välj bild',
    label_step_2: 'Redigera text',
    label_step_3: 'Granska',
    langLabelKopps: {
      en: 'Kortbeskrivning i KOPPS (EN)',
      sv: 'Kortbeskrivning i KOPPS (SV)'
    },
    langLabelIntro: {
      en: 'Introduktion till kursen (EN)',
      sv: 'Introduktion till kursen (SV)'
    },
    langLabelText: {
      en: 'Engelsk text',
      sv: 'Svensk text'
    },
    langLabelPreview: {
      en: 'Engelsk introduktion till kursen',
      sv: 'Svensk introduktion till kursen'
    },
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
      image: 'Bild för kurssidasdekoration',
      tempImage: 'Tomt plats för att visa väld bilden'
    },
    required: {
      image: 'Obligatoriskt (format: .png eller .jpg)',
      agreement: 'Obligatoriskt'
    },
    redirectToStart: 'Framgång, omdirigerar till startsidan...'
  },
  courseImage: {
    Arkitektur: 'Picture_by_MainFieldOfStudy_01_Architecture.jpg',
    Bioteknik: 'Picture_by_MainFieldOfStudy_02_Biotechnology.jpg',
    'Datalogi och datateknik': 'Picture_by_MainFieldOfStudy_03_Computer_Science.jpg',
    Elektroteknik: 'Picture_by_MainFieldOfStudy_04_Electrical_Engineering.jpg',
    Fysik: 'Picture_by_MainFieldOfStudy_05_Physics.jpg',
    'Industriell ekonomi': 'Picture_by_MainFieldOfStudy_06_Industrial_Management.jpg',
    Informationsteknik: 'Picture_by_MainFieldOfStudy_07_Information_Technology.jpg',
    'Informations- och kommunikationsteknik':
      'Picture_by_MainFieldOfStudy_08_Information_Communication.jpg',
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
