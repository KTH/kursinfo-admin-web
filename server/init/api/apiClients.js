'use strict'

const log = require('kth-node-log')
const BasicAPI = require('kth-node-api-call').BasicAPI
const config = require('../configuration').full

/*
 * If configured to use nodeApi, i.e. api supporting KTH api standard and exposes a /_paths url
 * where the public URL is published.
 * Will download api specification from api and expose its methods internally under "/api" as paths objects
 */

function _createClients () {
  return Object.keys(config.nodeApi).map((key) => {
    const api = config.nodeApi[ key ]
    const opts = {
      hostname: api.host,
      port: api.port,
      https: api.https,
      headers: {
        'api_key': config.secure.apiKey[ key ]
      },
      json: true
    }
    return {
      key: key,
      config: api,
      client: new BasicAPI(opts)
    }
  })
}

function _getPaths (endpoints) {
  const paths = '/_paths'
  const tasks = endpoints.map((api) => {
    const uri = `${api.config.proxyBasePath}${paths}`
    return api.client.getAsync(uri)
      .then((data) => {
        if (data.statusCode === 200) {
          api.paths = data.body.api
          return api
        }

        throw new Error('Bad response for ' + api.key + ' when getting paths: ' + data.statusCode)
      })
  })
  return Promise.all(tasks)
}

function _export () {
  const endpoints = _createClients()
  const output = {}

  _getPaths(endpoints)
    .then((results) => {
      results.forEach((endpoint) => {
        output[ endpoint.key ] = endpoint
        log.info(`API configured: ${endpoint.key}`)
      })
    })
    .catch((err) => {
      log.error({ err: err }, 'Failed to get API paths.')
    })

  return output
}

module.exports = _export()
