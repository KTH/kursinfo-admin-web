import { renderHook } from '@testing-library/react'
import { act } from 'react-dom/test-utils'

import { useWebContextTextInput } from '../useWebContextTextInput'
import { validateCkEditorLength } from '../validation'

const mockedContext = {
  routeData: {
    values: {
      field1: 'value1',
      field2: 'value2',
    },
  },
}

jest.mock('../validation')
jest.mock('../../../context/WebContext', () => ({
  useWebContext() {
    return [mockedContext, jest.fn()]
  },
}))

const createEditorMock = html => ({
  getData: () => html,
  document: {
    getBody: () => ({
      getText: () => 'text',
    }),
  },
})

describe('useWebContextTextInput', () => {
  it('should have initial state', () => {
    const { result } = renderHook(() => useWebContextTextInput())

    expect(result.current.values).toStrictEqual(mockedContext.routeData.values)
    expect(result.current.errors.field1).toBeUndefined()
    expect(result.current.errors.field2).toBeUndefined()
    expect(result.current.hasChanges).toStrictEqual(false)
    expect(result.current.hasErrors).toStrictEqual(false)
    expect(result.current.getEditorSectionProps).toBeFunction()
  })

  it('should update values', () => {
    const { result } = renderHook(() => useWebContextTextInput())

    const newValue = '<p>My new value</p>'
    const editor = createEditorMock(newValue)

    validateCkEditorLength.mockReturnValueOnce({ errorMessage: undefined })
    act(() => {
      result.current.getEditorSectionProps('field2').onChange(editor)
    })

    expect(result.current.hasChanges).toStrictEqual(true)
    expect(result.current.values).toStrictEqual({
      field1: mockedContext.routeData.values.field1,
      field2: newValue,
    })
  })

  it('should set errors and unset', () => {
    const { result } = renderHook(() => useWebContextTextInput())
    const editor = createEditorMock('<p>My new value</p>')

    const mockedErrorMessage = 'An error!!!'
    validateCkEditorLength
      .mockReturnValueOnce({ errorMessage: mockedErrorMessage })
      .mockReturnValueOnce({ errorMessage: undefined })

    act(() => {
      result.current.getEditorSectionProps('field2').onChange(editor)
    })

    expect(result.current.hasErrors).toStrictEqual(true)
    expect(result.current.errors.field2).toBe(mockedErrorMessage)

    act(() => {
      result.current.getEditorSectionProps('field2').onChange(editor)
    })

    expect(result.current.hasErrors).toStrictEqual(false)
    expect(result.current.errors.field2).toBeUndefined()
  })
})
