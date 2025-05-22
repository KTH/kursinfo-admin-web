'use strict'

const { createApiClient } = require('@kth/om-kursen-ladok-client')
const serverConfig = require('../configuration').server

async function getLadokCourseData(courseCode, lang) {
  const client = createApiClient(serverConfig.ladokMellanlagerApi)
  const course = await client.getLatestCourseVersion(courseCode, lang)
  const { apiError, huvudomraden, benamning, kod, schoolCode, omfattning, statusCode } = course

  return {
    apiError,
    mainSubject: huvudomraden[0].name,
    courseTitleData: {
      courseCode: kod,
      courseTitle: benamning,
      courseCredits: omfattning,
      schoolCode,
    },
    statusCode,
  }
}

async function getCourseSchoolCode(courseCode) {
  try {
    const { schoolCode } = await getLadokCourseData(courseCode)
    return schoolCode
  } catch (err) {
    return err
  }
}

module.exports = {
  getLadokCourseData,
  getCourseSchoolCode,
}
