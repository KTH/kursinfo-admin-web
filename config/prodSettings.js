/**
 * Configuration for the production environment. This file is complemented by
 * a configuration file provided by fabric during the deployment process.
 */

module.exports = {
  useSsl: true,
  hostUrl: 'https://produrl',
  port: 3000,
  ssl: {
    // either key and cert
    // cert: '', // path to cert file
    // key: '', // path to key file for cert
    // or pfx(p12) and passphrase for key
    pfx: '/etc/pki/tls/private/localhost.p12', // path to cert
    passphrase: '/etc/pki/tls/private/localhost.pass' // passphrase for pfx-cert
  },
  cas: {
    ssoBaseURL: 'https://login.kth.se'
  },
  nodeApi: {
    sampleApi: {
      https: false,
      host: 'www.kth.se',
      port: 3001,
      proxyBasePath: '/api/node'
    }
  },
  blockApi: {
    blockUrl: 'https://www.kth.se/cm/'
  },
  // key: filename (or * for all)
  // value: should match labels in log.js
  logging: {
    log: {
      level: 'info'
    },
    logstash: {
      host: 'logserv.sys.kth.se',
      port: 5000,
      maxQueueSize: 1000,
      caCerts: [
        'Digicert_CA.pem',
        'TERENA_SSL_CA_3.pem'
      ]
    },
    accessLog: {
      useAccessLog: true
    }
  },
  cache: {
    cortinaBlock: {
      redis: {
        host: 'localhost',
        port: 6379
      }
    }
  },
  cssTranspiler: {
    force: false,
    debug: false
  },
  session: {
    key: 'node-web.sid',
    useRedis: true,
    sessionOptions: {
      // do not set session secret here!!
      cookie: { secure: true }
    },
    redisOptions: {
      host: 'localhost',
      port: 6379
    }
  }
}
