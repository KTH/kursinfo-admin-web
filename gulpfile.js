'use strict'
const gulp = require('gulp')
const mergeStream = require('merge-stream')

const globals = {
  dirname: __dirname
}

const { webpack, moveResources, sass, vendor, clean } = require('kth-node-build-commons').tasks(globals)



/* Put any addintional helper tasks here */
const infernoTask = require('kth-node-inferno/gulpTasks/infernoTask')({
  src: [
    'public/js/app/app.jsx',
    'public/js/app/pages/CoursePage.jsx'

  ],
  destinationPath: 'dist/js',
  dirname: __dirname
})

const infernoServerTask = require('kth-node-inferno/gulpTasks/infernoServerTask')({
  src: [
    'public/js/app/app.jsx',
    'public/js/app/pages/CoursePage.jsx'
  ],
  destinationPath: 'dist/js/server',
  dirname: __dirname
})

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
 *  Remove the generated files
 *
 *    $ gulp clean
 *
 **/

// *** JavaScript helper tasks ***
gulp.task('webpack', webpack)
gulp.task('vendor', vendor)

gulp.task('moveResources', function () {
  // Returning merged streams at the end so Gulp knows when async operations have finished
  moveResources.cleanKthStyle()

  return mergeStream(
    moveResources.moveKthStyle(),
    moveResources.moveBootstrap(),
    moveResources.moveFontAwesome(),
    // Move project image files
    gulp.src('./public/img/*')
      .pipe(gulp.dest('dist/img'))
  )
})

gulp.task('transpileSass', () => sass())

/* Put any addintional helper tasks here */

/**
 *
 *  Public tasks used by developer:
 *
 */
gulp.task('inferno', function () {
  return mergeStream(
    infernoTask(),
    infernoServerTask()
  )
})

gulp.task('clean', clean)

gulp.task('build', ['moveResources', 'vendor', 'webpack'], () => sass())

gulp.task('watch', ['build'], function () {
  gulp.watch(['./public/js/app/**/*.js', './public/js/components/**/*'], ['webpack'])
  gulp.watch(['./public/js/vendor.js'], ['vendor'])
  gulp.watch(['./public/css/**/*.scss'], ['transpileSass'])
  gulp.watch(['./public/js/app/**/*.jsx', './public/js/app/**/*.js'], ['inferno'])
})
