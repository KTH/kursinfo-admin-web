/* eslint no-use-before-define: ["error", "nofunc"] */

export { compressData, uncompressData }

/**
 * During server-side rendering put the result of this function
 * into <script>-tags so that it gets executed when the page is loaded.
 *
 * @param {data} data
 *
 * @returns {string}
 */
function compressData(data, dataId = 'DATA') {
  const compressedData = encodeURIComponent(JSON.stringify(data))

  const output = `window.__compressedData__${dataId} = "${compressedData}";`
  return output
}

/**
 * During client startup use this function to initialize the client
 * with the server-side prepared data
 *
 * @param {data} data
 *    Data to be used when populating context object
 *    which was created during server-side rendering
 *
 * @return {object}
 *    Returns same object as input
 *    but it might have been changed in place
 */
function uncompressData(data, dataId = 'DATA') {
  const isClientSide = typeof window !== 'undefined'
  if (!isClientSide) {
    // eslint-disable-next-line no-console
    console.error('uncompressData(): Expected to be run on client side')
    return data
  }

  const dataFound = window[`__compressedData__${dataId}`]
  const hasCompressedData = dataFound != null && typeof dataFound === 'string'
  if (!hasCompressedData) {
    return data
  }

  const uncompressedData = JSON.parse(decodeURIComponent(dataFound))
  const validData = uncompressedData != null && typeof uncompressedData === 'object'
  if (!validData) {
    // eslint-disable-next-line no-console
    console.error('uncompress(): Invalid  data')
    return data
  }

  const dataKeys = Object.keys(uncompressedData)
  dataKeys.forEach(key => {
    // eslint-disable-next-line no-param-reassign
    data[key] = uncompressedData[key]
  })
  return data
}
