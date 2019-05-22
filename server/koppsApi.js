const { BasicAPI } = require('kth-node-api-call')
const { server } = require('./configuration')
const log = require('kth-node-log')
const redis = require('kth-node-redis')

const koppsApi = new BasicAPI({
  hostname: server.kopps.host,
  basePath: server.kopps.basePath,
  https: server.kopps.https,
  json: true,
  defaultTimeout: server.kopps.defaultTimeout,
  redis: {
    client: redis,
    prefix: 'course-info-admin-kopps',
    expire: 20000
  }
})

const koppsCourseData = async (courseCode) => {
  try {
    const course = await koppsApi.getAsync({ uri: `course/${encodeURIComponent(courseCode)}`, useCache: true })
    return course.body
  } catch (err) {
    log.error('Exception calling from koppsAPI in koppsApi.koppsCourseData', { error: err })
    throw err
  }
}

module.exports = {koppsApi, koppsCourseData}
