class HttpError {
  constructor(status, message) {
    this.status = status
    this.message = message
    this.isHttpError = true
  }
}

module.exports = {
  HttpError,
}
