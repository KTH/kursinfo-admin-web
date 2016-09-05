'use strict'

/**
 * Language middleware and helper.
 * Helps maintain the selected language by using the session cookie.
 */

const log = require('kth-node-log')
const cookieName = 'language'
const validLanguages = [ 'sv', 'en' ]
const defaultLanguage = validLanguages[ 0 ]

function _isValid (lang) {
  return validLanguages.indexOf(lang) >= 0
}

/**
 * Initialize language for the current user session (cookie).
 */
function _init (req, res, newLang) {
  let lang = req.cookies[ cookieName ]

  if (newLang && _isValid(newLang)) {
    log.debug(`Language set from external source: '${newLang}'`)
    res.cookie(cookieName, newLang)
    lang = newLang
  } else if (!lang || !_isValid(lang)) {
    log.debug(`Language not set or invalid, setting default: '${defaultLanguage}'`)
    res.cookie(cookieName, defaultLanguage)
    lang = defaultLanguage
  }

  res.locals.language = lang
}

/**
 * Helper that gets the current language from the session
 */
function _getLanguage (res) {
  const lang = res.locals.language

  if (lang && _isValid(lang)) {
    log.debug(`Language found: '${lang}'`)
    return lang
  }

  log.debug(`Language not set, getting default: '${defaultLanguage}'`)
  return defaultLanguage
}

module.exports = {
  getLanguage: _getLanguage,
  init: _init
}
