const mockSemester = '20181'
const mockEarliestSemester = mockSemester

const mockKoppsCourseOfferingsResponse = {
  body: [
    // 1. Empty object
    {
      first_yearsemester: '',
      school_code: '',
      department_name: '',
      connected_programs: [],
      course_code: '',
      offering_id: '',
      offered_semesters: []
    },
    // 2. Object with only program list
    {
      first_yearsemester: '',
      school_code: '',
      department_name: '',
      connected_programs: [
        {
          code: 'XXX',
          study_year: 1
        },
        {
          code: 'YYY',
          spec_code: 'ZZZ',
          study_year: 2
        }
      ],
      course_code: '',
      offering_id: '',
      offered_semesters: []
    },
    // 3. Objects with full data
    {
      first_yearsemester: '20162',
      school_code: 'ABE',
      department_name: 'ABE/Test',
      connected_programs: [
        {
          code: 'XXX',
          study_year: 1
        },
        {
          code: 'YYY',
          spec_code: 'ZZZ',
          study_year: 2
        }
      ],
      course_code: 'AAA123',
      offering_id: '1',
      offered_semesters: [
        { semester: '20162' },
        { semester: '20171' },
        { semester: '20172' },
        { semester: '20181' },
        { semester: '20182' },
        { semester: '20191' },
        { semester: '20192' },
        { semester: '20201' }
      ]
    },
    {
      first_yearsemester: '20201',
      school_code: 'ABE',
      department_name: 'ABE/Test',
      connected_programs: [
        {
          code: 'XXX',
          study_year: 1
        },
        {
          code: 'YYY',
          spec_code: 'ZZZ',
          study_year: 2
        }
      ],
      course_code: 'AAA123',
      offering_id: '1',
      offered_semesters: [{ semester: '20201' }]
    }
  ]
}

const mockAnalysisOfferings = [
  {
    semester: '20162',
    schoolMainCode: 'ABE',
    departmentName: 'ABE/Test',
    connectedPrograms: 'XXX-1, YYY-ZZZ-2',
    courseCode: 'AAA123',
    offeringId: '1'
  },
  {
    semester: '20201',
    schoolMainCode: 'ABE',
    departmentName: 'ABE/Test',
    connectedPrograms: 'XXX-1, YYY-ZZZ-2',
    courseCode: 'AAA123',
    offeringId: '1'
  }
]

const mockSemestersInAnalyses = ['20162', '20201']

const mockMemoOfferings = [
  {
    semester: '20201',
    schoolMainCode: 'ABE',
    departmentName: 'ABE/Test',
    connectedPrograms: 'XXX-1, YYY-ZZZ-2',
    courseCode: 'AAA123',
    offeringId: '1'
  }
]

const mockSemestersInMemos = ['20201']

const mockParsedOfferings = {
  forAnalyses: mockAnalysisOfferings,
  forMemos: mockMemoOfferings
}

const mockOfferingsWithoutAnalysis = [
  // 1. Empty object
  // {
  //   semester: '',
  //   schoolMainCode: '---',
  //   departmentName: '',
  //   connectedPrograms: '',
  //   courseCode: '',
  //   offeringId: ''
  // },
  // 2. Object with only program list
  // {
  //   semester: '',
  //   schoolMainCode: '---',
  //   departmentName: '',
  //   connectedPrograms: 'XXX-1, YYY-ZZZ-2',
  //   courseCode: '',
  //   offeringId: ''
  // },
  // 3. Objects with full data
  {
    semester: '20181',
    schoolMainCode: 'ABE',
    departmentName: 'ABE/Test',
    connectedPrograms: 'XXX-1, YYY-ZZZ-2',
    courseCode: 'AAA123',
    offeringId: '1'
    // },
    // {
    //   semester: mockEarliestSemester, //20172
    //   schoolMainCode: 'ABE',
    //   departmentName: 'ABE/Test',
    //   connectedPrograms: 'XXX-1, YYY-ZZZ-2',
    //   courseCode: 'AAA123',
    //   offeringId: '1'
    // },
    // {
    //   semester: '20202',
    //   schoolMainCode: 'ABE',
    //   departmentName: 'ABE/Test',
    //   connectedPrograms: 'XXX-1, YYY-ZZZ-2',
    //   courseCode: 'AAA123',
    //   offeringId: '1'
  }
]

export {
  mockEarliestSemester,
  mockSemester,
  mockKoppsCourseOfferingsResponse,
  mockAnalysisOfferings,
  mockSemestersInAnalyses,
  mockMemoOfferings,
  mockSemestersInMemos,
  mockParsedOfferings,
  mockOfferingsWithoutAnalysis
}
