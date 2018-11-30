'use strict'
const gulp = require('gulp')
const mergeStream = require('merge-stream')
const ckGulp = require('@kth/kth-ckeditor-build/gulpfile')

const globals = {
  dirname: __dirname
}

const { moveResources, sass, vendor, clean } = require('kth-node-build-commons').tasks(globals)

/* Inferno build tasks */

const infernoTask = require('kth-node-inferno/gulpTasks/infernoTask')({
  src: [
    'public/js/app/app.jsx',
    //'public/js/app/embed.jsx'
  ],
  destinationPath: 'dist/js',
  exclude: /node_modules\/(?!(safe-utils)\/).*/,
  dirname: __dirname
})

const infernoServerTask = require('kth-node-inferno/gulpTasks/infernoServerTask')({
  src: [
    'public/js/app/app.jsx',
    'public/js/app/embed.jsx'
  ],
  destinationPath: 'dist/js/server',
  dirname: __dirname
})

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
  ckEditorBuild(),
  vendor()
})

///gulp.task('vendor', vendor)

gulp.task('moveResources', function () {
  return mergeStream(
    moveResources.moveKthStyle(),
    moveResources.moveBootstrap(),
    moveResources.moveFontAwesome()
  )
})

gulp.task('moveImages', function () {
  // Move project image files
  return gulp.src('./public/img/**/*')
    .pipe(gulp.dest('dist/img'))
})

gulp.task('transpileSass', () => sass())

gulp.task('inferno', function () {
  return mergeStream(
    infernoTask(),
    infernoServerTask()
  )
})

/**
 *
 *  Public tasks used by developer:
 *
 */

gulp.task('clean', clean)

gulp.task('build', ['moveResources', 'moveImages', 'vendor', 'inferno'], () => sass())

gulp.task('watch', ['build'], function () {
  gulp.watch(['./public/js/app/**/*.jsx', './public/js/app/**/*.js'], ['inferno'])
  gulp.watch(['./public/img/**/*.*'], ['moveImages'])
  gulp.watch(['./public/js/vendor.js'], ['vendor'])
  gulp.watch(['./public/css/**/*.scss'], ['transpileSass'])
})
