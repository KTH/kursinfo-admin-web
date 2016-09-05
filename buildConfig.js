const paths = require('./server/init/routing/paths')
const buildConfig = require('kth-node-build-commons/buildConfig')
buildConfig.setPaths(paths)
buildConfig.createFile()
