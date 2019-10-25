'use strict'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider, inject } from 'mobx-react'
import { BrowserRouter, Route, Switch } from 'react-router-dom' // matchPath
import { configure } from 'mobx'
import { StaticRouter } from 'react-router'
import AdminStore from './stores/AdminStore'
import AdminStartPage from './pages/AdminStartPage'
import CourseDescriptionEditorPage from './pages/CourseDescriptionEditorPage'
import CourseStatisticsPage from './pages/CourseStatisticsPage'

function appFactory () {
  if (process.env['NODE_ENV'] !== 'production') {
    configure({
      isolateGlobalState: true
    })
  }

  const adminStore = new AdminStore()
  if (typeof window !== 'undefined') {
    adminStore.initializeStore('adminStore')
  }

  return (
    <Provider adminStore={adminStore} >
      {/* <ProgressLayer> */}
        <Switch>
          <Route path='/kursinfoadmin/kurser/kurs/statistik' component={CourseStatisticsPage} />
          <Route path='/kursinfoadmin/kurser/kurs/edit' component={CourseDescriptionEditorPage} />
          <Route path='/kursinfoadmin/kurser/kurs/' component={AdminStartPage} />
        </Switch>
      {/* </ProgressLayer> */}
    </Provider>
    )
}

function staticRender (context, location) {
  return (
    <StaticRouter location={location} context={context}>
      {appFactory()}
    </StaticRouter>
  )
}

if (typeof window !== 'undefined') {
  ReactDOM.render(<BrowserRouter>{appFactory()}</BrowserRouter>, document.getElementById('kth-kursinfo'))
}

export {
    appFactory,
    staticRender
}
