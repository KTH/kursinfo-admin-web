function hasImageBeenChanged(initState, latestState) {
  if (!initState) return false

  const { isStandardImageChosen, newImageFile } = latestState
  const isNewImageUploaded = !!newImageFile

  if (isNewImageUploaded && !isStandardImageChosen) return true
  if (initState.hasImageNameFromApi && isStandardImageChosen) return true
  if (initState.isStandardImageChosen !== isStandardImageChosen) return true

  return false
}

function unpackTexts(latestState) {
  const {
    sellingText: latestFromContext = null,
    sv: svFromLocalState = null,
    en: enFromLocalState = null,
  } = latestState

  if (latestFromContext) return { svLatestText: latestFromContext.sv, enLatestText: latestFromContext.en }

  return { svLatestText: svFromLocalState, enLatestText: enFromLocalState }
}

function hasTextBeenChanged(initState, latestState) {
  if (!initState) return false

  const { svInitText, enInitText } = initState
  const { svLatestText, enLatestText } = unpackTexts(latestState)

  if (svInitText !== svLatestText) return true
  if (enInitText !== enLatestText) return true

  return false
}

export { hasImageBeenChanged, hasTextBeenChanged }
