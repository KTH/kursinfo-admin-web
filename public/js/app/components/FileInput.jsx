/* eslint-disable react/destructuring-assignment */
/* eslint-disable class-methods-use-this */
import React from 'react'
import { Button } from 'reactstrap'

function FileInput(props) {
  function clickFileInput(ev) {
    // This function is for chrome browser, because in safari it works fine without it
    ev.preventDefault()
    document.querySelector('.pic-upload').click()
  }

  function handleChange(ev) {
    props.onChange(ev)
  }

  /* accept = 'image/jpg,image/jpeg,image/png'
   */
  const { accept, id, btnLabel } = props

  return (
    <span className="btn-upload-file">
      <label role="presentation" htmlFor={id} onClick={clickFileInput}>
        <Button color="secondary" block>
          <span>{btnLabel}</span>
        </Button>
      </label>
      {/* className='pic-upload' is important because it will be used in function clickFileInput, resetToPrevApiPicture in upload picture class */}
      <input
        data-testid="fileUpload"
        className="pic-upload"
        type="file"
        id={id}
        name={id}
        tabIndex="-1"
        accept={accept}
        onChange={handleChange}
      />

      {props.children}
    </span>
  )
}

export default FileInput
