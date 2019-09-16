
const {
  Aborter,
  BlockBlobURL,
  ContainerURL,
  ServiceURL,
  SharedKeyCredential,
  StorageURL,
  BlobURL
} = require('@azure/storage-blob')

const serverConfig = require('./configuration').server
const log = require('kth-node-log')
const sharp = require('sharp')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

module.exports = {
  runBlobStorage: runBlobStorage
}

const STORAGE_ACCOUNT_NAME = serverConfig.fileStorage.kursinfoStorage.account
const ACCOUNT_ACCESS_KEY = serverConfig.fileStorage.kursinfoStorage.accountKey

const ONE_MEGABYTE = 1024 * 1024
const FOUR_MEGABYTES = 4 * ONE_MEGABYTE
const ONE_MINUTE = 60 * 1000

const credentials = new SharedKeyCredential(STORAGE_ACCOUNT_NAME, ACCOUNT_ACCESS_KEY)
const pipeline = StorageURL.newPipeline(credentials)
const serviceURL = new ServiceURL(`https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`, pipeline)

async function runBlobStorage (file, courseCode, metadata) {
  log.info('runBlobStorage: ', file, ', courseCode: ', courseCode, ', metadata: ', metadata)
  const containerName = 'kursinfo-image-container'
  const imageName = `Picture_by_own_choice_${courseCode}.${metadata.fileExtension}`
  const content = await sharp(file.data).resize(400, 300).toBuffer()
  const fileType = file.mimetype
  const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName)
  const aborter = Aborter.timeout(30 * ONE_MINUTE)

  const uploadResponse = await _uploadBlob(aborter, containerURL, imageName, content, fileType, metadata)
  log.debug(' Blobstorage - uploaded file response ', uploadResponse)

  return imageName
}

async function _uploadBlob (aborter, containerURL, blobName, content, fileType, metadata = {}) {
  const blobURL = BlobURL.fromContainerURL(containerURL, blobName)
  const blockBlobURL = BlockBlobURL.fromBlobURL(blobURL)
  try {
    const uploadBlobResponse = await blockBlobURL.upload(
      aborter.none,
      content,
      content.length
    )
    log.debug(`Blobstorage - Upload block blob ${blobName} `)

    await blockBlobURL.setHTTPHeaders(aborter, { blobContentType: fileType })
    metadata['date'] = getTodayDate(false)
    await blockBlobURL.setMetadata(
      aborter,
      metadata
    )
    log.info('uploadBlobResponse', uploadBlobResponse)
    return uploadBlobResponse
  } catch (error) {
    log.error('Error when uploading file in blobStorage: ' + blobName, { error: error })
    return error
  }
}

const getTodayDate = (fileDate = true) => {
  let today = new Date()
  let dd = String(today.getDate()).padStart(2, '0')
  let mm = String(today.getMonth() + 1).padStart(2, '0') // January is 0!
  let yyyy = today.getFullYear()
  let hh = today.getHours()
  let min = today.getMinutes()

  return fileDate ? yyyy + mm + dd + '-' + hh + '-' + min : yyyy + mm + dd + '-' + hh + ':' + min
}
