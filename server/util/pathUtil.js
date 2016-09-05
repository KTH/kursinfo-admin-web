'use strict'

module.exports = {
  addParamToPath: _addParamToPath
}

function _addParamToPath (path, param, value) {
  const paramToReplace = ':' + param
  return path.replace(paramToReplace, value)
}
