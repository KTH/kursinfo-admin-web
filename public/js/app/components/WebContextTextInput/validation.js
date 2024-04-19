import i18n from '../../../../../i18n'

const HTML_MAX_LENGTH = 10000 // Max in api
const TEXT_MAX_LENGTH = 2000

function validateCkEditorLength(htmlText, cleanText, langIndex) {
  const translation = i18n.messages[langIndex].pageTitles.alertMessages

  let errorMessage = undefined
  if (cleanText.length > TEXT_MAX_LENGTH) {
    errorMessage = translation.over_text_limit
  } else if (htmlText.length > HTML_MAX_LENGTH) {
    errorMessage = translation.over_html_limit
  }

  return {
    errorMessage,
  }
}

export { validateCkEditorLength }
