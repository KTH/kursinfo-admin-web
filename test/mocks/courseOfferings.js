const _mockEarliestSemester = '20172'
const mockRawCourseOfferings = [
  {
    semester: '',
    schoolMainCode: '---',
    departmentName: '',
    connectedPrograms: '',
    courseCode: '',
    offeringId: ''
  },
  {
    semester: '',
    schoolMainCode: '---',
    departmentName: '',
    connectedPrograms: 'XXX-1, YYY-ZZZ-2',
    courseCode: '',
    offeringId: ''
  },
  {
    semester: '20181',
    schoolMainCode: 'ABE',
    departmentName: 'ABE/Test',
    connectedPrograms: 'XXX-1, YYY-ZZZ-2',
    courseCode: 'AAA123',
    offeringId: '2'
  },
  {
    semester: _mockEarliestSemester, //20172
    schoolMainCode: 'ABE',
    departmentName: 'ABE/Test',
    connectedPrograms: 'XXX-1, YYY-ZZZ-2',
    courseCode: 'AAA123',
    offeringId: '1'
  },
  {
    semester: '20202',
    schoolMainCode: 'ABE',
    departmentName: 'ABE/Test',
    connectedPrograms: 'XXX-1, YYY-ZZZ-2',
    courseCode: 'AAA123',
    offeringId: '1'
  }
]
const mockCourseAnalyses = {
  AAA123: {
    [_mockEarliestSemester]: {
      1: 'analysis-20172-1.pdf'
    },
    20181: {
      2: 'analysis-20181-2.pdf'
    },
    20202: {
      1: 'analysis-20202-1.pdf'
    },
    numberOfUniqAnalyses: 3
  }
}
const mockCourseMemos = {
  AAA123: {
    [_mockEarliestSemester]: {
      1: { memoId: 'memo-AAA12320172-xxx.pdf', isPdf: true }
    },
    20181: {
      2: { memoId: 'memo-AAA12320181-yyy.pdf', isPdf: true }
    },
    20202: {
      1: { memoId: 'AAA12320202-1', isPdf: false }
    },
    numberOfUniqMemos: 1,
    numberOfUniqPdfMemos: 2
  }
}
const mockExpectedCourseOfferings = [
  {
    semester: '',
    schoolMainCode: '---',
    departmentName: '',
    connectedPrograms: '',
    courseCode: '',
    offeringId: '',
    courseAnalysis: '',
    courseMemoInfo: {}
  },
  {
    semester: '',
    schoolMainCode: '---',
    departmentName: '',
    connectedPrograms: 'XXX-1, YYY-ZZZ-2',
    courseCode: '',
    offeringId: '',
    courseAnalysis: '',
    courseMemoInfo: {}
  },
  {
    semester: '20181',
    schoolMainCode: 'ABE',
    departmentName: 'ABE/Test',
    connectedPrograms: 'XXX-1, YYY-ZZZ-2',
    courseCode: 'AAA123',
    offeringId: '2',
    courseAnalysis: 'analysis-20181-2.pdf',
    courseMemoInfo: { memoId: 'memo-AAA12320181-yyy.pdf', isPdf: true }
  },
  {
    semester: _mockEarliestSemester,
    schoolMainCode: 'ABE',
    departmentName: 'ABE/Test',
    connectedPrograms: 'XXX-1, YYY-ZZZ-2',
    courseCode: 'AAA123',
    offeringId: '1',
    courseAnalysis: 'analysis-20172-1.pdf',
    courseMemoInfo: { memoId: 'memo-AAA12320172-xxx.pdf', isPdf: true }
  },
  {
    semester: '20202',
    schoolMainCode: 'ABE',
    departmentName: 'ABE/Test',
    connectedPrograms: 'XXX-1, YYY-ZZZ-2',
    courseCode: 'AAA123',
    offeringId: '1',
    courseAnalysis: 'analysis-20202-1.pdf',
    courseMemoInfo: { memoId: 'AAA12320202-1', isPdf: false }
  }
]

export { mockRawCourseOfferings, mockCourseAnalyses, mockCourseMemos, mockExpectedCourseOfferings }
