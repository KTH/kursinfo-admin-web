'use strict'

const languageUtils = require('@kth/kth-node-web-common/lib/language')

function getIndex(req, res) {
  res.set('Cache-control', 'public, max-age=300')

  const lang = languageUtils.getLanguage(res) || 'sv'
  const html =
    lang === 'en'
      ? 'No course code was entered. Try to add a course code to the existing web browser addresss'
      : 'Web addressen saknar en kurskod. Försöka med att lägga till en kurskod till addressen.'
  const title = lang === 'en' ? 'No course code was entered' : 'Ingen kurskod'

  res.render('noCourse/index', {
    debug: 'debug' in req.query,
    html,
    lang,
    title,
  })
}

module.exports = {
  getIndex,
}
