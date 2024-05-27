import React from 'react'
import Button from '../components-shared/Button'

const FileInput = React.forwardRef((props, ref) => {
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
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label role="presentation" htmlFor={id} onClick={clickFileInput}>
        <Button variant="secondary">
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
FileInput.displayName = 'FileInput'

export default FileInput
