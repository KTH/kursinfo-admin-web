const i18n = require('../../i18n')
const serverConfig = require('../configuration').server
const browserConfig = require('../configuration').browser
const serverPaths = require('../server').getPaths()

function addBaseData(context, args) {
  const { userId, language } = args
  context.userId = userId
  context.lang = language
  context.langIndex = language === 'en' ? 0 : 1
  context.paths = serverPaths
  context.proxyPrefixPath = serverConfig.proxyPrefixPath
  context.apiHost = serverConfig.hostUrl
  context.browserConfig = browserConfig
}

function addCourseData(context, koppsData) {
  context.routeData = context.routeData ?? {}

  context.routeData.courseData = {
    courseCode: koppsData?.courseTitleData?.course_code,
    courseTitle: koppsData?.courseTitleData?.course_title,
    courseCredits: koppsData?.courseTitleData?.course_credits,
  }
}

function createEditCourseStartWebContext(args) {
  const context = {}
  addBaseData(context, args)
  addCourseData(context, args.koppsData)

  const courseCode = context.routeData.courseData.courseCode
  context.routeData.editOptions = {
    description: serverPaths.course.editDescription.uri.replace(':courseCode', courseCode),
    otherInformation: serverPaths.course.editOtherInformation.uri.replace(':courseCode', courseCode),
  }
  return context
}

function createOtherInformationWebContext(args) {
  const context = {}

  addBaseData(context, args)
  addCourseData(context, args.koppsData)

  const courseInfo = args.courseInfo
  context.routeData.values = {
    supplementaryInfoSv: courseInfo.supplementaryInfo?.sv ?? '',
    supplementaryInfoEn: courseInfo.supplementaryInfo?.en ?? '',
  }

  return context
}

function createDescriptionWebContext(args) {
  const context = {}

  addBaseData(context, args)
  addCourseData(context, args.koppsData)

  const courseInfo = args.courseInfo
  context.routeData.values = {
    sellingTextSv: courseInfo.sellingText?.sv ?? '',
    sellingTextEn: courseInfo.sellingText?.en ?? '',
    courseDispositionSv: courseInfo.courseDisposition?.sv ?? '',
    courseDispositionEn: courseInfo.courseDisposition?.en ?? '',
  }

  const [, { courseImage }] = i18n.messages
  const defaultImageName = courseImage[args.koppsData?.mainSubject] ?? courseImage.default
  const customImageName = courseInfo.imageInfo
  const hasCustomImage = !!customImageName

  context.routeData.defaultImage = {
    imageName: defaultImageName,
    url: `${browserConfig.storageUri}${defaultImageName}`,
  }

  context.routeData.imageFromApi = {
    hasCustomImage,
    imageName: customImageName,
    url: customImageName ? `${browserConfig.storageUri}${customImageName}` : undefined,
  }

  return context
}

module.exports = {
  createEditCourseStartWebContext,
  createOtherInformationWebContext,
  createDescriptionWebContext,
}
