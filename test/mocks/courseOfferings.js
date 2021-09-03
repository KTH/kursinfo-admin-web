const _mockEarliestSemester = '20172'
const mockParsedOfferingsX = [
  {
    semester: '',
    schoolMainCode: '---',
    departmentName: '',
    connectedPrograms: '',
    courseCode: '',
    offeringId: '',
  },
  {
    semester: '',
    schoolMainCode: '---',
    departmentName: '',
    connectedPrograms: 'XXX-1, YYY-ZZZ-2',
    courseCode: '',
    offeringId: '',
  },
  {
    semester: '20181',
    schoolMainCode: 'ABE',
    departmentName: 'ABE/Test',
    connectedPrograms: 'XXX-1, YYY-ZZZ-2',
    courseCode: 'AAA123',
    offeringId: '2',
  },
  {
    semester: _mockEarliestSemester, //20172
    schoolMainCode: 'ABE',
    departmentName: 'ABE/Test',
    connectedPrograms: 'XXX-1, YYY-ZZZ-2',
    courseCode: 'AAA123',
    offeringId: '1',
  },
  {
    semester: '20202',
    schoolMainCode: 'ABE',
    departmentName: 'ABE/Test',
    connectedPrograms: 'XXX-1, YYY-ZZZ-2',
    courseCode: 'AAA123',
    offeringId: '1',
  },
]
const mockCourseAnalyses = {
  AAA123: {
    [_mockEarliestSemester]: {
      1: 'analysis-20172-1.pdf',
    },
    20181: {
      2: 'analysis-20181-2.pdf',
    },
    20201: {
      1: 'analysis-20201-1.pdf',
    },
  },
}
const mockCourseMemos = {
  AAA123: {
    [_mockEarliestSemester]: {
      1: { memoId: 'memo-AAA12320172-xxx.pdf', isPdf: true },
    },
    20181: {
      2: { memoId: 'memo-AAA12320181-yyy.pdf', isPdf: true },
    },
    20201: {
      1: { memoId: 'AAA12320201-1', isPdf: false, lastChangeDate: '2020-01-13' },
    },
  },
}
const mockExpectedCourseOfferings = {
  withAnalyses: [
    {
      semester: '20162',
      schoolMainCode: 'ABE',
      departmentName: 'ABE/Test',
      connectedPrograms: 'XXX-1, YYY-ZZZ-2',
      courseCode: 'AAA123',
      offeringId: '1',
      courseAnalysis: '',
    },
    {
      semester: '20201',
      schoolMainCode: 'ABE',
      departmentName: 'ABE/Test',
      connectedPrograms: 'XXX-1, YYY-ZZZ-2',
      courseCode: 'AAA123',
      offeringId: '1',
      courseAnalysis: 'analysis-20201-1.pdf',
    },
  ],
  withMemos: [
    {
      semester: '20201',
      startDate: '2020-01-20',
      schoolMainCode: 'ABE',
      departmentName: 'ABE/Test',
      connectedPrograms: 'XXX-1, YYY-ZZZ-2',
      courseCode: 'AAA123',
      offeringId: '1',
      courseMemoInfo: {
        memoId: 'AAA12320201-1',
        isPdf: false,
        lastChangeDate: '2020-01-13',
        publishedData: {
          offeringStartTime: '2020-01-20',
          publishedBeforeDeadline: true,
          publishedBeforeStart: true,
          publishedTime: '2020-01-13',
        },
      },
    },
  ],
}

const mockPublishData = {
  offeringStartTime: '2020-01-20',
  publishedBeforeDeadline: true,
  publishedBeforeStart: true,
  publishedTime: '2020-01-13',
}

export { mockParsedOfferingsX, mockCourseAnalyses, mockCourseMemos, mockExpectedCourseOfferings, mockPublishData }
