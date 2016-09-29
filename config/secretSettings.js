module.exports = {
  useSsl: process.env.SERVER_USE_SSL === 'true',
  hostUrl: process.env.SERVER_HOST_URL,
  port: process.env.SERVER_PORT,
  secure: {
    sessionSecret: process.env.SESSION_SECRET,
    apiKey: {
      sampleApi: process.env.NODE_API_KEY
    },
    ldap: {
      // in dev, set this to true to bypass any authorization of the user
      bypassUserAuthorization: false,
      uri: process.env.LDAP_URI,
      base: process.env.LDAP_BASE,
      filter: process.env.LDAP_FILTER,
      username: process.env.LDAP_USERNAME,
      password: process.env.LDAP_PASSWORD
    }
  },
  ssl: {
    passphrase: '',
    pfx: ''
  },
  cas: {
    ssoBaseURL: process.env.CAS_SSO_URI
  },
  nodeApi: {
    sampleApi: {
      https: false,
      port: 3001,
      host: process.env.NODE_API_SAMPLE_HOST,
      proxyBasePath: '/api/node'
    }
  },
  blockApi: {
    blockUrl: process.env.BLOCK_API_URL
  },
  logging: {
    log: {
      level: 'debug'
    },
    accessLog: {
      useAccessLog: true
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
