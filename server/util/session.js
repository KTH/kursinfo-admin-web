const log = require('kth-node-log')
const config = require('../init/configuration').server

module.exports = {
  SetLdapUser: function (req, ldapResponse, pgtIou) {
    if (ldapResponse) {
      log.debug('ldapResponse.ugUsername: ' + ldapResponse.ugUsername)
      var groups = ldapResponse.memberOf
      var isAdmin = false

      if (typeof groups === 'string') {
        groups = [ ldapResponse.memberOf ]
      }

      if (groups && groups.length > 0) {
        for (var i = 0; i < groups.length; i++) {
          if (config.auth.adminGroup && groups[ i ].indexOf(config.auth.adminGroup) >= 0) {
            isAdmin = true
            break
          }
        }
      }

      req.session.ldapUserName = ldapResponse.ugUsername
      req.session.ldapDisplayName = ldapResponse.displayName
      req.session.ldapEmail = ldapResponse.mail
      req.session.isAdmin = isAdmin
      req.session.pgtIou = pgtIou
    }
  },

  GetLdapUser: function (req) {
    return {
      name: req.session.ldapDisplayName || '',
      username: req.session.ldapUserName || '',
      email: req.session.ldapEmail || '',
      isAdmin: req.session.isAdmin || false
    }
  }
}
