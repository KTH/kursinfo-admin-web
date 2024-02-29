'use strict'

const log = require('@kth/log')
const language = require('@kth/kth-node-web-common/lib/language')

const { filteredKoppsData } = require('../apiCalls/koppsApi.js')
const { renderCoursePage } = require('../utils/renderPageUtil')
const { createEditCourseStartWebContext } = require('../utils/webContextUtil.js')

function extractCourseCodeOrThrow(req) {
  const { courseCode } = req.params
  if (!courseCode) throw new Error('Missing parameter courseCode')
  return courseCode
}

async function getEditCourseStart(req, res, next) {
  try {
    const courseCode = extractCourseCodeOrThrow(req)
    const lang = language.getLanguage(res)

    const koppsData = await filteredKoppsData(courseCode, lang)

    const context = createEditCourseStartWebContext({
      language: lang,
      userId: req.session.passport.user.ugKthid,
      koppsData: koppsData,
    })

    renderCoursePage(req, res, context)
  } catch (error) {
    log.error('Error in editCourseStartCtrl -> getEditCourseStart', { error })
    next(error)
  }
}

module.exports = {
  getEditCourseStart,
}
