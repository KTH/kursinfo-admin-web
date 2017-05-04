const ldap = require('kth-node-ldap')
const config = require('./configuration').server
// ldap client is used to find users and need to be exposed
module.exports = ldap.createClient({
  url: config.ldap.uri,
  timeout: config.ldap.timeout,
  connectTimeout: config.ldap.connecttimeout,
  maxConnections: config.ldap.maxconnections,
  bindDN: config.ldap.username,
  bindCredentials: config.ldap.password,
  checkInterval: config.ldap.checkinterval,
  maxIdleTime: config.ldap.maxidletime,
  reconnect: true
})
