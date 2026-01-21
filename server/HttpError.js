// Be aware that this entire file, or most of it, is replicated in multiple apps,
// so changes here should probably be synced to the other apps.
// See https://confluence.sys.kth.se/confluence/spaces/TFI/pages/218695403/Gemensam+kod+mellan+UtbInfo-repon for more information.

class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}

module.exports = {
  HttpError,
}
