'use strict'

const log = require('kth-node-log')
const BasicAPI = require('kth-node-api-call').BasicAPI
const config = require('../configuration').full
const redis = require('kth-node-redis')

/*
 * Check if there is a cache configured for this api
 */
function isRedisConfigured (apiName) {
    if (config.cache && config.cache[ apiName ]) {
      return true
    }

    return false
}

/*
 * Check if there is a cache configured for this api
 */
function _getRedisCacheConfig (apiName) {
    if (config.cache && config.cache[ apiName ]) {
      return config.cache[ apiName ]
    }

    return undefined
}

/*
 * If configured to use nodeApi, i.e. api supporting KTH api standard and exposes a /_paths url
 * where the public URL is published.
 * Will download api specification from api and expose its methods internally under "/api" as paths objects
 */

function _getRedisClient (apiName) {
  try {
    if (isRedisConfigured(apiName)) {
      const cacheConfig = _getRedisCacheConfig (apiName)
      return redis(apiName, cacheConfig.redis)
    }
  } catch (err) {
    log.error('Error creating Redis client', err)
  }

  return Promise.reject(false)
}


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

function configureApiCache (clients) {
  Object.keys(clients).map(apiName => {
    const client = clients[ apiName ]
    if (isRedisConfigured(apiName)) {
      _getRedisClient(apiName)
      .then(redisClient => {
        clients[ apiName ].client._hasRedis = true
        clients[ apiName ].client._redis = {
          prefix: apiName,
          client: redisClient,
          expire: _getRedisCacheConfig(apiName).expireTime
        }
      })
      .catch(err => {
        log.error('Unable to create redisClient')
        clients[ apiName ].client._hasRedis = false
      })
      log.debug(`API configured to use redis cache: ${apiName}`)

    }
  })

  return clients
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

      return output
    })
    .then(clients => {
      return configureApiCache(clients)
    })
    .catch((err) => {
      log.error({ err: err }, 'Failed to get API paths.')
    })

  return output
}

module.exports = _export()
