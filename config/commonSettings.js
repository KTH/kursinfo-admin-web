/**
 *
 *     Common settings for server and browser
 *
 * **************************************************
 * * WARNING! Never access any secrets in this file *
 * **************************************************
 *
 */
const { getEnv, devDefaults } = require('kth-node-configuration')

const devPrefixPath = devDefaults('/node')

module.exports = {
  // The proxy prefix path if the application is proxied. E.g /places
  proxyPrefixPath: {
    uri: getEnv('SERVICE_PUBLISH', devPrefixPath)
  }
}
