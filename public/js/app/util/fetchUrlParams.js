function fetchParameters(searchParams) {
  if (!searchParams) return {}
  const params = {}

  for (const entry of searchParams.entries()) {
    const [key, value] = entry
    params[key] = value
  }
  return params
}

export { fetchParameters }
