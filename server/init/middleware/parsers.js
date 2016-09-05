'use strict'

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const server = require('../../server')

server.use(bodyParser.json())
server.use(cookieParser())
