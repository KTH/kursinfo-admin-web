'use strict'

const log = require('@kth/log')
const language = require('@kth/kth-node-web-common/lib/language')

const i18n = require('../../i18n')
const { getLangIndex } = require('../utils/langUtil')
const { HttpError } = require('../HttpError')
const { filteredKoppsData } = require('../apiCalls/koppsApi')
const { getCourseInfo, patchCourseInfo } = require('../apiCalls/kursInfoApi')

const { renderCoursePage } = require('../utils/renderPageUtil')
const { createOtherInformationWebContext } = require('../utils/webContextUtil')

function extractCourseCodeOrThrow(req) {
  const { courseCode } = req.params
  if (!courseCode) throw new Error('Missing parameter courseCode')
  return courseCode
}

async function getOtherInformation(req, res, next) {
  try {
    const courseCode = extractCourseCodeOrThrow(req)
    const lang = language.getLanguage(res)
    const langIndex = getLangIndex(lang)

    const koppsData = await filteredKoppsData(courseCode, lang)
    if (koppsData.apiError && koppsData.statusCode === 404) {
      throw new HttpError(404, i18n.messages[langIndex].messages.error_not_found)
    }

    const courseInfo = await getCourseInfo(courseCode)

    const context = createOtherInformationWebContext({
      language: lang,
      userId: req.session.passport.user.ugKthid,
      koppsData: koppsData,
      courseInfo: courseInfo,
    })

    renderCoursePage(req, res, context)
  } catch (error) {
    log.error('Error in otherInformationCtrl -> getOtherInformation', { error })
    next(error)
  }
}

async function updateOtherInformation(req, res, next) {
  try {
    const courseCode = extractCourseCodeOrThrow(req)
    await patchCourseInfo(courseCode, {
      supplementaryInfo: {
        sv: req.body.supplementaryInfoSv,
        en: req.body.supplementaryInfoEn,
      },
    })
    return res.sendStatus(200)
  } catch (error) {
    log.error('Error in otherInformationCtrl -> updateOtherInformation', { error })
    next(error)
  }
}

module.exports = {
  getOtherInformation,
  updateOtherInformation,
}
