'use strict'

module.exports = {
  addParamToPath: _addParamToPath,
  resolve: _resolve
}

// Adds string to url path. DEPRECATED: use resolve instead
function _addParamToPath (path, param, value) {
  const paramToReplace = ':' + param
  return path.replace(paramToReplace, value)
}

// Adds parameters to url
function _resolve (uri, params, skipEncode) {
  Object.keys(params).forEach((key) => {
    const part = skipEncode ? params[key] : encodeURIComponent(params[key])
    uri = uri.replace(new RegExp(':' + key, 'gi'), part)
  })

  return uri
}

