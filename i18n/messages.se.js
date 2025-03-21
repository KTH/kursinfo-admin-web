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

    language_link_lang_en: 'English',

    /**
     * Error messages
     */

    error_bad_request: 'Tyvärr kan eller vill inte servern svara',
    error_not_found: 'Tyvärr kunde vi inte hitta sidan du söker',
    error_generic: 'Något gick fel på servern, var god försök igen senare',

    /**
     * Authentication message
     */

    contact_support: 'Kontakta',
    for_questions: 'vid frågor.',
    friendly_message_have_not_rights: 'Du saknar behörighet att använda Om kursens administrationsverktyg',
    message_have_not_rights: `Du saknar behörighet att använda Om kursens administrationsverktyg. Behörighet ges per automatik till de som är inlagda som examinator, kursansvarig eller lärare för kursen i Kopps.`,
    message_have_not_rights_link_pre_text: 'Det är möjligt att',
    message_have_not_rights_link_href:
      'https://intra.kth.se/utbildning/systemstod/om-kursen/behorighet-for-om-kursen-1.1051642',
    message_have_not_rights_link_text: 'beställa administratörsbehörighet till Om kursens administrationsverktyg',
    message_have_not_rights_link_after_text:
      'Beställningen behöver göras av Utbildningsadministrativt Ansvarig (UA) på skolan, eller av närmsta chef i samråd med UA.',
    /**
     * Message keys
     */
    service_name: 'Kursinfo-admin-web',
    title: 'Administrera Om kursen',
    description: `Här kan du, som kursansvarig eller examinator för kursen, administrera den information på platsen 
    ”Om kursen” som inte hämtas från KOPPS. I dagsläget är det endast ”Introduktion till kursen” som administreras här.`,
    example_message_key: 'Här är en svensk översättning på en label',

    button_label_example: 'Klicka här för att skicka data till servern!',

    field_text_example: 'Data att skicka till API',

    field_label_get_example: 'Min datamodell(Svar från api anrop GET): ',
    field_label_post_example: 'Min datamodell(Svar från api anrop POST): ',

    lang_block_id: '1.272446',
    locale_text: 'Denna sida på svenska',

    site_name: 'Administrera Om kursen',
    host_name: 'KTH',
    page_admin: 'KURSINFO ADMIN',
    page_course_programme: 'KURS- OCH PROGRAMKATALOGEN',
  },
  pageTitles: {
    course_admin_title: 'Administrera',
    about_course: 'Om kursen',
    administrate: 'Administrera Om kursen',
    instruction_p1:
      'Här i Om kursens administrationsverktyg finns tre funktioner för att redigera en del av den information som visas på sidorna för Om kursen. Du kan redigera viss information på sidan Inför kursval, skapa och publicera kurs-PM samt ladda upp och publicera Kursanalys och kursdata.',
    instruction_p2:
      'På Om kursens sidor finns även information som hämtats från Kopps. Det är kurs­plan, kurs­gemensam information och kurs­tillfälle, inklusive vem som är examinator, kurs­ansvarig, lärare och lärarassistenter för kursen. Denna information redigeras i Kopps.',
    instruction_p3_start:
      'Vilka funktioner man har tillgång till i Om kursens administrationsverktyg beror på vilken behörighet man har.',
    instruction_p3_link_label: 'Instruktioner och information om behörighet för Om kursen hittar du på intranätet',
    instruction_p3_conclusion: '.',
    links_to: {
      kutv: {
        aTitle: 'Kursens utveckling',
        ariaLabel: 'Till Kursens utveckling vy',
      },
      pm: {
        aTitle: 'Förbereda och gå kurs/Kurs-PM',
        ariaLabel: 'Till sidan Förbereda och gå kurs/Kurs-PM',
      },
      pmdata: {
        aTitle: 'Kurs-PM',
        ariaLabel: 'Till sidan Kurs-PM',
      },
      kinfo: {
        aTitle: 'Inför kursval.',
        ariaLabel: 'Till Kursinformation vy',
      },
      canvas: {
        aTitle: 'Funktionen Kursöversikt i Canvas',
        ariaLabel: 'Funktionen Kursöversikt i Canvas',
      },
    },
    alertMessages: {
      noMemoHeader: '... men det saknas ett publicerat kurs-PM',
      kutv: {
        save: 'Utkast för kursanalys och kursdata har sparats',
        s_msg: 'Du hittar det sparade utkastet under Kursanalys och kursdata/ Publicera ny',
        pub: 'Kursanalys och kursdata har publicerats',
        delete: 'Utkast för kursanalys och kursdata har raderats',
        see_more: 'Se ',
      },
      pm: {
        save: 'Utkast för kurs-PM har sparats',
        s_msg: 'Du hittar det sparade utkastet under Kurs-PM/ Publicera ny',
        pub: 'Kurs-PM har publicerats',
        pub_changed: 'En ny version av kurs-PM har publicerats',
        delete: 'Utkast för kurs-PM har raderats',
        see_more: 'Se ',
        pub_info: 'Kom ihåg att länka till ditt kurs-PM från kursrummet i Canvas. Läs mer på intranätet om ',
        pub_changed_info:
          'Kom ihåg att informera dina studenter om att det finns en ny version av kurs-PM. Tänk även på att informera om vilka ändringar som gjorts.',
      },
      pmdata: {
        save: 'Utkast för kurs-PM har sparats',
        removedPublished: 'Utkast för publicerad kurs-PM har togs bort',
        s_msg: 'Du hittar det sparade utkastet under ',
        r_msg: 'Utkast för kurs-PM har togs bort från ',
        fast_admin_link_label: {
          save: {
            create: 'Skapa och publicera kurs-PM',
            change: 'Ändra publicerat kurs-PM',
          },
          removedPublished: 'Ändra publicerad',
        },
        pub: 'Kurs-PM har publicerats',
        pub_changed: 'En ny version av kurs-PM har publicerats',
        delete: 'Utkast för kurs-PM har raderats',
        see_more: 'Se ',
        pub_info: 'Kom ihåg att länka till ditt kurs-PM från kursrummet i Canvas. Läs mer på intranätet om ',
        pub_changed_info:
          'Kom ihåg att informera dina studenter om att det finns en ny version av kurs-PM. Tänk även på att informera om vilka ändringar som gjorts.',
      },
      kinfo: {
        pub: 'Sidan Inför kursval har publicerats',
        see_more: 'Bild och text har publicerats på sidan',
      },
      alertinfo: {
        pub_info: 'Kom ihåg att länka till ditt kurs-PM från kursrummet i Canvas. Läs mer på intranätet om ',
        pub_changed_info:
          'Kom ihåg att informera dina studenter om att det finns en ny version av kurs-PM. Tänk även på att informera om vilka ändringar som gjorts.',
      },
      semester: 'Termin',
      course_offering: 'Kursomgång',
      over_text_limit: 'Texten får bara bestå av 2 000 tecken',
      over_html_limit: 'HTML texten får bara bestå av 10 000 tecken',
      api_error: 'Det gick inte att spara texten på grund av teknisk fel. Kopiera texten och försök igen senare',
      storage_api_error: `Det gick inte att publicera den bild du valt. 
      Gå tillbaka till ”Välj bild” för att byta bild. Prova sedan att ”Publicera”.`,
      kopps_api_down: `Det går för närvarande inte att hämta information från KOPPS. 
        Det kan antingen bero på att kurskoden är felaktig eller på kommunikationsfel.`,
    },
    course_short_semester: {
      1: 'VT ',
      2: 'HT ',
    },
  },
  startCards: {
    sellingText_hd: 'Sidan Inför kursval',
    sellingText_desc_p1:
      'Välj en bild samt skriv en introduktion till kursen för att hjälpa studenten att göra sitt kursval. Introduktionen till kursen visas överst på sidan Inför kursval.',
    sellingText_desc_p2: 'Du kan även välja att skriva information om kursupplägg samt lägga till övrig information.',
    sellingText_btn: 'Redigera',
    coursePM_hd: 'Kurs-PM',
    coursePM_create_desc_p1:
      'Skapa och publicera ett kurs-PM för kommande kursomgångar eller ändra ett redan publicerat kurs-PM.',
    coursePM_create_desc_p2: 'Ett publicerat kurs-PM visas som en undersida till: Förbereda och gå kurs.',
    coursePM_create_desc_p3:
      'Du kan även välja att ladda upp och publicera ett kurs-PM som du har skapat utanför systemstödet, via funktionen: Ladda upp kurs-PM som PDF. Filen du publicerar måste vara i PDF-format och tillgänglighetsanpassad.',
    coursePM_link_upload_memo: 'Ladda upp kurs-PM som PDF',
    coursePM_btn_edit: 'Ändra publicerad',
    coursePM_btn_new: 'Skapa, publicera',
    courseDev_decs_alert_title: 'Kursanalys och kursdata har flyttat!',
    courseDev_decs_alert_p1:
      'I mars 2025 avvecklas det här verktyget för publicering och redigering av kursanalys och kursdata. Sista användning är för kurser som gått under läsperiod 2 i HT24. Från läsperiod 3 i VT25 fylls kursanalys i och publiceras i Canvas. Kursdata och del av kursanalys publiceras också automatiskt på Om kursen.',
    courseDev_decs_alert_p2: 'Läs om det nya automatiserade systemet i Canvas här:',
    courseDev_decs_alert_p2_link: 'Nytt IT-systemstöd för kursvärdering och kursanalys',
  },

  editCourseStart: {
    pageHeader: 'Sidan Inför kursval',
    intro:
      'Börja med att välja vilken del av sidan du vill redigera. I nästa steg kan du redigera ditt innehåll. Bild och text kommer att publiceras på sidan Inför kursval',
    header: 'Välj del att redigera',
    options: {
      description: 'Bild, introduktion till kursen och kursupplägg',
      recommendedPrerequisites: 'Rekommenderade förkunskaper',
      otherInformation: 'Övrig information',
    },
    nextButton: 'Redigera',
  },

  editRecommendedPrerequisites: {
    pageHeader: 'Rekommenderade förkunskaper',
    step1: {
      title: 'Redigera text',
      intro: `Rubriken ”Rekommenderade förkunskaper” ska beskriva vilka kunskaper och färdigheter (utöver behörighetskraven) som studenterna behöver för att kunna ta till sig kursen. 
              Studenterna kan använda informationen för att förbereda sig för kursen eller som underlag för om de ska välja kursen eller inte.
              Ange helst explicita kunskaper och färdigheter och inte bara kursnamn, till exempel ”programmering i Python” eller ”gränsvärdesberäkningar”.`,
      alert: `Observera att texterna visas för samtliga kurstillfällen. Om kursen ges vid flera tillfällen samma termin kan du behöva anpassa texten. Ange max 2000 tecken per text.`,
      nextButton: 'Granska',
      fields: {
        recommendedPrerequisitesSv: 'Rekommenderade förkunskaper (SV)',
        recommendedPrerequisitesEn: 'Rekommenderade förkunskaper (EN)',
      },
    },
    step2: {
      title: 'Granska och publicera',
      header: 'Granska',
      nextButton: 'Publicera',
      backButton: 'Redigera text',
      fields: {
        recommendedPrerequisitesSv: 'Rekommenderade förkunskaper',
        recommendedPrerequisitesEn: 'Recommended prerequisites',
      },
    },
  },
  editOtherInformation: {
    pageHeader: 'Övrig information',
    step1: {
      title: 'Redigera text',
      intro: `Här lägger du in övrig information som kan vara viktig för studenten att veta. Texten kommer att visas längst ner på sidan Inför kursval.`,
      alert: `Observera att texterna visas för samtliga kurstillfällen. Om kursen ges vid flera tillfällen samma termin kan du behöva anpassa texten. Ange max 2000 tecken per text.`,
      nextButton: 'Granska',
      fields: {
        supplementaryInfoSv: 'Övrig information (SV)',
        supplementaryInfoEn: 'Övrig information (EN)',
      },
    },
    step2: {
      title: 'Granska och publicera',
      header: 'Granska',
      nextButton: 'Publicera',
      backButton: 'Redigera text',
      fields: {
        supplementaryInfoSv: 'Övrig information',
        supplementaryInfoEn: 'Supplementary information',
      },
    },
  },

  editDescription: {
    pageHeader: 'Introduktion till kursen och kursupplägg',

    step1: {
      title: 'Välj bild',
      intro: 'I detta steg kan du välja mellan en standardbild eller ladda upp en egen.',
      nextButton: 'Redigera text',
      headerModal: {
        header: 'Välj bild',
        body: `Välj en bild att visa på Inför kursval och Kurs-PM. Du kan välja att visa en standardbild baserad på kursens huvudområde eller att ladda upp en egen bild. För att bilden ska uppfylla kraven för tillgänglighet ska den inte vara informationsbärande.
          <br/>
          <br/>
          Bilden kommer att visas i storleken 400px i bredd och 300px i höjd. Tillåtna filformat är .png och .jpg. Du måste ha rättigheter att använda den bild du laddar upp.`,
        btnCancel: 'Stäng',
      },
      image: {
        reset: 'Återställ till sparad bild',
        choose: 'Välj bild',
        noChosen: 'Ingen bild vald',
        choiceInfo: 'Välj en bild att visa på sidan Inför kursval',
        firstOption: 'Standardbild utifrån kursens huvudområde',
        secondOption: 'Egen bild',
        agreeCheck_1: 'Jag intygar att KTH äger rätten att använda bilden. Läs mer om',
        imagesOnTheWeb: 'Bilder på webben',
        agreeCheck_2: 'och vilka bilder du kan använda.',
        alt: 'Bild för kurssidasdekoration',
      },
      alertMessages: {
        approve_term:
          'Du behöver godkänna villkoren (se markering i rött nedan) för att kunna gå vidare till ”Redigera text”.',
        failed_compression_of_file: 'Något gick fel vid laddning eller komprimering av en bild',
        no_file_chosen: `Du behöver välja en bild med rätt format (se markering i rött nedan) 
            för att kunna gå vidare till ”Redigera text”.`,
        replace_api_with_default: `Observera att den egna valda bilden som nu är publicerad kommer att raderas när du publicerar i steg 3.`,
      },
    },
    step2: {
      title: 'Redigera text',
      intro: `Beskriv kortfattat kursinnehållet under ”Introduktion till kursen” och ge en översiktlig beskrivningen av hur undervisningen är upplagd under ”Kursupplägg”. Sidan visas på både svenska och engelska, så inkludera text på båda språken.`,
      alert: `Observera att texterna visas för samtliga kurstillfällen. Om kursen ges vid flera tillfällen samma termin kan du behöva anpassa texten. Ange max 2000 tecken per text.`,
      nextButton: 'Granska',
      backButton: 'Välj bild',
      fields: {
        sellingTextSv: 'Introduktion till kursen (SV)',
        sellingTextEn: 'Introduktion till kursen (EN)',
        courseDispositionSv: 'Kursupplägg (SV)',
        courseDispositionEn: 'Kursupplägg (EN)',
      },
    },
    step3: {
      title: 'Granska och publicera',
      nextButton: 'Publicera',
      backButton: 'Redigera text',
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
      open: 'Öppna redigering',
      close: 'Stäng redigering',
    },

    editorSection: {
      close: 'Stäng',
      noText: 'Ingen text tillgad',
    },

    controlButtons: {
      back: 'Tillbaka',
      cancel: 'Avbryt',
      next: 'Nästa',
      confirmModals: {
        publish: {
          header: 'Att tänka på innan du publicerar!',
          body: `<br/>
          Publicering kommer att ske på sidan ”Inför kursval”.
            <br/>
            <br/>
            Vill du fortsätta att publicera?`,
          btnCancel: 'Nej, gå tillbaka',
          btnConfirm: 'Ja, fortsätt publicera',
          infoCourse: 'Kurs: ',
        },
        cancel: {
          header: 'Att tänka på innan du avbryter!',
          body: `Ändringar för text och bild kommer att försvinna om du avbryter. 
          <br/>  
          <br/> 
                Vill du fortsätta att avbryta?`,
          btnCancel: 'Nej, gå tillbaka',
          btnConfirm: 'Ja, fortsätt avbryta',
          infoCourse: 'Kurs: ',
        },
      },
    },
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
    default: 'Picture_by_MainFieldOfStudy_26_Default_picture.jpg',
  },
}
