import React, { useState } from 'react'
import { Modal, ModalBody, ModalFooter, Button } from 'reactstrap'
import classNames from 'classnames'

const goBackToStartPage = returnToUrl => {
  window.location = returnToUrl
}

function ButtonModal(props) {
  const [state, setState] = useState({ isOpen: false })

  function toggle() {
    const { isOpen } = state
    setState({
      isOpen: !isOpen,
    })
  }
  function handleConfirm(event) {
    event.preventDefault()
    const { type, returnToUrl } = props
    if (type === 'cancel') goBackToStartPage(returnToUrl)
    else {
      // return control to parent element function
      // eslint-disable-next-line react/destructuring-assignment
      props.handleParentConfirm()
      // close modal
      toggle()
    }
  }

  const { btnLabel, children, course, disabled, type, id, modalLabels } = props
  const { header, body, btnCancel, btnConfirm } = modalLabels
  const btnStyle = classNames(
    { 'btn-info-modal': type === 'info-icon' },
    { secondary: type === 'cancel' },
    { success: type === 'submit' },
    { danger: type === 'remove' }
  )

  return (
    <span>
      <Button type="button" color={btnStyle} className={btnStyle} disabled={disabled} onClick={toggle}>
        {btnLabel}
      </Button>
      <Modal isOpen={state.isOpen} toggle={toggle} id={id}>
        <div className="modal-header h-4">
          <h4 className="modal-title">{header}</h4>
          <button type="button" className="close" aria-label="Close" onClick={toggle}>
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <ModalBody>
          {children}
          {type !== 'info-icon' && <p>{modalLabels.infoCourse + ' ' + course}</p>}
          <p dangerouslySetInnerHTML={{ __html: body }} />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={this.toggle}>
            {btnCancel}
          </Button>
          {type === 'submit' || type === 'remove' || type === 'cancel' ? (
            <Button color="secondary" type={type} onClick={handleConfirm}>
              {btnConfirm}
            </Button>
          ) : (
            ''
          )}
        </ModalFooter>
      </Modal>
    </span>
  )
}
export default ButtonModal
