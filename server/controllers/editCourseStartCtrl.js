'use strict'

const log = require('@kth/log')
const language = require('@kth/kth-node-web-common/lib/language')

const i18n = require('../../i18n')
const { getLangIndex } = require('../utils/langUtil')
const { HttpError } = require('../HttpError')
const { filteredKoppsData } = require('../apiCalls/koppsApi')
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
    const langIndex = getLangIndex(lang)
    const koppsData = await filteredKoppsData(courseCode, lang)

    if (koppsData.apiError && koppsData.statusCode === 404) {
      throw new HttpError(404, i18n.messages[langIndex].messages.error_not_found)
    }

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
