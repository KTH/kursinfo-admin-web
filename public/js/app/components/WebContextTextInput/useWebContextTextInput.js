import React from 'react'

import { useWebContext } from '../../context/WebContext'
import { validateCkEditorLength } from './validation'

/**
 * Hook use to manage state for EditorSections based on values from routeData.
 */
function useWebContextTextInput() {
  const [context] = useWebContext()
  const [values, setValues] = React.useState(context.routeData.values)
  const [errors, setErrors] = React.useState({})

  const hasErrors = React.useMemo(() => Object.values(errors).some(error => !!error), [errors])
  const hasChanges = React.useMemo(() => {
    const initialValues = context.routeData.values
    return Object.entries(values).some(([key, value]) => {
      const text = value?.replace(/\n/g, '') ?? ''
      const initialText = initialValues[key]?.replace(/\n/g, '') ?? ''
      return text.localeCompare(initialText) !== 0
    })
  }, [context.routeData.values, values])

  const onChange = (field, editor) => {
    const htmlText = editor.getData()
    setValues(currentValues => ({ ...currentValues, [field]: htmlText }))

    const cleanText = editor.document.getBody().getText().replace(/\n/g, '')
    const { errorMessage } = validateCkEditorLength(htmlText, cleanText, context.langIndex)
    setErrors(currentErrors => ({ ...currentErrors, [field]: errorMessage }))
  }

  const getEditorSectionProps = name => ({
    name,
    value: values[name],
    validationError: errors[name],
    onChange: editor => onChange(name, editor),
  })

  return {
    values,
    errors,
    hasChanges,
    hasErrors,
    getEditorSectionProps,
  }
}

export { useWebContextTextInput }
