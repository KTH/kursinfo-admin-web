'use strict'

function setBrowserConfig(config, paths, hostUrl) {
  this.browserConfig = config
  this.paths = paths
  this.apiHost = hostUrl
  this.hostUrl = hostUrl
  this.publicHostUrl = hostUrl.replace('//app', '//www')
}

function setUserRolesForThisCourse(roles = {}) {
  this.userRoles = roles
}

/**
 * Deprecated in favor for webContextUtil.js for most of the pages.
 */
function createServerSideContext() {
  const context = {
    koppsData: {},

    user: '',
    apiError: '',
    userRoles: {},

    // hosts
    apiHost: '',
    hostUrl: '',
    paths: [],
    publicHostUrl: '',

    // functions
    setUserRolesForThisCourse,
    setBrowserConfig,
  }

  return context
}

module.exports = { createServerSideContext }
