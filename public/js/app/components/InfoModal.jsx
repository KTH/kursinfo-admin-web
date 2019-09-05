import { Component } from 'inferno'
import Modal from 'inferno-bootstrap/dist/Modal/Modal'
import ModalBody from 'inferno-bootstrap/dist/Modal/ModalBody'
import ModalHeader from 'inferno-bootstrap/dist/Modal/ModalHeader'
import ModalFooter from 'inferno-bootstrap/dist/Modal/ModalFooter'
import Button from 'inferno-bootstrap/dist/Button'

// class InfoModal extends Component {
//   constructor (props) {
//     super(props)
//     this.state = {
//       modal: false
//     }
//     this.toggle = this.toggle.bind(this)
//   }

//   toggle () {
//     this.setState({
//       modal: !this.state.modal
//     })
//   }

//   render () {
//     const fadeModal = (this.props.hasOwnProperty('fade') ? this.props.fade : true)
//     return (
//       <Button className='btn-info-modal' onClick={this.toggle}>{this.props.buttonLabel}
//         <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} fade={fadeModal}>
//           <ModalHeader toggle={this.toggle}>Info</ModalHeader>
//           <ModalBody>
//             {this.props.type && this.props.type === 'html'
//               ? <p dangerouslySetInnerHTML={{__html: this.props.infoText}}></p>
//               : <p>{this.props.infoText}</p>
//             }
//           </ModalBody>
//           <ModalFooter>
//             <Button color='secondary' onClick={this.toggle}>Close</Button>
//           </ModalFooter>
//         </Modal>
//       </Button>
//     )
//   }
// }
class InfoModal extends Component {
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

  handleConfirm (event) {
    event.preventDefault()
    this.props.handleConfirm(this.props.id, true)
  }

  render () {
    const { fade, /* isOpen, toggle,*/ className, type, infoText, id } = this.props
    const fadeModal = (this.props.hasOwnProperty('fade') ? fade : true)

    return (
      <span>
        <Button id={type} type='button' onClick={this.toggle} className={type === 'info' ? 'btn-info-modal' : ''}>
          {this.props.buttonLabel}
        </Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={className} fade={fadeModal} id={id}>
          <ModalHeader toggle={this.toggle}>{infoText.header}</ModalHeader>
          <ModalBody>
            {
              type === 'info'
              ? ''
              : <p dangerouslySetInnerHTML={{__html: infoText.infoCourse}}>{' ' + id}</p>
            }
            <p dangerouslySetInnerHTML={{__html: infoText.body}} />
          </ModalBody>
          <ModalFooter>
            <Button id={type} color='secondary' onClick={this.toggle}>{infoText.btnCancel}</Button>
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


export default InfoModal
