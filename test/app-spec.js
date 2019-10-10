const nodeEnv = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase()
console.log('node env', nodeEnv)

if (nodeEnv === 'test' || !nodeEnv) {
    require('dotenv').config()
}