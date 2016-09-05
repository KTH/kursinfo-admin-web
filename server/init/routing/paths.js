'use strict'

const routing = require('./routing')

/**
 * Lists all paths (routes) with corresponding parameter(s) and method.
 * TIP: If you are getting a 500 response and the page keeps loading, check
 * the ordering of the routes in the affected files (routes/* and this).
 */

module.exports = {
  cas: {
    login: {
      uri: routing.prefix('/login'),
      method: 'GET'
    },

    gateway: {
      uri: routing.prefix('/loginGateway'),
      method: 'GET'
    },

    pgtCallback: {
      uri: routing.prefix('/pgtCallback'),
      method: 'GET'
    },

    logout: {
      uri: routing.prefix('/logout'),
      method: 'GET'
    }
  },

  system: {
    index: {
      uri: routing.prefix('/'),
      method: 'GET'
    },

    monitor: {
      uri: routing.prefix('/_monitor'),
      method: 'GET',
      cas: false
    },

    about: {
      uri: routing.prefix('/_about'),
      method: 'GET'
    },

    robots: {
      uri: '/robots.txt',
      method: 'GET'
    },

    paths: {
      uri: routing.prefix('/_paths'),
      method: 'GET'
    }
  }
}
