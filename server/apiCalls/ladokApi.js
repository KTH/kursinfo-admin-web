'use strict'

const { createApiClient } = require('om-kursen-ladok-client')
const serverConfig = require('../configuration').server

async function getLadokCourseData(courseCode, lang) {
  const client = createApiClient(serverConfig.ladokMellanlagerApi)
  const course = await client.getLatestCourseVersion(courseCode, lang)
  const { apiError, huvudomraden, benamning, kod, schoolCode, omfattning, statusCode } = course

  const mainSubjectsArray = huvudomraden.map(subject => subject.name)
  const mainSubjects = mainSubjectsArray.join()

  return {
    apiError,
    mainSubjects,
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
