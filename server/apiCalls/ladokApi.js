'use strict'

const i18n = require('../../i18n')
const { createApiClient } = require('@kth/om-kursen-ladok-client')
const { HttpError } = require('../HttpError')
const serverConfig = require('../configuration').server

const HTTP_CODE_400 = 400

async function getLadokCourseData(courseCode, lang) {
  const client = createApiClient(serverConfig.ladokMellanlagerApi)
  const course = await client.getLatestCourseVersion(courseCode, lang)
  const { apiError, huvudomraden, benamning, kod, schoolCode, omfattning, statusCode } = course

  if (statusCode >= HTTP_CODE_400 || apiError) {
    const errorMessage =
      statusCode === 404 ? i18n.message('error_not_found', lang) : i18n.message('error_generic', lang)
    throw new HttpError(statusCode, errorMessage)
  }

  return {
    apiError,
    mainSubject: huvudomraden?.[0].name,
    courseTitleData: {
      courseCode: kod,
      courseTitle: benamning.name,
      courseCredits: omfattning.formattedWithUnit,
      schoolCode,
    },
    statusCode,
  }
}

async function getCourseSchoolCode(courseCode) {
  try {
    const ladokCourseData = await getLadokCourseData(courseCode)
    if (!ladokCourseData || ladokCourseData.statusCode !== 200) return 'ladok_get_fails'
    const { schoolCode } = ladokCourseData.courseTitleData
    if (!schoolCode) return 'missing_school_code'
    return schoolCode
  } catch (err) {
    return err
  }
}

module.exports = {
  getLadokCourseData,
  getCourseSchoolCode,
}
