const mockCourseAnalysesSemesters = ['20172', '20181', '20182', '20191', '20192', '20201']
const mockExpectedCourseAnalyses = {
  DD1390: {
    20172: {
      1: 'analysis-20172-1.pdf',
      2: 'analysis-20172-2.pdf',
      3: 'analysis-20172-3-4.pdf',
      4: 'analysis-20172-3-4.pdf',
    },
    20182: {
      1: 'analysis-20182-1.pdf',
      2: 'analysis-20182-2.pdf',
      3: 'analysis-20182-3.pdf',
    },
    numberOfUniqAnalyses: 6,
  },
}
const _mockKursutvecklingDataResponse = {
  20172: [
    {
      courseCode: 'DD1390',
      analysisFileName: 'analysis-20172-1.pdf',
      semester: '20172',
      applicationCodes: '1',
    },
    {
      courseCode: 'DD1390',
      analysisFileName: 'analysis-20172-2.pdf',
      semester: '20172',
      applicationCodes: '2',
    },
    {
      courseCode: 'DD1390',
      analysisFileName: 'analysis-20172-3-4.pdf',
      semester: '20172',
      applicationCodes: '3,4',
    },
  ],
  20182: [
    {
      courseCode: 'DD1390',
      analysisFileName: 'analysis-20182-1.pdf',
      semester: '20182',
      applicationCodes: '1',
    },
    {
      courseCode: 'DD1390',
      analysisFileName: 'analysis-20182-2.pdf',
      semester: '20182',
      applicationCodes: '2',
    },
    {
      courseCode: 'DD1390',
      analysisFileName: 'analysis-20182-3.pdf',
      semester: '20182',
      applicationCodes: '3',
    },
  ],
  default: [],
}
const mockKursutvecklingData = semester =>
  _mockKursutvecklingDataResponse[semester]
    ? _mockKursutvecklingDataResponse[semester]
    : _mockKursutvecklingDataResponse.default

export { mockCourseAnalysesSemesters, mockExpectedCourseAnalyses, mockKursutvecklingData }
