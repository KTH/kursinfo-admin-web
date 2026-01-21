'use strict'

const log = require('@kth/log')
const language = require('@kth/kth-node-web-common/lib/language')

const { getLadokCourseData } = require('../apiCalls/ladokApi')
const { getCourseInfo, patchCourseInfo, postCourseInfo } = require('../apiCalls/kursInfoApi')

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

    const ladokData = await getLadokCourseData(courseCode, lang)
    const courseInfo = await getCourseInfo(courseCode)

    const context = createDescriptionWebContext({
      language: lang,
      userId: req.session.passport.user.kthId,
      ladokData,
      courseInfo,
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
    const courseInfo = await getCourseInfo(courseCode)

    const data = {
      sellingText: {
        sv: req.body.sellingTextSv,
        en: req.body.sellingTextEn,
      },
      courseDisposition: {
        sv: req.body.courseDispositionSv,
        en: req.body.courseDispositionEn,
      },
      imageInfo: req.body.imageName,
      lastChangedBy: req.session.passport.user.kthId,
    }

    if (courseInfo.notFound) {
      await postCourseInfo(courseCode, data)
    } else {
      await patchCourseInfo(courseCode, data)
    }

    return res.sendStatus(200)
  } catch (error) {
    log.error('Error in descriptionCtrl -> updateDescription', { error })
    return next(error)
  }
}

module.exports = {
  getDescription,
  updateDescription,
}
