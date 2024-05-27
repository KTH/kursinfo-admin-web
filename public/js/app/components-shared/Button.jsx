/**
 * https://intra.kth.se/style/en/components/button
 *
 * Changelog:
 * - 2024-05-29 - initial version (added in release of kth-style 10 release of private apps)
 */

import React from 'react'
import PropTypes from 'prop-types'

const getVariantClass = variant => {
  switch (variant) {
    case 'back':
      return 'back'
    case 'previous':
      return 'previous'
    case 'next':
      return 'next'
    case 'primary':
      return 'primary'
    case 'secondary':
      return 'secondary'
    case 'success':
      return 'success'
    case 'error':
      return 'error'
  }
  return 'primary'
}

const Button = ({ children, variant, className, ...rest }) => {
  const variantClassname = getVariantClass(variant)
  const cn = `kth-button ${variantClassname} ${className ?? ''}`
  if (rest.href) {
    return (
      <a className={cn} {...rest}>
        {children}
      </a>
    )
  } else {
    return (
      <button className={cn} {...rest} type={rest.type ?? 'button'}>
        {children}
      </button>
    )
  }
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['back', 'next', 'previous', 'primary', 'secondary', 'success', 'error']).isRequired,
}

Button.defaultProps = {
  variant: 'primary',
}

export default Button
