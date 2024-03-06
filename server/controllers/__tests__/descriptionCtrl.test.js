const { getCourseInfo, patchCourseInfo, postCourseInfo } = require('../../apiCalls/kursInfoApi')
const { updateDescription } = require('../descriptionCtrl')
const { reqHandler } = require('../testHelpers')

jest.mock('../../server')
jest.mock('../../configuration')
jest.mock('../../apiCalls/kursInfoApi')
jest.mock('../../apiCalls/koppsApi')
jest.mock('../../utils/webContextUtil')

const courseCode = 'ABC123'
const userId = 'user123'

const data = {
  courseDispositionSv: 'text1',
  courseDispositionEn: 'text2',
  sellingTextSv: 'text3',
  sellingTextEn: 'text4',
  imageName: 'image1',
  doNotSendToApi: 'value3',
  supplementaryInfoSv: 'do not send to api',
}
describe('descriptionCtrl - updateDescription', () => {
  it('should call kursinfoApi with PATCH when courseinfo exists', async () => {
    getCourseInfo.mockResolvedValueOnce({ supplementaryInfo: { sv: '', en: '' } })

    await reqHandler(updateDescription, { params: { courseCode }, body: data }, { userId: userId })

    expect(postCourseInfo).not.toHaveBeenCalled()
    expect(patchCourseInfo).toHaveBeenCalledWith(courseCode, {
      courseDisposition: {
        sv: 'text1',
        en: 'text2',
      },
      sellingText: {
        sv: 'text3',
        en: 'text4',
      },
      imageInfo: 'image1',
      lastChangedBy: userId,
    })
  })
  it('should call kursinfoApi with POST when no courseinfo exists', async () => {
    getCourseInfo.mockResolvedValueOnce({ notFound: true })

    await reqHandler(updateDescription, { params: { courseCode }, body: data }, { userId: userId })

    expect(patchCourseInfo).not.toHaveBeenCalled()

    expect(postCourseInfo).toHaveBeenCalledWith(courseCode, {
      courseDisposition: {
        sv: 'text1',
        en: 'text2',
      },
      sellingText: {
        sv: 'text3',
        en: 'text4',
      },
      imageInfo: 'image1',
      lastChangedBy: userId,
    })
  })
})
