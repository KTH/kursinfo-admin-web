'use strict'

const log = require('kth-node-log')
const config = require('../configuration')
const packageFile = require('../../../package.json')
const path = require('path')
const fs = require('fs')

const configuration = config.full.logging
const environment = config.env

const logConfiguration = {
  name: packageFile.name,
  app: packageFile.name,
  env: environment,
  level: configuration.log.level,
  src: configuration.src
}

if (configuration.logstash) {
  const certs = configuration.logstash.caCerts.map((cert) => {
    if (cert.indexOf('/') === 0) {
      return fs.readFileSync(cert)
    }

    return fs.readFileSync(path.join(__dirname, '/../../../config/', cert))
  })

  logConfiguration.logstash = {
    enabled: true,
    tlsOptions: {
      host: configuration.logstash.host,
      port: configuration.logstash.port,
      ca: certs
    },
    lumberjackOptions: {
      maxQueueSize: configuration.logstash.maxQueueSize
    }
  }
} else {
  logConfiguration.console = {
    enabled: true
  }
}

log.init(logConfiguration)
