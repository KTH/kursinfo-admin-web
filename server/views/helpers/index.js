'use strict'
const registerHeaderContentHelper = require('kth-node-web-common/lib/handlebars/helpers/headerContent')
const config = require('../../configuration').server
const packageFile = require('../../../package.json')
const log = require('kth-node-log')

let version = packageFile.version

try {
  const buildVersion = require('../../../config/version')
  version = version + '-' + buildVersion.jenkinsBuild
} catch (err) {
  log.error(err.message)
}

/*
  Register standard helpers:

    - withVersion
    - extend
    - prefixScript
    - prefixStyle
    - render

*/
registerHeaderContentHelper({
  proxyPrefixPath: config.proxyPrefixPath.uri,
  version: version
})

/**
 * Add any application specific helpers here, you can find some
 * packaged helpers in https://github.com/KTH/kth-node-web-common/tree/master/lib/handlebars/helpers
 * Those only need to be required. Docs embedded in source.
 */
require('kth-node-web-common/lib/handlebars/helpers/breadcrumbs')(config.hostUrl, 'host_name', '/node', 'site_name')
require('kth-node-web-common/lib/handlebars/helpers/contentedit')

const i18n = require('../../../i18n')
require('kth-node-web-common/lib/handlebars/helpers/createI18nHelper')(i18n)
require('kth-node-web-common/lib/handlebars/helpers/safe')
