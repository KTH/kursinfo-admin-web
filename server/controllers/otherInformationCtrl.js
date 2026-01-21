'use strict'

const log = require('@kth/log')
const language = require('@kth/kth-node-web-common/lib/language')

const { getLadokCourseData } = require('../apiCalls/ladokApi')
const { getCourseInfo, patchCourseInfo, postCourseInfo } = require('../apiCalls/kursInfoApi')

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

    const ladokData = await getLadokCourseData(courseCode, lang)
    const courseInfo = await getCourseInfo(courseCode)

    const context = createOtherInformationWebContext({
      language: lang,
      userId: req.session.passport.user.kthId,
      ladokData,
      courseInfo,
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
    const courseInfo = await getCourseInfo(courseCode)

    const data = {
      supplementaryInfo: {
        sv: req.body.supplementaryInfoSv,
        en: req.body.supplementaryInfoEn,
      },
      lastChangedBy: req.session.passport.user.kthId,
    }

    if (courseInfo.notFound) {
      await postCourseInfo(courseCode, data)
    } else {
      await patchCourseInfo(courseCode, data)
    }

    return res.sendStatus(200)
  } catch (error) {
    log.error('Error in otherInformationCtrl -> updateOtherInformation', { error })
    return next(error)
  }
}

module.exports = {
  getOtherInformation,
  updateOtherInformation,
}
