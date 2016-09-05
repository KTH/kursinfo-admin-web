/**
 * Configuration for the reference environment. This file is completmented by
 * a configuration file provided by fabric during the deployment process.
 */

module.exports = {
  useSsl: true,
  hostUrl: 'https://refurl',
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
      host: 'www-r.referens.sys.kth.se',
      port: 3001,
      proxyBasePath: '/api/node'
    }
  },
  blockApi: {
    blockUrl: 'https://www-r.referens.sys.kth.se/cm/'
  },
  // key: filename (or * for all)
  // value: should match labels in log.js
  logging: {
    accessLog: {
      useAccessLog: true
    },
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
