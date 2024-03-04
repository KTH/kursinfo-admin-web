const { filteredKoppsData } = require('../../apiCalls/koppsApi')
const { getCourseInfo, patchCourseInfo } = require('../../apiCalls/kursInfoApi')
const { renderCoursePage } = require('../../utils/renderPageUtil')
const {
  createDescriptionWebContext,
  createOtherInformationWebContext,
  createEditCourseStartWebContext,
} = require('../../utils/webContextUtil')

const { getDescription, updateDescription } = require('../descriptionCtrl')
const { getOtherInformation, updateOtherInformation } = require('../otherInformationCtrl')
const { getEditCourseStart } = require('../editCourseStartCtrl')

const { reqHandler } = require('../testHelpers')

jest.mock('../../server')
jest.mock('../../configuration')
jest.mock('../../apiCalls/kursInfoApi')
jest.mock('../../apiCalls/koppsApi')
jest.mock('../../utils/renderPageUtil')
jest.mock('../../utils/webContextUtil')

describe.each([
  { name: 'getDescription', endpoint: getDescription, createWebContext: createDescriptionWebContext },
  { name: 'getOtherInformation', endpoint: getOtherInformation, createWebContext: createOtherInformationWebContext },
  {
    name: 'getEditCourseStart',
    endpoint: getEditCourseStart,
    createWebContext: createEditCourseStartWebContext,
    skipKursinfoTests: true,
  },
])('Course based controllers - get endpoint: $name', ({ endpoint, createWebContext, skipKursinfoTests }) => {
  it('should call next with error if no courseCode is given', async () => {
    const { res, next } = await reqHandler(endpoint, { params: {} })
    expect(next).toHaveBeenCalledWith(new Error('Missing parameter courseCode'))
    expect(res.render).not.toHaveBeenCalled()
  })

  it('should call next for any thorwn error', async () => {
    const error = new Error('an error')
    filteredKoppsData.mockImplementationOnce(() => {
      throw error
    })

    const { res, next } = await reqHandler(endpoint, { params: { courseCode: 'ABC123' } })

    expect(next).toHaveBeenCalledWith(error)
    expect(res.render).not.toHaveBeenCalled()
  })

  if (!skipKursinfoTests) {
    it('should call kursinfoApi with courseCode', async () => {
      const courseCode = 'ABC123'
      filteredKoppsData.mockResolvedValueOnce({})
      await reqHandler(endpoint, { params: { courseCode } })
      expect(getCourseInfo).toHaveBeenCalledWith(courseCode)
    })
  }

  it('should call koppsApi with courseCode and lang', async () => {
    const courseCode = 'ABC123'
    const lang = 'en'
    await reqHandler(endpoint, { params: { courseCode } }, { lang })
    expect(filteredKoppsData).toHaveBeenCalledWith(courseCode, lang)
  })

  it('should call renderCoursePage', async () => {
    const mockWebContext = { mockProp: 'WebContext123' }
    filteredKoppsData.mockResolvedValueOnce({})
    createWebContext.mockReturnValueOnce(mockWebContext)

    const { req, res } = await reqHandler(endpoint, { params: { courseCode: 'abc123' } })

    expect(renderCoursePage).toHaveBeenCalledWith(req, res, mockWebContext)
  })

  it('calls createWebContext with correct data', async () => {
    const courseCode = 'ABC123'
    const lang = 'en'
    const userId = 'user321'

    const courseInfo = { mockProp: 'courseInfo123' }
    const koppsInfo = { mockProp: 'koppsInfo123' }

    getCourseInfo.mockResolvedValueOnce(courseInfo)
    filteredKoppsData.mockResolvedValueOnce(koppsInfo)

    await reqHandler(endpoint, { params: { courseCode } }, { lang, userId })

    expect(createWebContext).toHaveBeenCalledWith({
      language: lang,
      userId: userId,
      koppsData: koppsInfo,
      courseInfo: !skipKursinfoTests ? courseInfo : undefined,
    })
  })

  it('should call next with HttpError if course code it not found in kopps', async () => {
    filteredKoppsData.mockResolvedValueOnce({
      apiError: true,
      statusCode: 404,
    })
    const { next } = await reqHandler(endpoint, { params: { courseCode: 'ABC123' } })
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 404,
        isHttpError: true,
      })
    )
  })
})

describe.each([
  { name: 'updateDescription', endpoint: updateDescription },
  { name: 'updateOtherInformation', endpoint: updateOtherInformation },
])('Course based controllers - update endpoint: $name', ({ endpoint }) => {
  it('should call next with error if no courseCode is given', async () => {
    const { next } = await reqHandler(endpoint, { params: {} })
    expect(next).toHaveBeenCalledWith(new Error('Missing parameter courseCode'))
  })

  it('should call next for any thorwn error', async () => {
    const error = new Error('an error')
    patchCourseInfo.mockImplementationOnce(() => {
      throw error
    })

    const { next } = await reqHandler(endpoint, { params: { courseCode: 'abc123' }, body: {} })

    expect(next).toHaveBeenCalledWith(error)
  })
})
