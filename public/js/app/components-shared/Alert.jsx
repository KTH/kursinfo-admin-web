/**
 * https://intra.kth.se/style/en/components/alert
 *
 * Changelog:
 * - 2024-04- - initial version (release of kth-style 10 public apps)
 * - 2024-05-31 - add aria-live="polite" as default and add {...rest} to allow adding extra props (as test-ids) to Alert root element
 */
import React from 'react'
import PropTypes from 'prop-types'

const Alert = ({ type, header, children, ...rest }) => (
  <div className={`kth-alert ${type}`} role="alert" aria-live="polite" {...rest}>
    {header && <h4>{header}</h4>}
    <div>{children}</div>
  </div>
)

Alert.propTypes = {
  children: PropTypes.node.isRequired,
  header: PropTypes.node,
  type: PropTypes.oneOf(['info', 'warning', 'success']).isRequired,
}

Alert.defaultProps = {
  type: 'info',
}

export default Alert
