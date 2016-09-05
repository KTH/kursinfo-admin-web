const gulp = require('gulp')
const commonsGulp = require('kth-node-build-commons/gulpfile')

commonsGulp.setDirname(__dirname)
commonsGulp.setStartpath('/node')

gulp.tasks = commonsGulp.gulp.tasks

/*
 * Place project specific tasks below
 */
