/**
 * Configuration specific for the development environment.
 */

module.exports = {
  useSsl: false,
  hostUrl: 'http://localhost:3000',
  port: 3000,
  ssl: {
    // either key and cert
    cert: '', // path to cert file
    key: '', // path to key file for cert
    // or pfx(p12) and passphrase for key
    pfx: '', // path to cert
    passphrase: '' // passphrase for pfx-cert
  },
  cas: {
    ssoBaseURL: 'https://login-r.referens.sys.kth.se'
  },
  ldap: {
    // in dev, set this to true to bypass any authorization of the user
    bypassUserAuthorization: false,
    uri: 'ldaps://ldap.ref.ug.kth.se',
    base: 'OU=UG,DC=ref,DC=ug,DC=kth,DC=se',
    filter: '(ugKthid=KTHID)',

    username: 'system-infosys@ref.ug.kth.se'
  },
  nodeApi: {
    sampleApi: {
      https: false,
      host: 'localhost',
      port: 3001,
      proxyBasePath: '/api/node'
    }
  },
  blockApi: {
    blockUrl: 'https://www.kth.se/cm/'
  },
  logging: {
    accessLog: {
      useAccessLog: false
    },
    log: {
      level: 'debug'
    },
    src: true,
    logstashNotUsed: {
      host: 'logserv.sys.kth.se',
      port: 5000,
      maxQueueSize: 1000,
      caCerts: [
        'Digicert_CA.pem',
        'TERENA_SSL_CA_3.pem'
      ]
    }
  },
  clientLogging: {
    level: 'debug'
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
    force: true,
    debug: true
  },
  session: {
    key: 'node-web.sid',
    useRedis: false,
    sessionOptions: {
      // do not set session secret here!!
      cookie: { secure: false }
    },
    redisOptions: {}
  }
}
