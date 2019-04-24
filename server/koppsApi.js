const { BasicAPI } = require('kth-node-api-call')
const serverConfig = require('./configuration').server

const koppsApi = new BasicAPI({
  hostname: serverConfig.kopps.host,
  basePath: serverConfig.kopps.basePath,
  https: serverConfig.kopps.https,
  json: true,
  defaultTimeout: serverConfig.kopps.defaultTimeout
})

const koppsCourseData = async (courseCode) => {
  try {
    const course = await koppsApi.getAsync({ uri: `course/${courseCode}`, useCache: true })
    return course.data
  } catch (err) {
    if (err.response) {
    }
    return {}
  }
}

module.exports = {koppsApi, koppsCourseData}
