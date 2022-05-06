'use strict'

import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Routes } from 'react-router-dom' // matchPath
import { WebContextProvider } from './context/WebContext'
import { uncompressData } from './context/compress'
import AdminStartPage from './pages/AdminStartPage'
import CourseDescriptionEditorPage from './pages/CourseDescriptionEditorPage'
import CourseStatisticsPage from './pages/CourseStatisticsPage'
import '../../css/kursinfo-admin-web.scss'

function _renderOnClientSide() {
  const isClientSide = typeof window !== 'undefined'

  if (!isClientSide) {
    return
  }

  const webContext = {}
  uncompressData(webContext)

  const basename = webContext.proxyPrefixPath.uri

  const app = <BrowserRouter basename={basename}>{appFactory({}, webContext)}</BrowserRouter>

  // Removed basename because it is causing empty string basename={basename}
  const domElement = document.getElementById('app')
  ReactDOM.hydrate(app, domElement)
}

_renderOnClientSide()

function appFactory(applicationStore, context) {
  return (
    <WebContextProvider configIn={context}>
      <Routes>
        <Route exact path="/statistik/:semester" element={<CourseStatisticsPage />} />
        <Route exact path="/edit/:courseCode" element={<CourseDescriptionEditorPage />} />
        <Route exact path="/:courseCode" element={<AdminStartPage />} />
      </Routes>
    </WebContextProvider>
  )
}

export default appFactory
