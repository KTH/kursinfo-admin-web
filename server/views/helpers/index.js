const headerContent = require('kth-node-web-common/lib/handlebars/headerContent')
const config = require('../../init/configuration').server

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
headerContent({
  proxyPrefixPath: config.proxyPrefixPath.uri,
  version: version
})

/**
 * Add any application specific helpers here, you can find some
 * packaged helpers in https://github.com/KTH/kth-node-web-common/tree/master/lib/handlebars/helpers
 * Those only need to be required. Docs embedded in source.
 */