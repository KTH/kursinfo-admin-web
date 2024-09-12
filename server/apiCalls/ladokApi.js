'use strict'

const { createApiClient } = require('om-kursen-ladok-client')
const serverConfig = require('../configuration').server

async function getLadokCourseData(courseCode) {
  const client = createApiClient(serverConfig.ladokMellanlagerApi)
  const course = await client.getLatestCourseVersion(courseCode)
  return course
}

const filteredLadokData = async (courseCode, lang) => {
  const { apiError, huvudomraden, benamning, kod, omfattning, statusCode } = await getLadokCourseData(courseCode)
  return {
    apiError,
    mainSubject: lang == 'sv' ? huvudomraden[0].sv : huvudomraden[0].en,
    courseTitleData: {
      courseCode: kod,
      courseTitle: lang == 'sv' ? benamning.sv : benamning.en,
      courseCredits: omfattning,
    },
    statusCode,
  }
}

module.exports = {
  filteredLadokData,
  getLadokCourseData,
}
