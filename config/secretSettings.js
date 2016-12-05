'use strict'

const getEnv = require('kth-node-configuration').getEnv

module.exports = {
  useSsl: getEnv('SERVER_USE_SSL', false),
  ssl: {
    pfx: getEnv('SERVER_CERT_FILE', '/certs/localhost.p12'),
    passphrase: getEnv('SERVER_CERT_PASSPHRASE', '/certs/localhost.pass')
  },
  hostUrl: getEnv('SERVER_HOST_URL'),
  port: getEnv('SERVER_PORT'),
  secure: {
    sessionSecret: getEnv('SESSION_SECRET'),
    apiKey: {
      sampleApi: getEnv('NODE_API_KEY')
    },
    ldap: {
      // in dev, set this to true to bypass any authorization of the user
      uri: getEnv('LDAP_URI'),
      base: getEnv('LDAP_BASE'),
      filter: getEnv('LDAP_FILTER'),
      username: getEnv('LDAP_USERNAME'),
      password: getEnv('LDAP_PASSWORD')
    }
  },
  cas: {
    ssoBaseURL: getEnv('CAS_SSO_URI')
  },
  nodeApi: {
    sampleApi: {
      https: getEnv('NODE_API_SAMPLE_HTTPS', false),
      port: getEnv('NODE_API_SAMPLE_PORT'),
      host: getEnv('NODE_API_SAMPLE_HOST'),
      proxyBasePath: getEnv('NODE_API_SAMPLE_PATH')
    }
  },
  blockApi: {
    blockUrl: getEnv('BLOCK_API_URL')
  },
  logging: {
    log: {
      level: getEnv('LOGGING_LEVEL', 'info')
    },
    accessLog: {
      useAccessLog: getEnv('LOGGING_ACCESS_LOG', true)
    }
  },
  clientLogging: {
    level: 'debug'
  },
  cache: {
    cortinaBlock: {
      redis: {
        host: getEnv('CACHE_CORTINA_BLOCK_HOST', 'localhost'),
        port: getEnv('CACHE_CORTINA_BLOCK_PORT', 6379)
      }
    }
  },
  cssTranspiler: {
    force: getEnv('CSS_TRANSPILER_FORCE', true),
    debug: getEnv('CSS_TRANSPILER_DEBUG', true)
  },
  session: {
    key: getEnv('SESSION_KEY', 'node-web.sid'),
    useRedis: getEnv('SESSION_USE_REDIS', false),
    sessionOptions: {
      // do not set session secret here!!
      cookie: { secure: getEnv('SESSION_SECURE_COOKIE', false) }
    },
    redisOptions: {
      host: getEnv('CACHE_CORTINA_BLOCK_HOST', 'localhost'),
      port: getEnv('CACHE_CORTINA_BLOCK_PORT', 6379)
    }
  }
}
