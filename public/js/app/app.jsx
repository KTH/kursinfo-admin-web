'use strict'
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  require('inferno-devtools')
}
import { render, Component } from 'inferno'
import { Provider, inject } from 'inferno-mobx'
import { BrowserRouter, Switch, Redirect, Route, Link, matchPath } from 'inferno-router'
import { configure } from 'mobx'
import queryString from 'query-string'
import { globalRegistry, createUtility } from 'component-registry'

import { renderString } from 'inferno-formlib/lib/widgets/common'
import { IMobxStore } from './interfaces/utils'

import i18n from '../../../i18n'

import AdminStore from './stores/AdminStore.jsx'
import SellingInfo from './pages/SellingInfo.jsx'
import AdminStartPage from './pages/AdminStartPage.jsx'


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
  createUtility({
    implements: IMobxStore,
    name: 'AdminStore',
    store: adminStore
  }).registerWith(globalRegistry)

  return (
    <Provider adminStore={adminStore} >
      <ProgressLayer>
        <Switch>
          <Route path='/admin/kurser/kurs/edit' component={SellingInfo} />
          <Route path='/admin/kurser/kurs/' component={AdminStartPage} />
        </Switch>
      </ProgressLayer>
    </Provider>
    )
}

function doAllAsyncBefore ({
    pathname,
    query,
    adminStore,
    routes})
  {
  const queryParams = queryString.parse(query)

  const matches = routes.map((route) => {
    const { exact, leaf, path, asyncBefore} = route.props
    return {
      match: matchPath(pathname, { path, exact: leaf }),
      query: queryParams,
      asyncBefore
    }
  })

    /* if (asyncBefore) {
      return asyncBefore(routerStore, match, query)
    }*/

  return Promise.resolve()
}

@inject(['adminStore'])
  class ProgressLayer extends Component {
  constructor (props, context) {
    super(props)
    this.state = {
      context,
      id: 'test'
    }

      /* this.doContinueNavigation = this.doContinueNavigation.bind(this)
      this.doCancelNavigation = this.doCancelNavigation.bind(this)
      this.didChangeLocation = this.didChangeLocation.bind(this)*/
  }

  getChildContext () {
    return this.state.context
  }

  componentWillReceiveProps (nextProps, nextContext) {
    if (nextContext.router.route.location.key !== this.context.router.route.location.key) {
      const asyncBeforeProps = {
        pathname: nextContext.router.route.location.pathname,
        query: nextContext.router.route.location.search,
        adminStore: nextProps.adminStore,
        routes: nextProps.children.props.children,
        nextContext,
        nextProps
      }

        // Continue with page change
      doAllAsyncBefore(asyncBeforeProps).then((res) => {
        this.setState({ context: nextContext })
      })
    }
  }

  doContinueNavigation () {
    this.props.adminStore.didCancelEdits()

    if (this.asyncBeforeProps) {
      return doAllAsyncBefore(this.asyncBeforeProps).then((res) => {
        this.setState({
          context: this.asyncBeforeProps.nextContext,
          showIsEditingModal: false
        })
        this.asyncBeforeProps = undefined
      })
    }

      // Leaving page
  }

  doCancelNavigation () {
    // Revert the addressbar since it is changed prior to reaching the modal
    this.state.context.router.history.replace(this.state.context.router.route.location.pathname)
    this.setState({
      showIsEditingModal: false
    })
    this.asyncBeforeProps = undefined
  }

  render ({ adminStore }) {
    console.log('!!adminStore!!', adminStore, 'this.props', this.props)
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}

if (typeof window !== 'undefined') {
  render(<BrowserRouter>{appFactory()}</BrowserRouter>, document.getElementById('kth-kursinfo'))
}

export {
    appFactory,
    doAllAsyncBefore
}
