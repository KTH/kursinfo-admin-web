const mockCourseMemosSemesters = ['20172', '20181', '20182', '20191', '20192', '20201', '20202', '20211']
const mockExpectedCourseMemos = {
  DD1390: {
    20192: {
      1: { memoId: 'memo-DD139020192-xxx.pdf', isPdf: true },
      2: { memoId: 'memo-DD139020192-yyy.pdf', isPdf: true },
    },
    20201: {
      1: { memoId: 'memo-DD139020201-xxx.pdf', isPdf: true },
      2: { memoId: 'memo-DD139020201-yyy.pdf', isPdf: true },
    },
    20202: {
      1: { memoId: 'DD139020202-1', isPdf: false },
      2: { memoId: 'DD139020202-2', isPdf: false },
      3: { memoId: 'DD139020202-3-4', isPdf: false },
      4: { memoId: 'DD139020202-3-4', isPdf: false },
    },
    20211: {
      1: { memoId: 'DD139020211-1', isPdf: false },
      2: { memoId: 'DD139020211-2', isPdf: false },
      3: { memoId: 'DD139020211-3', isPdf: false },
    },
    numberOfUniqMemos: 6,
    numberOfUniqPdfMemos: 4,
  },
}
const _mockKursPmDataApiDataResponse = {
  20192: [
    {
      courseCode: 'DD1390',
      applicationCodes: [1],
      courseMemoFileName: 'memo-DD139020192-xxx.pdf',
      isPdf: true,
    },
    {
      courseCode: 'DD1390',
      applicationCodes: [2],
      courseMemoFileName: 'memo-DD139020192-yyy.pdf',
      isPdf: true,
    },
  ],
  20201: [
    {
      courseCode: 'DD1390',
      applicationCodes: [1],
      courseMemoFileName: 'memo-DD139020201-xxx.pdf',
      isPdf: true,
    },
    {
      courseCode: 'DD1390',
      applicationCodes: [2],
      courseMemoFileName: 'memo-DD139020201-yyy.pdf',
      isPdf: true,
    },
  ],
  20202: [
    {
      courseCode: 'DD1390',
      applicationCodes: [1],
      memoEndPoint: 'DD139020202-1',
      isPdf: false,
    },
    {
      courseCode: 'DD1390',
      applicationCodes: [2],
      memoEndPoint: 'DD139020202-2',
      isPdf: false,
    },
    {
      courseCode: 'DD1390',
      applicationCodes: [3, 4],
      memoEndPoint: 'DD139020202-3-4',
      isPdf: false,
    },
  ],
  20211: [
    {
      courseCode: 'DD1390',
      applicationCodes: [1],
      memoEndPoint: 'DD139020211-1',
      isPdf: false,
    },
    {
      courseCode: 'DD1390',
      applicationCodes: [2],
      memoEndPoint: 'DD139020211-2',
      isPdf: false,
    },
    {
      courseCode: 'DD1390',
      applicationCodes: [3],
      memoEndPoint: 'DD139020211-3',
      isPdf: false,
    },
  ],
}
const mockKursPmDataApiData = semester =>
  _mockKursPmDataApiDataResponse[semester]
    ? _mockKursPmDataApiDataResponse[semester]
    : _mockKursPmDataApiDataResponse.default

export { mockCourseMemosSemesters, mockExpectedCourseMemos, mockKursPmDataApiData }
