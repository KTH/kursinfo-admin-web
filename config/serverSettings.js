/**
 *
 *            Server specific settings
 *
 * *************************************************
 * * WARNING! Secrets should be read from env-vars *
 * *************************************************
 *
 */
const { getEnv, devDefaults, unpackRedisConfig, unpackNodeApiConfig } = require('kth-node-configuration')
const { safeGet } = require('safe-utils')

// DEFAULT SETTINGS used for dev, if you want to override these for you local environment, use env-vars in .env
const devPort = devDefaults(3000)
const devSsl = devDefaults(false)
const devUrl = devDefaults('http://localhost:' + devPort)
const devKursinfoApi = devDefaults('https://api-r.referens.sys.kth.se/api/kursinfo?defaultTimeout=10000') // required=true&
const devSessionKey = devDefaults('kursinfo-admin-web.sid')
const devSessionUseRedis = devDefaults(true)
const devRedis = devDefaults('redis://localhost:6379/')
const devUgRestAuthApiTokenUri = devDefaults('https://login.ref.ug.kth.se/adfs/')
const devUgRestApiUri = devDefaults('https://integral-api.sys.kth.se/test/ug')
const devStorageContainerName = devDefaults('kursinfo-image-container')
// END DEFAULT SETTINGS
const devOidcIssuerURL = devDefaults('https://login.ref.ug.kth.se/adfs')
const devOidcConfigurationURL = devDefaults(`${devOidcIssuerURL}/.well-known/openid-configuration`)
const devOidcTokenSecret = devDefaults('tokenSecretString')
const prefixPath = devDefaults('/kursinfoadmin/kurser/kurs') // Change this to your prefixPath!!!
const devOidcCallbackURL = devDefaults(`http://localhost:3000${prefixPath}/auth/login/callback`)
const devOidcCallbackSilentURL = devDefaults(`http://localhost:3000${prefixPath}/auth/silent/callback`)
const devOidcLogoutCallbackURL = devDefaults(`http://localhost:3000${prefixPath}/auth/logout/callback`)
module.exports = {
  hostUrl: getEnv('SERVER_HOST_URL', devUrl),
  useSsl: safeGet(() => getEnv('SERVER_SSL', devSsl + '').toLowerCase() === 'true'),
  port: getEnv('SERVER_PORT', devPort),
  ssl: {
    // In development we don't have SSL feature enabled
    pfx: getEnv('SERVER_CERT_FILE', ''),
    passphrase: getEnv('SERVER_CERT_PASSPHRASE', ''),
  },

  oidc: {
    configurationUrl: getEnv('OIDC_CONFIGURATION_URL', devDefaults(devOidcConfigurationURL)),
    clientId: getEnv('OIDC_APPLICATION_ID', null),
    clientSecret: getEnv('OIDC_CLIENT_SECRET', null),
    tokenSecret: getEnv('OIDC_TOKEN_SECRET', devDefaults(devOidcTokenSecret)),
    callbackLoginUrl: getEnv('OIDC_CALLBACK_URL', devDefaults(devOidcCallbackURL)),
    callbackSilentLoginUrl: getEnv('OIDC_CALLBACK_SILENT_URL', devDefaults(devOidcCallbackSilentURL)),
    callbackLogoutUrl: getEnv('OIDC_CALLBACK_LOGOUT_URL', devDefaults(devOidcLogoutCallbackURL)),
  },

  // API keys
  apiKey: {
    kursinfoApi: getEnv('KURSINFO_API_KEY', devDefaults('1234')),
  },
  ladokMellanlagerApi: {
    clientId: getEnv('LADOK_AUTH_CLIENT_ID', null),
    clientSecret: getEnv('LADOK_AUTH_CLIENT_SECRET', null),
    tokenUrl: getEnv('LADOK_AUTH_TOKEN_URL', null),
    scope: getEnv('LADOK_AUTH_SCOPE', null),
    baseUrl: getEnv('LADOK_BASE_URL', null),
    ocpApimSubscriptionKey: getEnv('LADOK_OCP_APIM_SUBSCRIPTION_KEY', null),
  },
  // Authentication
  auth: {
    // app.kursinfo.superuser = personer tillagda där ska kunna lägga till folk som adminanvändare
    // app.kursinfo.kursinfo-admins = personer som är tillagda där ska kunna logga in i Om kursen via länken "Administera Om kursen" för alla skolor och alla kurser.
    superuserGroup: 'app.kursinfo.superuser',
    kursinfoAdmins: 'app.kursinfo.kursinfo-admins',
  },

  // Service API's
  nodeApi: {
    kursinfoApi: unpackNodeApiConfig('KURSINFO_API_URI', devKursinfoApi),
  },

  redisOptions: unpackRedisConfig('REDIS_URI', devRedis), // TODO, CHECK IF IT IS NEEDED

  // Cortina
  blockApi: {
    blockUrl: getEnv('CM_HOST_URL', devDefaults('https://www-r.referens.sys.kth.se/cm/')), // Block API base URL
    addBlocks: {
      studentMegaMenu: '1.1066510',
      studentSearch: '1.1066521',
      studentFooter: '1.1066523',
    },
  },

  // Logging
  logging: {
    log: {
      level: getEnv('LOGGING_LEVEL', 'debug'),
    },
    accessLog: {
      useAccessLog: getEnv('LOGGING_ACCESS_LOG', true),
    },
  },
  clientLogging: {
    level: 'debug',
  },
  cache: {
    cortinaBlock: {
      redis: unpackRedisConfig('REDIS_URI', devRedis),
      redisKey: 'CortinaBlock_kursinfo-admin-web_',
    },
  },

  // UG API auth properties
  ugAuth: {
    authTokenURL: getEnv('UG_REST_AUTH_API_TOKEN_URI', devUgRestAuthApiTokenUri),
    authClientId: getEnv('UG_REST_AUTH_CLIENT_ID', null),
    authClientSecret: getEnv('UG_REST_AUTH_CLIENT_SECRET', null),
  },
  // ug redis api base url
  ugRestApiURL: {
    url: getEnv('UG_REST_API_URI', devUgRestApiUri),
    key: getEnv('UG_REST_API_SUBSCRIPTION_KEY', null),
  },

  // Session
  sessionSecret: getEnv('SESSION_SECRET', devDefaults('1234567890')),
  session: {
    key: getEnv('SESSION_KEY', devSessionKey),
    useRedis: safeGet(() => getEnv('SESSION_USE_REDIS', devSessionUseRedis) === 'true'),
    sessionOptions: {
      // do not set session secret here!!
      cookie: {
        secure: String(getEnv('SESSION_SECURE_COOKIE', false)).toLowerCase() === 'true',
        path: getEnv('SERVICE_PUBLISH', '/kursinfoadmin/kurser/kurs'),
        sameSite: getEnv('SESSION_SAME_SITE_COOKIE', 'Lax'),
      },
      proxy: safeGet(() => getEnv('SESSION_TRUST_PROXY', true) === 'true'),
    },
    redisOptions: unpackRedisConfig('REDIS_URI', devRedis),
  },

  toolbar: {
    url: getEnv('TOOLBAR_URL', devDefaults('https://www-r.referens.sys.kth.se/social/toolbar/widget.js')),
  },

  fileStorage: {
    kursinfoStorage: {
      containerName: getEnv('STORAGE_CONTAINER_NAME', devStorageContainerName),
      blobServiceSasUrl: getEnv('BLOB_SERVICE_SAS_URL', ''),
    },
  },
}
