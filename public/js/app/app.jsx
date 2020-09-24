'use strict'

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'
import { BrowserRouter, Route, Switch } from 'react-router-dom' // matchPath
import { StaticRouter } from 'react-router'
import AdminStore from './stores/AdminStore'
import AdminStartPage from './pages/AdminStartPage'
import CourseDescriptionEditorPage from './pages/CourseDescriptionEditorPage'
import CourseStatisticsPage from './pages/CourseStatisticsPage'
import '../../css/kursinfo-admin-web.scss'

function appFactory() {
  const adminStore = new AdminStore()
  if (typeof window !== 'undefined') {
    adminStore.initializeStore('adminStore')
  }

  return (
    <Provider adminStore={adminStore}>
      <Switch>
        <Route
          path="/kursinfoadmin/kurser/kurs/statistik/:courseRound"
          component={CourseStatisticsPage}
        />
        <Route
          path="/kursinfoadmin/kurser/kurs/edit/:courseCode"
          component={CourseDescriptionEditorPage}
        />
        <Route path="/kursinfoadmin/kurser/kurs/:courseCode" component={AdminStartPage} />
      </Switch>
    </Provider>
  )
}

function staticRender(context, location) {
  return (
    <StaticRouter location={location} context={context}>
      {appFactory()}
    </StaticRouter>
  )
}

if (typeof window !== 'undefined') {
  ReactDOM.render(
    <BrowserRouter>{appFactory()}</BrowserRouter>,
    document.getElementById('kth-kursinfo')
  )
}

export { appFactory, staticRender }
