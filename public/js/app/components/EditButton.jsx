import PropTypes from 'prop-types'
import React from 'react'

export const EditButton = ({ isOpen, toggle, labels }) => {
  return (
    <button
      className={`EditButton ${isOpen ? 'EditButton--open' : 'EditButton--closed'}`}
      type="button"
      aria-label={`${isOpen ? labels.close : labels.open}`}
      onClick={() => toggle()}
    >
      <span className="EditButton__icon" />
    </button>
  )
}

EditButton.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  labels: PropTypes.object.isRequired,
}
export default EditButton
