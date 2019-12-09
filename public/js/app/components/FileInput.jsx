import React, { Component } from 'react'
import { Button } from 'reactstrap'

class FileInput extends Component {
  constructor (props) {
    super(props)

    this.state = {
    }
    this.clickFileInput = this.clickFileInput.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  clickFileInput (event) {
    if (event.target !== event.currentTarget) event.currentTarget.click()
  }

  handleChange (event) {
    this.props.onChange(event)
  }

  render () {
    /* accept = 'image/jpg,image/jpeg,image/png'
    */
    const { accept, id, btnLabel } = this.props

    return <span className='btn-upload-file'>
      <label htmlFor={id} onClick={this.clickFileInput}>
        <Button color='secondary' block><span>{btnLabel}</span></Button>
      </label>
      {/* className='pic-upload' is important because it will be used in function resetToPrevApiPicture in upload picture class */}
      <input data-testid='fileUpload' className='pic-upload' type='file' id={id} name={id} tabIndex='-1'
        accept={accept}
        onChange={this.handleChange}
        />

      {this.props.children}
    </span>
  }
}

export default FileInput
