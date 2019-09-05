import { Component } from 'inferno'
import Modal from 'inferno-bootstrap/dist/Modal/Modal'
import ModalBody from 'inferno-bootstrap/dist/Modal/ModalBody'
import ModalHeader from 'inferno-bootstrap/dist/Modal/ModalHeader'
import ModalFooter from 'inferno-bootstrap/dist/Modal/ModalFooter'
import Button from 'inferno-bootstrap/dist/Button'
import { ADMIN_OM_COURSE } from '../util/constants'

class ButtonModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      modal: false // this.props.isOpen
    }
    this.toggle = this.toggle.bind(this)
    this.handleConfirm = this.handleConfirm.bind(this)
  }

  toggle () {
    this.setState({
      modal: !this.state.modal
    })
  }
  _goBackToStartPage () {
    console.log('_goBackToStartPage')
    window.location = `${ADMIN_OM_COURSE}${this.props.course}?serv=kinfo&event=cancel`
  }

  handleConfirm (event) {
    event.preventDefault()
    console.log('handleConfirm', this.props.id)

    if (this.props.id === 'cancel') this._goBackToStartPage()
    else this.props.handleConfirm()
  }

  render () {
    const { fade, className, infoText, id, step } = this.props
    const fadeModal = (this.props.hasOwnProperty('fade') ? fade : true)
    const color = id === 'publish' ? 'success' : ''

    return (
      <span>
        <Button id={id} type='button' onClick={this.toggle} className={id === 'info' ? 'btn-info-modal' : ''} color={color}>
          {this.props.buttonLabel}
        </Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={className} fade={fadeModal} id={id + step}>
          <ModalHeader toggle={this.toggle}>{infoText.header}</ModalHeader>
          <ModalBody>
            {
              id === 'info'
              ? ''
              : <p dangerouslySetInnerHTML={{__html: infoText.infoCourse}}>{' ' + this.props.course}</p>
            }
            <p dangerouslySetInnerHTML={{__html: infoText.body}} />
          </ModalBody>
          <ModalFooter>
            <Button id={id} color='secondary' onClick={this.toggle}>{infoText.btnCancel}</Button>
            {
              infoText.btnConfirm
              ? <Button color='secondary' onClick={this.handleConfirm}>{infoText.btnConfirm}</Button>
              : ''
            }
          </ModalFooter>
        </Modal>
      </span>
      )
  }
}

export default ButtonModal
