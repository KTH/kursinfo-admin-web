import imageCompression from 'browser-image-compression'

function createImageFormData(imageFile, courseCode) {
  const formData = new FormData()
  formData.append('courseCode', courseCode)
  formData.append('file', imageFile)
  formData.append('fileExtension', imageFile.name.toLowerCase().split('.').pop())
  formData.append('pictureBy', 'Picture chosen by user')
  return formData
}

async function compressFile(imageFile, courseCode) {
  const options = {
    initialQuality: 1,
    maxSizeMB: 5,
    maxWidthOrHeight: 800, // 2*400 to keep quality of f.e., text on the picture
    useWebWorker: true,
  }
  const compressedBlob = await imageCompression(imageFile, options)
  const compressedFile = new File([compressedBlob], `compressed-image-${compressedBlob.name}`, {
    type: compressedBlob.type,
  })

  const imageFilePath = compressedFile ? window.URL.createObjectURL(compressedFile) : ''
  const imageFormData = imageFilePath ? createImageFormData(compressedFile, courseCode) : undefined

  return { imageFilePath, imageFormData }
}

function uploadImage(context, courseCode, formData, onProgress) {
  const { hostUrl } = context.browserConfig
  const [saveImageUrl] = context.paths.storage.saveImage.uri.split(':')

  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest()
    req.upload.addEventListener('progress', uploadEvent => {
      if (uploadEvent.lengthComputable) {
        const p = (uploadEvent.loaded / uploadEvent.total) * 100
        onProgress(p)
      }
    })
    req.onreadystatechange = function onUploadImageStateChange() {
      if (this.readyState === XMLHttpRequest.DONE) {
        if (this.status === 200) {
          resolve({ imageName: this.response })
        }
        if (this.status !== 200) {
          reject({ error: this })
        }
      }
    }

    req.open('POST', `${hostUrl}${saveImageUrl}${courseCode}/published`)
    req.send(formData)
  })
}

export { compressFile, uploadImage }
