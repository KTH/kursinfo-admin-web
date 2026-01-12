const { getLadokCourseData } = require('../../apiCalls/ladokApi')
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
const { HttpError } = require('../../HttpError')

jest.mock('../../server')
jest.mock('../../configuration')
jest.mock('../../apiCalls/kursInfoApi')
jest.mock('../../apiCalls/ladokApi')
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
    getLadokCourseData.mockImplementationOnce(() => {
      throw error
    })

    const { res, next } = await reqHandler(endpoint, { params: { courseCode: 'ABC123' } })

    expect(next).toHaveBeenCalledWith(error)
    expect(res.render).not.toHaveBeenCalled()
  })

  if (!skipKursinfoTests) {
    it('should call kursinfoApi with courseCode', async () => {
      const courseCode = 'ABC123'
      getLadokCourseData.mockResolvedValueOnce({})
      await reqHandler(endpoint, { params: { courseCode } })
      expect(getCourseInfo).toHaveBeenCalledWith(courseCode)
    })
  }

  it('should call ladokApi with courseCode and lang', async () => {
    const courseCode = 'ABC123'
    const lang = 'en'
    await reqHandler(endpoint, { params: { courseCode } }, { lang })
    expect(getLadokCourseData).toHaveBeenCalledWith(courseCode, lang)
  })

  it('should call renderCoursePage', async () => {
    const mockWebContext = { mockProp: 'WebContext123' }
    getLadokCourseData.mockResolvedValueOnce({})
    createWebContext.mockReturnValueOnce(mockWebContext)

    const { req, res } = await reqHandler(endpoint, { params: { courseCode: 'abc123' } })

    expect(renderCoursePage).toHaveBeenCalledWith(req, res, mockWebContext)
  })

  it('calls createWebContext with correct data', async () => {
    const courseCode = 'ABC123'
    const lang = 'en'
    const userId = 'user321'

    const courseInfo = { mockProp: 'courseInfo123' }
    const ladokInfo = { mockProp: 'ladokInfo123' }

    getCourseInfo.mockResolvedValueOnce(courseInfo)
    getLadokCourseData.mockResolvedValueOnce(ladokInfo)

    await reqHandler(endpoint, { params: { courseCode } }, { lang, userId })

    expect(createWebContext).toHaveBeenCalledWith({
      language: lang,
      userId,
      ladokData: ladokInfo,
      courseInfo: !skipKursinfoTests ? courseInfo : undefined,
    })
  })

  it('should call next with HttpError if course code is not found in ladok', async () => {
    const httpError = new HttpError(404, 'Not Found')
    getLadokCourseData.mockRejectedValueOnce(httpError)
    const { next } = await reqHandler(endpoint, { params: { courseCode: 'ABC123' } })
    expect(next).toHaveBeenCalledWith(httpError)
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
    getCourseInfo.mockResolvedValueOnce({})
    patchCourseInfo.mockImplementationOnce(() => {
      throw error
    })

    const { next } = await reqHandler(endpoint, { params: { courseCode: 'abc123' }, body: {} })

    expect(next).toHaveBeenCalledWith(error)
  })
})
