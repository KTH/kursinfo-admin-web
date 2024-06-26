// @ts-check

import React from 'react'
import { StaticRouter } from 'react-router-dom/server'
import ReactDOMServer from 'react-dom/server'
import { compressData } from './context/compress'
import appFactory from './app'

function _getServerSideFunctions() {
  return {
    getCompressedData(data, dataId) {
      const code = compressData(data, dataId)
      return code
    },
    renderStaticPage({ applicationStore, location: pageLocation, basename, context }) {
      const app = (
        <StaticRouter basename={basename} location={pageLocation}>
          {appFactory(applicationStore, context)}
        </StaticRouter>
      )
      return ReactDOMServer.renderToString(app)
    },
  }
}

export default _getServerSideFunctions()
