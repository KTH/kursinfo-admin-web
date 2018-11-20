'use strict'
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  require('inferno-devtools')
}
import { render, Component } from 'inferno'
import { Provider, inject } from 'inferno-mobx'
import { BrowserRouter, Switch, Redirect, Route, Link, matchPath } from 'inferno-router'
import { configure } from "mobx"
import queryString from 'query-string'
import { globalRegistry, createUtility } from 'component-registry'

import { renderString } from 'inferno-formlib/lib/widgets/common'
import { IMobxStore } from './interfaces/utils'

import i18n from '../../../i18n'

import RouterStore from './stores/RouterStore.jsx'
import CoursePage from './pages/CoursePage.jsx'

class tmp extends Component {
  constructor (props) {
    super(props)

    this.state = {
      text: "hej"
    }

    this.click = this.click.bind(this)
  }

  click (e) {
    e.preventDefault()
    console.log(e)
    this.setState({
      text: 'Working!'
    })
  }

  render () {
    return <div onClick={this.click}>Click me! {this.state.text}</div>
  }
}

function appFactory () {
   
  if (process.env['NODE_ENV'] !== 'production') {
    configure({
      isolateGlobalState: true
    })
  } 

  const routerStore = new RouterStore()

  if (typeof window !== 'undefined') {
    routerStore.initializeStore('routerStore')
  }
  createUtility({
    implements: IMobxStore,
    name: 'RouterStore',
    store: routerStore
  }).registerWith(globalRegistry)



  return(
      <Provider routerStore={routerStore} >
        <ProgressLayer>
          <Switch>
            <Route  path="/student/kurser/kurs" component={ CoursePage } asyncBefore = { CoursePage.fetchData }/>
            <Route path="/" component={ tmp } />
            <Route path="/kursinfo" component={ tmp } />
          </Switch>
        </ProgressLayer>
        </Provider>
    )
  }


  function doAllAsyncBefore ({
    pathname,
    query,
    routerStore,
    routes}) 
  {
    const queryParams = queryString.parse(query)

    const matches = routes.map((route) => {
      const { exact, leaf, path, asyncBefore} = route.props
      return {
        match: matchPath(pathname, { path, exact: leaf } ),
        query: queryParams,
        asyncBefore
      }
    })

    /*if (asyncBefore) {
      return asyncBefore(routerStore, match, query)
    }*/
    
    return Promise.resolve()
  }

  @inject(['routerStore'])
  class ProgressLayer extends Component {
    constructor (props, context) {
      super(props)
      this.state = {
        context,
       id:"test"
      }
  
      /*this.doContinueNavigation = this.doContinueNavigation.bind(this)
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
          routerStore: nextProps.routerStore,
          routes: nextProps.children.props.children,
          nextContext,
          nextProps
        }

  
        // Continue with page change
        doAllAsyncBefore (asyncBeforeProps).then((res) => {
          this.setState({ context: nextContext })
        })
      }
    }
  
    doContinueNavigation() {
      this.props.routerStore.didCancelEdits()
  
      if (this.asyncBeforeProps) {
        return doAllAsyncBefore (this.asyncBeforeProps).then((res) => {
          this.setState({
            context: this.asyncBeforeProps.nextContext,
            showIsEditingModal: false
          })
          this.asyncBeforeProps = undefined
        })
  
      }
  
      // Leaving page
    }
  

  doCancelNavigation() {
    // Revert the addressbar since it is changed prior to reaching the modal
    this.state.context.router.history.replace(this.state.context.router.route.location.pathname)
    this.setState({
      showIsEditingModal: false
    })
    this.asyncBeforeProps = undefined
  }

  render ({ routerStore }) {
    console.log("!!routerStore!!",routerStore,"this.props",this.props)
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