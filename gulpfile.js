'use strict'
const gulp = require('gulp')
const mergeStream = require('merge-stream')

const { webpack, moveResources, sass, vendor } = require('kth-node-build-commons').tasks

/**
 * Usage:
 *
 *  One-time build of browser dependencies for development
 *
 *    $ gulp build:dev
 *
 *  Continuous re-build during development
 *
 *    $ gulp watch
 *
 *  One-time build for Deployment (Gulp tasks will check NODE_ENV if no option is passed)
 *
 *    $ gulp build [--production | --reference]
 *
 */

const globals = {
  dirname: __dirname
}

// Deployment helper tasks
gulp.task('webpackDeploy', function () {
  // Returning merged stream so Gulp knows when async operations have finished
  return mergeStream(
    webpack(globals, 'reference')(),
    webpack(globals, 'production')()
  )
})

gulp.task('vendorDeploy', function () {
  // Returning merged stream so Gulp knows when async operations have finished
  return mergeStream(
    vendor('reference')(),
    vendor('production')()
  )
})

// Development helper tasks
gulp.task('webpack', webpack(globals))
gulp.task('vendor', vendor())

gulp.task('cleanKthStyle', moveResources.cleanKthStyle)
gulp.task('moveResources', ['cleanKthStyle'], function () {
  // This task is synchronous and cshould be completed first
  moveResources.cleanKthStyle()

  // Returning merged stream so Gulp knows when async operations have finished
  return mergeStream(
    moveResources.moveKthStyle(),
    moveResources.moveBootstrap(),
    moveResources.moveFontAwesome()
  )
})

gulp.task('build:dev', ['moveResources', 'vendor', 'webpack'], function () {
  // Transpile SASS-files
  return sass()
})

gulp.task('build', ['moveResources', 'vendorDeploy', 'webpackDeploy'], function () {
  // Transpile SASS-files
  return sass()
})

gulp.task('watch', ['build:dev'], function () {
  gulp.watch(['./public/js/app/**/*.js', './public/js/components/**/*'], ['webpack'])
  gulp.watch(['./public/js/vendor.js'], ['vendor'])
  gulp.watch(['./public/css/**/*.scss'], ['transpileSass'])
})
