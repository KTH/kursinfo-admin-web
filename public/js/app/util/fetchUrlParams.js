function fetchParameters(searchParams) {
  if (!searchParams) return {}
  const params = {}

  for (const entry of searchParams.entries()) {
    const [key, value] = entry
    params[key] = value
  }

  if (Object.keys(params).length === 0) return null

  return params
}

export { fetchParameters }
