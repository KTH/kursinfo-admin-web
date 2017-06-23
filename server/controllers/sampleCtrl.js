'use strict'

const api = require('../api')
const co = require('co')
const log = require('kth-node-log')
const { safeGet } = require('safe-utils')

module.exports = {
  getIndex: co.wrap(getIndex)
}

function * getIndex (req, res, next) {
  try {
    const client = api.nodeApi.client
    const paths = api.nodeApi.paths
    const resp = yield client.getAsync(client.resolve(paths.getDataById.uri, { id: '123' }), { useCache: true })

    res.render('sample/index', {
      debug: 'debug' in req.query,
      data: resp.statusCode === 200 ? safeGet(() => { return resp.body.name }) : '',
      error: resp.statusCode !== 200 ? safeGet(() => { return resp.body.message }) : ''
    })
  } catch (err) {
    log.error('Error in getIndex', { error: err })
    next(err)
  }
}
