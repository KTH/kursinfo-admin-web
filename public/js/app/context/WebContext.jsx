import React from 'react'
import { addClientFunctionsToWebContext } from '../client-context/addClientFunctionsToWebContext'

const WebContext = React.createContext()

const defaultConfig = () => ({
  lang: 'sv',
  isAdmin: false,
  basicBreadcrumbs: [
    { label: 'KTH', url: 'https://www-r.referens.sys.kth.se/' },
    { label: 'Node', url: 'https://www-r.referens.sys.kth.se/node' },
  ],
  proxyPrefixPath: { uri: 'node' },
  message: 'howdi',
})

export const WebContextProvider = props => {
  const { configIn = {} } = props
  const config = { ...defaultConfig() }
  for (const k in configIn) {
    if (Object.prototype.hasOwnProperty.call(configIn, k)) {
      if (typeof configIn[k] === 'object') {
        config[k] = JSON.parse(JSON.stringify(configIn[k]))
      } else {
        config[k] = configIn[k]
      }
    }
  }

  // OBS! deviation from NODE-WEB to make functions working
  const [currentConfig, setConfig] = React.useState({ ...config, ...addClientFunctionsToWebContext() })
  const value = [currentConfig, setConfig]
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <WebContext.Provider value={value} {...props} />
}

export function useWebContext() {
  const context = React.useContext(WebContext)
  if (!context) {
    throw new Error('useWebContext must be used within a WebContext')
  }
  return context
}
