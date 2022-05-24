'use strict'

const log = require('@kth/log')

const registerHeaderContentHelper = require('@kth/kth-node-web-common/lib/handlebars/helpers/headerContent')
const config = require('../../configuration').server
const packageFile = require('../../../package.json')

let { version } = packageFile

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
  version,
})

/**
 * Add any application specific helpers here, you can find some
 * packaged helpers in https://github.com/KTH/kth-node-web-common/tree/master/lib/handlebars/helpers
 * Those only need to be required. Docs embedded in source.
 */
require('@kth/kth-node-web-common/lib/handlebars/helpers/breadcrumbs')(
  config.hostUrl,
  'host_name',
  '/node',
  'site_name'
)
require('@kth/kth-node-web-common/lib/handlebars/helpers/contentedit')

const i18n = require('../../../i18n')
require('@kth/kth-node-web-common/lib/handlebars/helpers/createI18nHelper')(i18n)
require('@kth/kth-node-web-common/lib/handlebars/helpers/safe')
