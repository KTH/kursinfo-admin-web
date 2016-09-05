/**
 * This configuration file is shared among all other configurations.
 * Its keys and values can be overridden in environment specific configuration files.
 */

module.exports = {
  auth: {
    adminGroup: 'app.APPNAME.admin'
  },
  ldapClient: {
    version: 3,
    searchlimit: 10,
    searchtimeout: 10, // seconds
    connecttimeout: 3000, // millis - 3 sec
    timeout: 3000, // millis - 3 sec
    maxconnections: 10, //
    checkinterval: 10000, // millis - 10 sec
    maxidletime: 300000, // millis - 5 min
    scope: 'sub',
    filterReplaceHolder: 'KTHID',
    userattrs: [ 'displayName', 'mail', 'ugUsername', 'memberOf' ],
    groupattrs: [ 'cn', 'objectCategory' ]
  },
  // The proxy prefix path if the application is proxied. E.g /places
  proxyPrefixPath: {
    uri: '/node'
  }
}
