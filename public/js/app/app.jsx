if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  require('inferno-devtools')
}
import { render, Component } from 'inferno'
import { Provider, inject } from 'inferno-mobx'
import { BrowserRouter, Switch, Redirect, Route, Link, matchPath } from 'inferno-router'
import queryString from 'query-string'
import { globalRegistry, createUtility } from 'component-registry'

import { renderString } from 'inferno-formlib/lib/widgets/common'
//import { IMobxStore } from './interfaces/utils'

import { configure } from "mobx"

import i18n from '../../../i18n'

import CoursePage from './pages/CoursePage.jsx'

const routerStore = {}



function appFactory () {
   
  if (process.env['NODE_ENV'] !== 'production') {
    configure({
      isolateGlobalState: true
    })
  } 

  return(
        <ProgressLayer>
          <Switch>
            <Route  path="/kursinfo" component={ CoursePage } />
            <Route path="/" component={ CoursePage } />
          </Switch>
        </ProgressLayer>
    )
  }


  function doAllAsyncBefore ({
    pathname,
    query,
    routerStore:{},
    routes}) 
  {
    const queryParams = queryString.parse(query)
    const matches = routes.map((route) => {
      const { exact, leaf, path, asyncBefore, breadcrumbLabel} = route.props
      return {
        match: matchPath(pathname, { path, exact: leaf } ),
        query: queryParams
       // asyncBefore,
        //breadcrumbLabel
      }
    })
    
    let prevUrl
    const breadcrumbMatches = matches.filter((route) => {
      const isMatch = route.match && prevUrl !== route.match.url
      prevUrl = isMatch ? route.match.url : prevUrl
      return isMatch
    })
    return Promise.resolve()
  }

  //@inject(['routerStore'])
  class ProgressLayer extends Component {
    constructor (props, context) {
      super(props)
      this.state = {
        context,
        showIsEditingModal: false
      }
  
      this.doContinueNavigation = this.doContinueNavigation.bind(this)
      this.doCancelNavigation = this.doCancelNavigation.bind(this)
      this.didChangeLocation = this.didChangeLocation.bind(this)
    }
  
    getChildContext () {
      return this.state.context
    }
  
    componentDidMount () {
      window.addEventListener('beforeunload', this.didChangeLocation)
    }
  
    componentWillUnmount () {
      window.removeEventListener('beforeunload', this.didChangeLocation)
    }
  
    didChangeLocation (e) {
      if (this.props.routerStore['isEditing']) {
        e.preventDefault()
        // Chrome requires returnValue to be set.
        e.returnValue = ''
      }
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
  
        if (this.props.routerStore['isEditing']) {
          // We are editing so store the props we need to call doAllAsyncBefore if we
          // choose to continue with navigation. And show the warning modal ofc...
          this.setState({ showIsEditingModal: true })
          return this.asyncBeforeProps = asyncBeforeProps
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

  renderBreadrumbs ({ routerStore }) {
    return (
      <Breadcrumb>
        {
          routerStore['breadcrumbs'].map((item) => {
            return (
              <BreadcrumbItem> 
                {item.href && <Link to={item.href}>{item.label}</Link>}
                {!item.href && item.label}
              </BreadcrumbItem>
            )
          })
        }
      </Breadcrumb>
    )
  }

  render ({ routerStore }) {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}

if (typeof window !== 'undefined') {
  render(<BrowserRouter>{appFactory()}</BrowserRouter>, document.getElementById('app'))
}
  
export { 
    appFactory,
    doAllAsyncBefore
}