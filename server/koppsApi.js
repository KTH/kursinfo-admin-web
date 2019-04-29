const { BasicAPI } = require('kth-node-api-call')
const { server } = require('./configuration')
const log = require('kth-node-log')

const koppsApi = new BasicAPI({
  hostname: server.kopps.host,
  basePath: server.kopps.basePath,
  https: server.kopps.https,
  json: true,
  defaultTimeout: server.kopps.defaultTimeout
})

const koppsCourseData = async (courseCode) => {
  try {
    const course = await koppsApi.getAsync({ uri: `course/${encodeURIComponent(courseCode)}`, useCache: true })
    console.log('coursekokdsfadssdsd', course.body)
    return course.body
  } catch (err) {
    log.error('Exception calling from koppsAPI in koppsApi.koppsCourseData', { error: err })
    throw err
  }
}

module.exports = {koppsApi, koppsCourseData}
