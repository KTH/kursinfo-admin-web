'use strict'

const log = require('@kth/log')

// This function to see which groups user is in
async function myCourses(req, res, next) {
  // TODO: KARL: Fråga Nina.
  try {
    const user = req.session.passport.user.memberOf
    res.render('course/my_course', {
      debug: 'debug' in req.query,
      html: user,
      courseCode: req.params.courseCode,
    })
  } catch (err) {
    log.error('Error in myCourses', { error: err })
    next(err)
  }
}

module.exports = {
  myCourses,
}
