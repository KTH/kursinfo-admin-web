import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter, Button } from 'reactstrap'
import classNames from 'classnames'

const goBackToStartPage = (returnToUrl) => {
  window.location = returnToUrl
}
class ButtonModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isOpen: false
    }
    this.toggle = this.toggle.bind(this)
    this.handleConfirm = this.handleConfirm.bind(this)
  }

  toggle() {
    const { isOpen } = this.state
    this.setState({
      isOpen: !isOpen
    })
  }

  handleConfirm(event) {
    event.preventDefault()
    const { type, returnToUrl } = this.props
    if (type === 'cancel') goBackToStartPage(returnToUrl)
    else {
      // return control to parent element function
      // eslint-disable-next-line react/destructuring-assignment
      this.props.handleParentConfirm()
      // close modal
      this.toggle()
    }
  }

  render() {
    const { btnLabel, children, course, disabled, type, id, modalLabels } = this.props
    const { header, body, btnCancel, btnConfirm } = modalLabels
    const btnStyle = classNames(
      { 'btn-info-modal': type === 'info-icon' },
      { secondary: type === 'cancel' },
      { success: type === 'submit' },
      { danger: type === 'remove' }
    )
    return (
      <span>
        <Button
          type="button"
          color={btnStyle}
          className={btnStyle}
          disabled={disabled}
          onClick={this.toggle}
        >
          {btnLabel}
        </Button>
        <Modal isOpen={this.state.isOpen} toggle={this.toggle} id={id}>
          <div className="modal-header h-4">
            <h4 className="modal-title">{header}</h4>
            <button type="button" className="close" aria-label="Close" onClick={this.toggle}>
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
              <Button color="secondary" type={type} onClick={this.handleConfirm}>
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
}

export default ButtonModal
