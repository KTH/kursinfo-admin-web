import { validateCkEditorLength } from '../validation'

describe('Text input validation', () => {
  it('should not return errorMessage for cleanText within limit ', () => {
    const cleanText = 'A'.repeat(2000)
    const htmlText = ``
    const langIndex = 1
    const res = validateCkEditorLength(htmlText, cleanText, langIndex)
    expect(res.errorMessage).toBeUndefined()
  })

  it('should not return errorMessage for html within limit ', () => {
    const cleanText = ''
    const htmlText = 'A'.repeat(10000)
    const langIndex = 1
    const res = validateCkEditorLength(htmlText, cleanText, langIndex)
    expect(res.errorMessage).toBeUndefined()
  })

  it('should return errorMessage for long cleanText ', () => {
    const cleanText = 'A'.repeat(2001)
    const htmlText = ``
    const langIndex = 1
    const res = validateCkEditorLength(htmlText, cleanText, langIndex)
    expect(res.errorMessage).toBe('Texten får bara bestå av 2 000 tecken')
  })

  it('should return errorMessage for long html', () => {
    const cleanText = ''
    const htmlText = 'A'.repeat(10001)
    const langIndex = 1
    const res = validateCkEditorLength(htmlText, cleanText, langIndex)
    expect(res.errorMessage).toBe('HTML texten får bara bestå av 10 000 tecken')
  })
})
