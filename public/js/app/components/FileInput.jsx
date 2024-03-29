/* eslint-disable react/destructuring-assignment */
/* eslint-disable class-methods-use-this */
import React from 'react'
import { Button } from 'reactstrap'

const FileInput = React.forwardRef(function FileInput(props, ref) {
  const inputRef = React.useRef(null)

  React.useImperativeHandle(
    ref,
    () => ({
      clearInput: () => {
        inputRef.current.value = ''
      },
    }),
    []
  )

  function clickFileInput(ev) {
    // This function is for chrome browser, because in safari it works fine without it
    ev.preventDefault()
    inputRef.current.click()
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
      <input
        ref={inputRef}
        data-testid="fileUpload"
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
})

export default FileInput
