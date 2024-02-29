const { getCourseInfo, patchCourseInfo } = require('../kursInfoApi')

const { mockGetAsync, mockPatchAsync, mockPaths } = require('@kth/api-call')
jest.mock('../../configuration')
jest.mock('@kth/api-call')

describe('kursinfo-api', () => {
  test('getCourseInfo should call getAsync', async () => {
    const mockCourseInfo = {
      courseCode: 'courseCode1',
      imageInfo: 'imageInfo2',
      sellingTextAuthor: 'sellingTextAuthor3',
      sellingText: { en: 'en1', sv: 'sv1' },
      courseDisposition: { en: 'en2', sv: 'sv2' },
      supplementaryInfo: { en: 'en3', sv: 'sv3' },
    }
    const mockResponse = {
      response: { statusCode: 200, ok: true },
      body: mockCourseInfo,
    }

    mockGetAsync.mockResolvedValueOnce(mockResponse)

    const courseCode = 'abc123'
    const result = await getCourseInfo(courseCode)

    expect(mockGetAsync).toHaveBeenCalledWith({
      uri: `${mockPaths.getCourseInfoByCourseCode.uri}/${courseCode}`,
    })

    expect(result).toStrictEqual(mockCourseInfo)
  })

  test('patchCourseInfo should call patchAsync', async () => {
    const courseCode = 'abc123'

    const newCourseInfo = {
      imageInfo: 'imageInfo1',
      sellingTextAuthor: 'sellingTextAuthor1',
      sellingText: { en: 'en1', sv: 'sv1' },
      courseDisposition: { en: 'en2', sv: 'sv2' },
      supplementaryInfo: { en: 'en3', sv: 'sv3' },
    }

    await patchCourseInfo(courseCode, newCourseInfo)

    expect(mockPatchAsync).toHaveBeenCalledWith({
      uri: `${mockPaths.patchCourseInfoByCourseCode.uri}/${courseCode}`,
      body: { courseCode, ...newCourseInfo },
    })
  })

  const expectedGenericErrorMessage = 'Något gick fel på servern, var god försök igen senare'

  it('getCourseInfo should throw error if getAsync rejects with error', async () => {
    mockGetAsync.mockRejectedValueOnce(new Error('Some error from getAsync'))
    await expect(getCourseInfo('abc123')).rejects.toThrow(expectedGenericErrorMessage)
  })

  it('patchCourseInfo should throw error if mockPatch rejects with error', async () => {
    mockPatchAsync.mockRejectedValueOnce(new Error('Some error from getAsync'))
    await expect(patchCourseInfo('abc123', { prop: '' })).rejects.toThrow(expectedGenericErrorMessage)
  })

  it('getCourseInfo should throw error if getAsync return non ok status code', async () => {
    mockGetAsync.mockResolvedValueOnce({ response: { statusCode: 400, ok: false } })
    await expect(getCourseInfo('abc123')).rejects.toThrow(expectedGenericErrorMessage)
  })

  it('patchCourseInfo should throw error if mockPatch return non ok status code', async () => {
    mockPatchAsync.mockResolvedValueOnce({ response: { statusCode: 400, ok: false } })
    await expect(patchCourseInfo('abc123')).rejects.toThrow(expectedGenericErrorMessage)
  })
})
