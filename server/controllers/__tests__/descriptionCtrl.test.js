const { patchCourseInfo } = require('../../apiCalls/kursInfoApi')

const { updateDescription } = require('../descriptionCtrl')
const { reqHandler } = require('../testHelpers')

jest.mock('../../server')
jest.mock('../../configuration')
jest.mock('../../apiCalls/kursInfoApi')
jest.mock('../../apiCalls/koppsApi')
jest.mock('../../utils/webContextUtil')

describe('descriptionCtrl - updateDescription', () => {
  it('should call kursinfoApi with courseCode and relevant data', async () => {
    const courseCode = 'ABC123'
    const data = {
      courseDispositionSv: 'text1',
      courseDispositionEn: 'text2',
      sellingTextSv: 'text3',
      sellingTextEn: 'text4',
      imageName: 'image1',
      doNotSendToApi: 'value3',
      supplementaryInfoSv: 'do not send to api',
    }

    await reqHandler(updateDescription, { params: { courseCode }, body: data })

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
    })
  })
})
