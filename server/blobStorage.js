const { BlobServiceClient } = require('@azure/storage-blob')

const log = require('kth-node-log')
const sharp = require('sharp')

const { server: serverConfig } = require('./configuration')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const { containerName: STORAGE_CONTAINER_NAME, blobServiceSasUrl: BLOB_SERVICE_SAS_URL } =
  serverConfig.fileStorage.kursinfoStorage

const blobServiceClient = new BlobServiceClient(BLOB_SERVICE_SAS_URL)

const getTodayDate = (fileDate = true) => {
  const today = new Date()
  const dd = String(today.getDate()).padStart(2, '0')
  const mm = String(today.getMonth() + 1).padStart(2, '0') // January is 0!
  const yyyy = today.getFullYear()
  const hh = today.getHours()
  const min = today.getMinutes()

  return fileDate ? yyyy + mm + dd + '-' + hh + '-' + min : yyyy + mm + dd + '-' + hh + ':' + min
}

async function _uploadBlob(blobName, content, fileType, metadata = {}) {
  try {
    const containerClient = blobServiceClient.getContainerClient(STORAGE_CONTAINER_NAME)
    const blockBlobClient = containerClient.getBlockBlobClient(blobName)

    log.debug(`Blobstorage - Upload block blob ${blobName} `)

    const uploadBlobResponse = await blockBlobClient.upload(content, content.length)

    log.debug(`Blobstorage - file is uploaded. Updating metadata...`)

    await blockBlobClient.setHTTPHeaders({ blobContentType: fileType })
    metadata.date = getTodayDate(false)
    await blockBlobClient.setMetadata(metadata)
    log.info('uploadBlobResponse', uploadBlobResponse)
    return uploadBlobResponse
  } catch (error) {
    log.error('Error when uploading file in blobStorage: ' + blobName, { error })
    return error
  }
}

async function runBlobStorage(file, courseCode, metadata) {
  log.info('runBlobStorage: ', file, ', courseCode: ', courseCode, ', metadata: ', metadata)
  // const containerName = 'kursinfo-image-container'
  const imageName = `Picture_by_own_choice_${courseCode}.${metadata.fileExtension}`
  const content = await sharp(file.data).resize(400, 300).toBuffer()
  const fileType = file.mimetype

  const uploadResponse = await _uploadBlob(imageName, content, fileType, metadata)
  log.debug(' Blobstorage - uploaded file response ', uploadResponse)

  return imageName
}

module.exports = {
  runBlobStorage,
}
