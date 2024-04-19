const {
  createOtherInformationWebContext,
  createDescriptionWebContext,
  createEditCourseStartWebContext,
} = require('../webContextUtil')

const configuration = require('../../configuration')

jest.mock('../../configuration')
jest.mock('../../server')

const mockUserId = 'userId'
const mockKoppsData = {
  courseTitleData: {
    courseCode: 'ABC321',
    courseTitle: 'TestCourseTitle',
    courseCredits: 123,
  },
}

const mockCourseInfo = {
  imageInfo: '',
  sellingText: { sv: 'sellingText_sv1', en: 'sellingText_en2' },
  supplementaryInfo: { en: 'supplementaryInfo_en3', sv: 'supplementaryInfo_sv4' },
  courseDisposition: { en: 'courseDisposition_en5', sv: 'courseDisposition_sv6' },
}

const testArgsStart = {
  userId: mockUserId,
  koppsData: mockKoppsData,
}

const testArgsDescription = {
  userId: mockUserId,
  koppsData: mockKoppsData,
  courseInfo: mockCourseInfo,
}
const testArgsOtherInformation = {
  userId: mockUserId,
  koppsData: mockKoppsData,
  courseInfo: mockCourseInfo,
}

describe('webContextUtil - editStart', () => {
  it('should set urls to edit options', async () => {
    const context = createEditCourseStartWebContext(testArgsStart)

    expect(context.routeData.editOptions).toMatchObject({
      description: expect.stringContaining('/edit/ABC321/description'),
      otherInformation: expect.stringContaining('/edit/ABC321/otherInformation'),
    })
  })
})

describe('webContextUtil - description', () => {
  it('should set text values from courseInfo', async () => {
    const context = createDescriptionWebContext(testArgsDescription)

    expect(context.routeData.values).toMatchObject({
      sellingTextSv: mockCourseInfo.sellingText.sv,
      sellingTextEn: mockCourseInfo.sellingText.en,
      courseDispositionSv: mockCourseInfo.courseDisposition.sv,
      courseDispositionEn: mockCourseInfo.courseDisposition.en,
    })
  })

  it('should set text values values to empty string if not set in courseInfo', async () => {
    const context = createDescriptionWebContext({ testArgsOtherInformation, courseInfo: {} })

    expect(context.routeData.values).toMatchObject({
      sellingTextSv: '',
      sellingTextEn: '',
      courseDispositionSv: '',
      courseDispositionEn: '',
    })
  })

  it('should set default image info', async () => {
    const args = testArgsDescription
    args.koppsData.mainSubject = 'Bioteknik'
    const context1 = createDescriptionWebContext(args)
    expect(context1.routeData.defaultImage.imageName).toBe('Picture_by_MainFieldOfStudy_02_Biotechnology.jpg')
    expect(context1.routeData.defaultImage.url).toContain('Picture_by_MainFieldOfStudy_02_Biotechnology.jpg')

    args.koppsData.mainSubject = 'unknownSubject'
    const context2 = createDescriptionWebContext(args)
    expect(context2.routeData.defaultImage.imageName).toBe('Picture_by_MainFieldOfStudy_26_Default_picture.jpg')
    expect(context2.routeData.defaultImage.url).toContain('Picture_by_MainFieldOfStudy_26_Default_picture.jpg')
  })

  it('should set imageFromApi for custom images', async () => {
    const args = testArgsDescription
    args.courseInfo.imageInfo = 'savedImageName'
    const context = createDescriptionWebContext(args)
    expect(context.routeData.imageFromApi.hasCustomImage).toBe(true)
    expect(context.routeData.imageFromApi.imageName).toBe('savedImageName')
    expect(context.routeData.imageFromApi.url).toContain('savedImageName')
  })

  it('should set imageFromApi values when no custom images is saved', async () => {
    const args = testArgsDescription
    args.courseInfo.imageInfo = ''
    const context = createDescriptionWebContext(args)
    expect(context.routeData.imageFromApi.hasCustomImage).toBe(false)
    expect(context.routeData.imageFromApi.imageName).toBeFalsy()
    expect(context.routeData.imageFromApi.url).toBeFalsy()
  })
})

describe('webContextUtil - otherInformation', () => {
  it('should set supplementaryInfo values from courseInfo', async () => {
    const context = createOtherInformationWebContext(testArgsOtherInformation)

    expect(context.routeData.values).toMatchObject({
      supplementaryInfoSv: mockCourseInfo.supplementaryInfo.sv,
      supplementaryInfoEn: mockCourseInfo.supplementaryInfo.en,
    })
  })

  it('should set supplementaryInfo values to empty string if not set in courseInfo', async () => {
    const context = createOtherInformationWebContext({ testArgsOtherInformation, courseInfo: {} })

    expect(context.routeData.values).toMatchObject({
      supplementaryInfoSv: '',
      supplementaryInfoEn: '',
    })
  })
})

describe.each([
  { name: 'editCourseStart', func: createEditCourseStartWebContext, args: testArgsStart },
  { name: 'description', func: createDescriptionWebContext, args: testArgsDescription },
  { name: 'otherInformation', func: createOtherInformationWebContext, args: testArgsOtherInformation },
])('webContextUtil - $name - shared values', ({ func, args }) => {
  it('should set user', () => {
    const context = func(args)
    expect(context.userId).toBe(mockUserId)
  })

  it('should set language', () => {
    const contextSv = func({ ...args, language: 'sv' })
    expect(contextSv.lang).toBe('sv')
    expect(contextSv.langIndex).toBe(1)

    const contextEn = func({ ...args, language: 'en' })
    expect(contextEn.lang).toBe('en')
    expect(contextEn.langIndex).toBe(0)
  })

  it('should set proxyPrefixPath from serverConfig', () => {
    const context = func(args)
    expect(context.proxyPrefixPath).toStrictEqual(configuration.server.proxyPrefixPath)
  })

  it('should set required properties', () => {
    const context = func(args)

    expect(context.browserConfig).toBeDefined()
    expect(context.paths).toBeDefined()
    expect(context.apiHost).toBeDefined()
  })

  it('should set courseData', () => {
    const context = func(args)
    expect(context.routeData).toBeDefined()
    expect(context.routeData.courseData).toMatchObject({
      courseCode: mockKoppsData.courseTitleData.courseCode,
      courseTitle: mockKoppsData.courseTitleData.courseTitle,
      courseCredits: mockKoppsData.courseTitleData.courseCredits,
    })
    expect(context.koppsApiError).toBeFalsy()
  })

  it('should set course code', () => {
    const context = func(args)
    expect(context.courseCode).toBe(mockKoppsData.courseTitleData.courseCode)
  })

  it('should set kopps api error flag', () => {
    const context = func({
      ...args,
      koppsData: {
        apiError: true,
        statusCode: 500,
      },
    })
    expect(context.koppsApiError).toBeTrue()
  })
})
