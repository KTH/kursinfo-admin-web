'use strict'

const log = require('@kth/log')
const language = require('@kth/kth-node-web-common/lib/language')

const i18n = require('../../i18n')
const { getLangIndex } = require('../utils/langUtil')
const { HttpError } = require('../HttpError')
const { filteredKoppsData } = require('../apiCalls/koppsApi')
const { getCourseInfo, patchCourseInfo } = require('../apiCalls/kursInfoApi')

const { createDescriptionWebContext } = require('../utils/webContextUtil')
const { renderCoursePage } = require('../utils/renderPageUtil')

function extractCourseCodeOrThrow(req) {
  const { courseCode } = req.params
  if (!courseCode) throw new Error('Missing parameter courseCode')
  return courseCode
}

async function getDescription(req, res, next) {
  try {
    const courseCode = extractCourseCodeOrThrow(req)
    const lang = language.getLanguage(res)
    const langIndex = getLangIndex(lang)

    const koppsData = await filteredKoppsData(courseCode, lang)
    if (koppsData.apiError && koppsData.statusCode === 404) {
      throw new HttpError(404, i18n.messages[langIndex].messages.error_not_found)
    }
    const courseInfo = await getCourseInfo(courseCode)

    const context = createDescriptionWebContext({
      language: lang,
      userId: req.session.passport.user.ugKthid,
      koppsData: koppsData,
      courseInfo: courseInfo,
    })

    renderCoursePage(req, res, context)
  } catch (error) {
    log.error('Error in descriptionCtrl -> getDescription', { error })
    next(error)
  }
}

async function updateDescription(req, res, next) {
  try {
    const courseCode = extractCourseCodeOrThrow(req)
    await patchCourseInfo(courseCode, {
      sellingText: {
        sv: req.body.sellingTextSv,
        en: req.body.sellingTextEn,
      },
      courseDisposition: {
        sv: req.body.courseDispositionSv,
        en: req.body.courseDispositionEn,
      },
      imageInfo: req.body.imageName,
    })
    return res.sendStatus(200)
  } catch (error) {
    log.error('Error in descriptionCtrl -> updateDescription', { error })
    next(error)
  }
}

module.exports = {
  getDescription,
  updateDescription,
}
