'use strict'

const log = require('@kth/log')
const httpResponse = require('@kth/kth-node-response')
const { runBlobStorage } = require('../blobStorage.js')

// ------- FILES IN BLOB STORAGE: CREATE A NEW FILE OR REPLACE EXISTED ONE ------- /
async function saveImageToStorage(req, res, next) {
  const { body, files } = req
  log.info('files ', { files, body }) // + req.files.file

  const { courseCode } = req.params
  const { file } = files
  log.info('Saving uploaded file to storage ', { courseCode, file, body }) // + req.files.file

  try {
    const savedImageNameObj = await runBlobStorage(file, courseCode, body)
    log.debug(' Saving of uploaded finished ', { savedImageNameObj }) // + req.files.file

    return httpResponse.json(res, savedImageNameObj)
  } catch (error) {
    log.error('Exception from saveImageToStorage ', { error })
    next(error)
  }
}

module.exports = {
  saveImageToStorage,
}
