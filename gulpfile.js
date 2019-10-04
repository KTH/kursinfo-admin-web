'use strict'
const gulp = require('gulp')
const mergeStream = require('merge-stream')
const ckGulp = require('@kth/kth-ckeditor-build/gulpfile')

const globals = {
  dirname: __dirname
}

const { moveResources, sass, vendor, clean } = require('kth-node-build-commons').tasks(globals)
const { moveHandlebarPages } = require('kth-node-web-common/gulp')

/**
 * Usage:
 *
 *  One-time build of browser dependencies for development
 *
 *    $ gulp build:dev [--production | --development]
 *
 *  Deployment build
 *
 *    $ gulp build
 *
 *  Continuous re-build during development
 *
 *    $ gulp watch
 *
 *  Remove the generated files
 *
 *    $ gulp clean
 *
 */

// *** JavaScript helper tasks ***
const ckEditorBuild = ckGulp.buildTask(gulp, './node_modules/@kth/kth-ckeditor-build', './dist/js/ckeditor')

gulp.task('vendor', function () {
  ckEditorBuild()
  vendor()
})

gulp.task('moveHandlebarPages', moveHandlebarPages)

gulp.task('moveResources', ['moveHandlebarPages'], function () {
  return mergeStream(
    moveResources.moveKthStyle(),
    moveResources.moveBootstrap(),
  )
})

gulp.task('moveImages', function () {
  // Move project image files
  return gulp.src('./public/img/**/*')
    .pipe(gulp.dest('dist/img'))
})

gulp.task('transpileSass', () => sass())

/**
 *
 *  Public tasks used by developer:
 *
 */

gulp.task('clean', clean)

gulp.task('build', ['moveResources', 'moveImages', 'vendor'], () => sass())

gulp.task('watch', ['build'], function () {
  gulp.watch(['./public/js/app/**/*.jsx', './public/js/app/**/*.js'])
  gulp.watch(['./public/img/**/*.*'], ['moveImages'])
  gulp.watch(['./public/js/vendor.js'], ['vendor'])
  gulp.watch(['./public/css/**/*.scss'], ['transpileSass'])
})
