'use strict'
/**
 * Extension of the i18n module that depends on the server configuration
 * and is therefore not consumable by the server.
 */

const i18n = require('kth-node-i18n')

const messagesEnglish = require('../i18n/messages.en')
const messagesSwedish = require('../i18n/messages.se')

i18n.messages.push(messagesEnglish, messagesSwedish)

module.exports = i18n
