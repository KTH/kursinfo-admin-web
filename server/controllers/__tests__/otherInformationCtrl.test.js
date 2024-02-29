const { patchCourseInfo } = require('../../apiCalls/kursInfoApi')
const { updateOtherInformation } = require('../otherInformationCtrl')
const { reqHandler } = require('../testHelpers')

jest.mock('../../server')
jest.mock('../../configuration')
jest.mock('../../apiCalls/kursInfoApi')
jest.mock('../../apiCalls/koppsApi')
jest.mock('../../utils/webContextUtil')

describe('otherInformationCtrl - updateOtherInformation', () => {
  it('should call kursinfoApi with courseCode and relevant data', async () => {
    const courseCode = 'ABC123'
    const data = {
      supplementaryInfoSv: 'value1',
      supplementaryInfoEn: 'value2',
      doNotSendToApi: 'value3',
      sellingTextSv: 'do not send to api',
    }

    await reqHandler(updateOtherInformation, { params: { courseCode }, body: data })

    expect(patchCourseInfo).toHaveBeenCalledWith(courseCode, {
      supplementaryInfo: {
        sv: 'value1',
        en: 'value2',
      },
    })
  })
})
