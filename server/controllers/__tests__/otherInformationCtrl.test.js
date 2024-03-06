const { getCourseInfo, patchCourseInfo, postCourseInfo } = require('../../apiCalls/kursInfoApi')
const { updateOtherInformation } = require('../otherInformationCtrl')
const { reqHandler } = require('../testHelpers')

jest.mock('../../server')
jest.mock('../../configuration')
jest.mock('../../apiCalls/kursInfoApi')
jest.mock('../../apiCalls/koppsApi')
jest.mock('../../utils/webContextUtil')

const courseCode = 'ABC123'
const userId = 'user123'
const data = {
  supplementaryInfoSv: 'value1',
  supplementaryInfoEn: 'value2',
  doNotSendToApi: 'value3',
  sellingTextSv: 'do not send to api',
}

describe('otherInformationCtrl - updateOtherInformation', () => {
  it('should call kursinfoApi with PATCH when courseinfo exists', async () => {
    getCourseInfo.mockResolvedValueOnce({ supplementaryInfo: { sv: '', en: '' } })

    await reqHandler(updateOtherInformation, { params: { courseCode }, body: data }, { userId: userId })

    expect(postCourseInfo).not.toHaveBeenCalled()
    expect(patchCourseInfo).toHaveBeenCalledWith(courseCode, {
      supplementaryInfo: {
        sv: 'value1',
        en: 'value2',
      },
      lastChangedBy: userId,
    })
  })

  it('should call kursinfoApi with POST when no courseinfo exists', async () => {
    getCourseInfo.mockResolvedValueOnce({ notFound: true })

    await reqHandler(updateOtherInformation, { params: { courseCode }, body: data }, { userId: userId })

    expect(patchCourseInfo).not.toHaveBeenCalled()
    expect(postCourseInfo).toHaveBeenCalledWith(courseCode, {
      supplementaryInfo: {
        sv: 'value1',
        en: 'value2',
      },
      lastChangedBy: userId,
    })
  })
})
