const mockWebContext = {
  ladokData: {
    ladokText: {
      sv: 'Algebra och geometri',
      en: 'Ingen information tillagd',
    },
    mainSubject: 'Matematik',
    courseTitleData: {
      courseCode: 'SF1624',
      courseTitle: 'Algebra och geometri',
      courseCredits: '7,5 hp',
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
  hostUrl: 'https://app.kth.se/',
  publicHostUrl: 'https://www.kth.se/',
  isStandardImageChosen: true,
  userRoles: {
    isCourseResponsible: true,
    isSuperUser: false,
    isExaminator: false,
    isTeacher: false,
  },
  langIndex: 1,
  routeData: {
    values: '',
    courseData: '',
  },
}

export default mockWebContext
