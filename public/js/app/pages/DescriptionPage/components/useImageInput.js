import React from 'react'

import { useWebContext } from '../../../context/WebContext'

/**
 * Helper hook for handling state in DescriptionImageEdit
 */
const useImageInput = () => {
  const [context] = useWebContext()
  const { defaultImage, imageFromApi } = context.routeData
  const [state, setState] = React.useState({
    hasCustomImage: imageFromApi.hasCustomImage,
    termsChecked: false,
    newImage: null,
    error: null,
  })

  const onInputTypeChanged = hasCustomImage => {
    setState({
      hasCustomImage: hasCustomImage,
      termsChecked: false,
      newImage: null,
      error: null,
    })
  }

  const onCheckTermsChanged = checked => setState({ ...state, termsChecked: checked })

  const setImage = newImage => setState({ ...state, newImage })

  const setError = () => {}

  const hasChanged = React.useMemo(() => {
    if (imageFromApi.hasCustomImage !== state.hasCustomImage) return true
    if (state.hasCustomImage && state.newImage) {
      return true
    }
  }, [state.hasCustomImage, state.newImage])

  const previewImageUrl = !state.hasCustomImage
    ? defaultImage.url
    : state.newImage
      ? state.newImage.path
      : imageFromApi.url

  return {
    hasCustomImage: state.hasCustomImage,
    termsChecked: state.termsChecked,
    newImage: state.newImage,
    error: state.error,
    hasChanged,
    previewImageUrl,

    onInputTypeChanged,
    onCheckTermsChanged,
    setImage,
    setError,
  }
}

export { useImageInput }
