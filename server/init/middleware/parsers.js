'use strict'

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const server = require('../../server')

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))
server.use(cookieParser())
