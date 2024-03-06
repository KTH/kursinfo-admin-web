import React from 'react'
import { useWebContext } from '../context/WebContext'
import { courseAdminLink } from '../util/links'

/**
 * Replaces title URL in the header.
 *
 * The header is rendered on server by kthHeader.handlebars but without the
 * course code. This a hack to add course code to the link at first client
 * side render.
 */
export default function SiteHeaderUrlWrapper({ children }) {
  const [context] = useWebContext()

  React.useEffect(() => {
    const siteNameElement = document.querySelector('.block.siteName a')
    if (siteNameElement) {
      siteNameElement.href = courseAdminLink(context.courseCode, context.lang)
    }
  }, [context.courseCode, context.lang])

  return children
}
