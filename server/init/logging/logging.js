'use strict'

const log = require('kth-node-log')
const config = require('../configuration').server
const packageFile = require('../../../package.json')
const path = require('path')
const fs = require('fs')

const configuration = config.logging
const environment = config.env

let logConfiguration = {
  name: packageFile.name,
  app: packageFile.name,
  env: environment,
  level: configuration.log.level,
  console: configuration.console,
  stdout: configuration.stdout,
  src: configuration.src
}

log.init(logConfiguration)
