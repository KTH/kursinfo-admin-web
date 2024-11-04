'use strict'

import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { WebContextProvider } from './context/WebContext'
import { uncompressData } from './context/compress'
import SiteHeaderUrlWrapper from './components/SiteHeaderUrlWrapper'
import AdminStartPage from './pages/AdminStartPage'
import DescriptionPage from './pages/DescriptionPage'
import CourseEditStartPage from './pages/CourseEditStartPage'
import OtherInformationPage from './pages/OtherInformationPage'
import RecommendedPrerequisitesPage from './pages/RecommendedPrerequisitesPage'
import '../../css/kursinfo-admin-web.scss'

function appFactory(applicationStore, context) {
  return (
    <WebContextProvider configIn={context}>
      <SiteHeaderUrlWrapper>
        <Routes>
          <Route exact path="/edit/:courseCode/recommendedPrerequisites" element={<RecommendedPrerequisitesPage />} />
          <Route exact path="/edit/:courseCode/otherInformation" element={<OtherInformationPage />} />
          <Route exact path="/edit/:courseCode/description" element={<DescriptionPage />} />
          <Route exact path="/edit/:courseCode" element={<CourseEditStartPage />} />
          <Route exact path="/:courseCode" element={<AdminStartPage />} />
        </Routes>
      </SiteHeaderUrlWrapper>
    </WebContextProvider>
  )
}

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
  hydrateRoot(domElement, app)
}

_renderOnClientSide()

export default appFactory
