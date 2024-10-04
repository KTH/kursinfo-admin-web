'use strict'

const log = require('@kth/log')
const language = require('@kth/kth-node-web-common/lib/language')

const i18n = require('../../i18n')
const { getLangIndex } = require('../utils/langUtil')
const { HttpError } = require('../HttpError')
const { filteredKoppsData } = require('../apiCalls/koppsApi')
const { getCourseInfo, patchCourseInfo, postCourseInfo } = require('../apiCalls/kursInfoApi')

const { renderCoursePage } = require('../utils/renderPageUtil')
const { createRecommendedPrerequisitesWebContext } = require('../utils/webContextUtil')

function extractCourseCodeOrThrow(req) {
  const { courseCode } = req.params
  if (!courseCode) throw new Error('Missing parameter courseCode')
  return courseCode
}

async function getRecommendedPrerequisites(req, res, next) {
  try {
    const courseCode = extractCourseCodeOrThrow(req)
    const lang = language.getLanguage(res)
    const langIndex = getLangIndex(lang)

    const koppsData = await filteredKoppsData(courseCode, lang)
    if (koppsData.apiError && koppsData.statusCode === 404) {
      throw new HttpError(404, i18n.messages[langIndex].messages.error_not_found)
    }

    const courseInfo = await getCourseInfo(courseCode)
    const context = createRecommendedPrerequisitesWebContext({
      language: lang,
      userId: req.session.passport.user.ugKthid,
      koppsData,
      courseInfo,
    })

    renderCoursePage(req, res, context)
  } catch (error) {
    log.error('Error in recommendedPrerequisitesCtrl -> getRecommendedPrerequisites', { error })
    next(error)
  }
}

async function updateRecommendedPrerequisites(req, res, next) {
  try {
    const courseCode = extractCourseCodeOrThrow(req)
    const courseInfo = await getCourseInfo(courseCode)

    const data = {
      recommendedPrerequisites: {
        sv: req.body.recommendedPrerequisitesSv,
        en: req.body.recommendedPrerequisitesEn,
      },
      lastChangedBy: req.session.passport.user.ugKthid,
    }

    if (courseInfo.notFound) {
      await postCourseInfo(courseCode, data)
    } else {
      await patchCourseInfo(courseCode, data)
    }

    return res.sendStatus(200)
  } catch (error) {
    log.error('Error in recommendedPrerequisitesCtrl -> updateRecommendedPrerequisites', { error })
    return next(error)
  }
}

module.exports = {
  getRecommendedPrerequisites,
  updateRecommendedPrerequisites,
}
