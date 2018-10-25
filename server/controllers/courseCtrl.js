'use strict'

const api = require('../api')
const co = require('co')
const log = require('kth-node-log')
const { safeGet } = require('safe-utils')
const { RouterContext, match } = require('inferno-router')
var routeFactory = require('../../dist/js/server/app.js').default
const InfernoServer = require('inferno-server')
const createElement = require('inferno-create-element')

module.exports = {
  getIndex: co.wrap(getIndex)
}

const paths = require('../server').getPaths()


function  getIndex (req, res, next) {

  if (process.env['NODE_ENV'] === 'development') {
    delete require.cache[require.resolve('../../dist/js/server/app.js')]
    routeFactory = require('../../dist/js/server/app.js').default
  }

  try {
    const client = api.nodeApi.client
    const paths = api.nodeApi.paths
   // const resp = yield client.getAsync(client.resolve(paths.getDataById.uri, { id: '123' }), { useCache: true })
console.log("URL",req.originalUrl)
    
    const routes = routeFactory(req.originalUrl)
    const renderProps = match(routes, req.originalUrl)
    if (renderProps.redirect) return res.redirect(renderProps.redirect)

    
    
    const html = InfernoServer.renderToString(createElement(RouterContext, renderProps))


    res.render('/index', {
      debug: 'debug' in req.query,
      html:"hm...",
      //data: resp.statusCode === 200 ? safeGet(() => { return resp.body.name }) : '',
     // error: resp.statusCode !== 200 ? safeGet(() => { return resp.body.message }) : ''
    })
  } catch (err) {
    log.error('Error in getIndex', { error: err })
    next(err)
  }
}
