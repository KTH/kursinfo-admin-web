function _addParamToPath (path, param, value) {
  var paramToReplace = ':' + param
  return path.replace(paramToReplace, value)
}

module.exports = {
  addParamToPath: _addParamToPath
}
