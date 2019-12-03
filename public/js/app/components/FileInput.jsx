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
    =====style=====
    @function kthStyleIcon($base) {
        $url: url('https://app.kth.se/style/kth-style/img/kth-style/icons/'+ $base +'.svg');
        @return $url;
    }
    %icon-general-style {
        content: '';
        height: 1.2em;
        width: 1.5em;
        display: inline-block;
    }
    .file-uploader-section {
        display: flex;
        flex-direction: column;
        input[type=file] {
            filter: alpha(opacity=0);
            opacity: 0;
            border: 0;
        }
        h4 {
            margin:0;
            &::after {
                @extend %icon-general-style;
                margin-left: 1em;
                vertical-align: bottom;
                background: kthStyleIcon('file-upload-fa-solid') no-repeat;
                background-size: 1em;
            }
        }
    }

    */
    const { accept, id, btnLabel } = this.props

    return <span className='file-uploader-section btn-upload-file'>
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
