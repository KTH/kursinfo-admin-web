/*
 * This file will be overwritten in the build process on Jenkins.
 * See https://gita.sys.kth.se/Infosys/zermatt/blob/master/jenkins/buildinfo-to-node-module.sh
 */

module.exports = {
  gitBranch: 'NOT SET BY JENKINS',
  gitCommit: 'NOT SET BY JENKINS',
  jenkinsBuild: process.env.BUILD_ID,
  jenkinsBuildDate: 'NOT SET BY JENKINS',
  dockerName: 'NOT SET BY JENKINS',
  dockerVersion: process.env.BUILD_ID
}
