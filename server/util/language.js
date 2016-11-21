'use strict'

/**
 * Language middleware and helper.
 * Helps maintain the selected language by using the session cookie.
 */

const log = require('kth-node-log')
const locale = require('locale')
const cookieName = 'language'
const validLanguages = [ 'sv', 'en' ]
const defaultLanguage = validLanguages[ 0 ]
const supportedLocales = new locale.Locales(validLanguages, defaultLanguage)

/**
 * Initialize locale and language for the current user session (respects cookie: language).
 */
function _init (req, res, newLang) {
  let lang = newLang || req.cookies[ cookieName ]
  var chosenLocale

  if (lang) {
    let locales = new locale.Locales(lang, defaultLanguage)
    chosenLocale = locales.best(supportedLocales)
  } else {
    let locales = new locale.Locales(req.headers['accept-language'], defaultLanguage)
    chosenLocale = locales.best(supportedLocales)
  }

  // If we got an explicit language we set the language cookie
  if (newLang) {
    res.cookie(cookieName, chosenLocale.language)
  }

  res.locals.locale = chosenLocale
  // Backwards compatibility only in case someone accessed the prop directly:
  res.locals.language = chosenLocale.getLanguage

  return chosenLocale
}

/**
 * Helper that gets the current language from the session
 */
function _getLanguage (res) {
  return res.locals.locale && res.locals.locale.language
}

module.exports = {
  getLanguage: _getLanguage,
  init: _init,
  validLanguages: validLanguages,
  defaultLanguage: defaultLanguage
}
