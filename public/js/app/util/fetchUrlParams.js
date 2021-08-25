const fetchParameters = props => {
  let params = {}
  if (props && props.location && props.location.sellingDescription !== 'success') {
    params = props.location.search
      .substring(1)
      .split('&')
      .map(param => param.split('='))
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {})
  }
  return params
}

module.exports = {
  fetchParameters,
}
