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

  const onCheckTermsChanged = checked => setState({ ...state, termsChecked: checked, error: null })

  const setImage = newImage => setState({ ...state, newImage, termsChecked: false, error: null })

  const setError = error => setState({ ...state, error: error })

  const doSubmitValidation = () => {
    if (state.hasCustomImage) {
      if (state.newImage && !state.termsChecked) {
        setError('approve_term')
        return false
      }
      if (!state.newImage && !imageFromApi.url) {
        setError('no_file_chosen')
        return false
      }
    }
    return true
  }

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
    doSubmitValidation,
  }
}

export { useImageInput }
