'use strict'

const gulp = require('gulp')
const ckGulp = require('@kth/kth-ckeditor-build/gulpfile')

const ckEditorBuild = ckGulp.buildTask(
  gulp,
  './node_modules/@kth/kth-ckeditor-build',
  './dist/js/ckeditor',
  'kursinfo-admin-web'
)

gulp.task(
  'build',
  gulp.series([ckEditorBuild], done => {
    done()
  })
)
