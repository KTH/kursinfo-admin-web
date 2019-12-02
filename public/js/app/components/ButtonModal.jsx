import React, { Component } from 'react'
import { Modal, ModalBody, ModalHeader, ModalFooter, Button } from 'reactstrap'
import classNames from 'classnames'

class ButtonModal extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isOpen: false
    }
    this.toggle = this.toggle.bind(this)
    this.handleConfirm = this.handleConfirm.bind(this)
  }

  toggle () {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  _goBackToStartPage (returnToUrl) {
    window.location = returnToUrl
  }

  handleConfirm (event) {
    event.preventDefault()
    if (this.props.type === 'cancel') this._goBackToStartPage(this.props.returnToUrl)
    else {
    // return control to parent element function
      this.props.handleParentConfirm()
    // close modal
      this.toggle()
    }
  }

  render () {
    const { type, id, modalLabels } = this.props
    const { header, body, btnCancel, btnConfirm } = modalLabels
    const btnStyle = classNames(
      {'btn-info-modal': type === 'info-icon'},
      {'secondary': type === 'cancel'},
      {'success': type === 'submit'},
      {'danger': type === 'remove'}
    )
    return <span>
      <Button type='button' color={btnStyle} className={btnStyle}
        disabled={this.props.disabled}
        onClick={this.toggle}>
          {this.props.btnLabel}
      </Button>
      <Modal isOpen={this.state.isOpen} toggle={this.toggle} id={id}>
        <ModalHeader toggle={this.toggle}>{header}</ModalHeader>
        <ModalBody>
            {this.props.children}
            {
              type === 'info-icon'
              ? ''
              : <p>{modalLabels.infoCourse + ' ' + this.props.course}</p>
            }
            <p dangerouslySetInnerHTML={{__html: body}}></p>
        </ModalBody>
        <ModalFooter>
          <Button color='secondary' onClick={this.toggle}>{btnCancel}</Button>
            {
              type === 'submit' || type === 'remove' || type === 'cancel'
              ? <Button color='secondary' type={type} onClick={this.handleConfirm}>{btnConfirm}</Button>
              : ''
            }
        </ModalFooter>
      </Modal>
    </span>
  }
}

export default ButtonModal
