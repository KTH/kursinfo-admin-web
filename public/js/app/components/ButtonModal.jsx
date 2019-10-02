import { Component } from 'inferno'
import Modal from 'inferno-bootstrap/dist/Modal/Modal'
import ModalBody from 'inferno-bootstrap/dist/Modal/ModalBody'
import ModalHeader from 'inferno-bootstrap/dist/Modal/ModalHeader'
import ModalFooter from 'inferno-bootstrap/dist/Modal/ModalFooter'
import Button from 'inferno-bootstrap/dist/Button'
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
                //* *** Properties *** *//
    // type: {info-icon, publish, cancel, remove}
    // btnLabel: t.e., 'Publish and quit', if it is info modal then no btnLabel need
    // returnToUrl: where to return after canceling process
    // header: 'Modal header'
    /* modalLabels = {
      header: 'To be aware of before cancelling!',
      body: 'Unsaved changes will be lost if you cancel the publishing of course information (image and text) <br/>  <br/> Do you want to cancel?',
      btnCancel: 'No, go back',
      btnConfirm: 'Yes, cancel',
    }
    */
        //* *** example 1 SUBMIT*** *//
    /*
    <ButtonModal id='publish' type='submit' btnLabel={introLabel.button.publish} handleParentConfirm={this.handlePublish}
        modalLabels={introLabel.info_publish} course={this.courseCode} alt={introLabel.alt.publish}
        disabled={this.state.hasDoneSubmit}
        />
    */
        //* *** example 2 INFO ICON*** *//
    /*
    <ButtonModal id='infoPic' type='info-icon'
        modalLabels={introLabel.info_image} course={this.courseCode} />

    */
   /*
    <ButtonModal id='cancelStep1' type='cancel' course={this.courseCode}
        returnToUrl={`${ADMIN_OM_COURSE}${this.courseCode}${CANCEL_PARAMETER}`}
        btnLabel={introLabel.button.cancel}
        modalLabels={introLabel.info_cancel} />
    />
   */

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
