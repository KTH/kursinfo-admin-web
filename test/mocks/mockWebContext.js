const mockWebContext = {
  koppsData: {
    koppsText: {
      sv: 'Algebra och geometri',
      en: 'Ingen information tillagd',
    },
    mainSubject: 'Matematik',
    courseTitleData: {
      course_code: 'SF1624',
      course_title: 'Algebra och geometri',
      course_credits: 7.5,
      apiError: false,
    },
    lang: 'sv',
    langIndex: 1,
  },
  browserConfig: {
    storageUri: '',
  },
  sellingText: {
    sv: 'Svensk säljande text',
    en: 'English selling text',
  },
  paths: {
    storage: {
      saveImage: {
        method: 'post',
        uri: '/kursinfoadmin/kurser/kurs/storage/saveImage/:courseCode/:published',
      },
    },
  },
  publicHostUrl: 'https://www.kth.se/',
  isDefaultChosen: true,
  userRoles: {
    isCourseResponsible: true,
    isSuperUser: false,
    isExaminator: false,
    isTeacher: false,
  },
}

export default mockWebContext
