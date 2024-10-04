const { getCourseInfo, patchCourseInfo, postCourseInfo } = require('../../apiCalls/kursInfoApi')
const { updateRecommendedPrerequisites } = require('../recommendedPrerequisitesCtrl')
const { reqHandler } = require('../testHelpers')

jest.mock('../../server')
jest.mock('../../configuration')
jest.mock('../../apiCalls/kursInfoApi')
jest.mock('../../apiCalls/koppsApi')
jest.mock('../../utils/webContextUtil')

const courseCode = 'ABC123'
const userId = 'user123'
const data = {
  recommendedPrerequisitesSv: 'value1',
  recommendedPrerequisitesEn: 'value2',
  doNotSendToApi: 'value3',
  sellingTextSv: 'do not send to api',
}

describe('recommendedPrerequisitesCtrl - updateRecommendedPrerequisites', () => {
  it('should call kursinfoApi with PATCH when courseinfo exists', async () => {
    getCourseInfo.mockResolvedValueOnce({ recommendedPrerequisites: { sv: '', en: '' } })

    await reqHandler(updateRecommendedPrerequisites, { params: { courseCode }, body: data }, { userId })

    expect(postCourseInfo).not.toHaveBeenCalled()
    expect(patchCourseInfo).toHaveBeenCalledWith(courseCode, {
      recommendedPrerequisites: {
        sv: 'value1',
        en: 'value2',
      },
      lastChangedBy: userId,
    })
  })

  it('should call kursinfoApi with POST when no courseinfo exists', async () => {
    getCourseInfo.mockResolvedValueOnce({ notFound: true })

    await reqHandler(updateRecommendedPrerequisites, { params: { courseCode }, body: data }, { userId })

    expect(patchCourseInfo).not.toHaveBeenCalled()
    expect(postCourseInfo).toHaveBeenCalledWith(courseCode, {
      recommendedPrerequisites: {
        sv: 'value1',
        en: 'value2',
      },
      lastChangedBy: userId,
    })
  })
})
