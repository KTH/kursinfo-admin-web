// https://intra.kth.se/style/en/components/alert

import React from 'react'
import PropTypes from 'prop-types'

const Alert = ({ type, header, children }) => (
  <div className={`kth-alert ${type}`} role="alert">
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
