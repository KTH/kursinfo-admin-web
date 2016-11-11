'use strict'

const api = require('../init/api')
const co = require('co')

console.log(api)

module.exports = {
  getIndex: co.wrap(getIndex)
}

function * getIndex (req, res, next) {
  try {
    const cachedApi = getCachedApi()
    const client = cachedApi.client
    const paths = cachedApi.paths
    const resp = yield client.getAsync(client.resolve(paths.getDataById.uri, { id: '123' }))

    res.render('sample/index', {
      debug: 'debug' in req.query,
      data: resp.statusCode === 200 ? resp.body.name : '',
      error: resp.statusCode !== 200 ? resp.body.message : ''
    })
  } catch (err) {
    next(err)
  }
}

/*
 * Get cache api, if not configured, use default api to avoid problems
 */
function getCachedApi() {
  if (api.sampleApiCached === undefined) {
    log.info('No cached api configured, using deafult api')
    return api.sampleApi
  }

  return api.sampleApiCached
}
