import React, { useState } from 'react'
import { Modal, ModalBody, ModalFooter } from 'reactstrap'
import classNames from 'classnames'
import { goToStartPage } from '../util/links'
import Button from '../components-shared/Button'

function ButtonModal(props) {
  const [state, setState] = useState({ isOpen: false })

  function toggle() {
    const { isOpen } = state
    setState({
      isOpen: !isOpen,
    })
  }
  function handleConfirm(ev) {
    ev.preventDefault()
    const { type, returnToUrl } = props
    if (type === 'cancel-with-modal' || type === 'cancel-without-modal') goToStartPage(returnToUrl)
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
    { 'btn-info-modal': type === 'info-icon' }, // TODO: karl: kth-style - modal button
    { secondary: type === 'cancel-with-modal' || type === 'cancel-without-modal' },
    { success: type === 'submit' },
    { danger: type === 'remove' }
  )

  return (
    <>
      {btnStyle === 'btn-info-modal' ? (
        <button id={id} type="button" className={btnStyle} onClick={toggle} />
      ) : (
        <Button
          type="button"
          variant={btnStyle}
          disabled={disabled}
          onClick={type === 'cancel-without-modal' ? handleConfirm : toggle}
        >
          {btnLabel}
        </Button>
      )}
      <Modal isOpen={state.isOpen} toggle={toggle} id={id}>
        <div className="modal-header">
          <h4 className="modal-title">{header}</h4>
          <button type="button" className="kth-icon-button close" aria-label="Close" onClick={toggle}></button>
        </div>
        <ModalBody>
          {children}
          {type !== 'info-icon' && <p>{modalLabels.infoCourse + ' ' + course}</p>}
          <p dangerouslySetInnerHTML={{ __html: body }} />
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={toggle}>
            {btnCancel}
          </Button>
          {type === 'submit' || type === 'remove' || type.includes('cancel') ? (
            <Button variant="secondary" type={type} onClick={handleConfirm}>
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
