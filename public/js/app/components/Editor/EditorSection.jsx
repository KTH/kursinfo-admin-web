import PropTypes from 'prop-types'
import React from 'react'
import { Button } from 'reactstrap'

import i18n from '../../../../../i18n'

import { useWebContext } from '../../context/WebContext'
import EditButton from '../EditButton'
import { useToggleCKEditor } from './useToggleCKEditor'

const EditorSection = ({ name, title, validationError, value, onChange }) => {
  const [context] = useWebContext()
  const id = React.useId()
  const editorId = `editor-${id}`
  const { isOpen, openEditor, closeEditor, toggleEditor } = useToggleCKEditor(editorId, {
    onChange: event => onChange(event.editor),
  })

  const messages = i18n.messages[context.langIndex]

  return (
    <section className="EditorSection">
      <div className="EditorSection__heading">
        <h3>{title}</h3>
        <EditButton isOpen={isOpen} toggle={toggleEditor} labels={messages.compontents.editButton} />
      </div>

      <div className="EditorSection__body">
        {isOpen ? (
          <textarea id={editorId} name={name} defaultValue={value} />
        ) : (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
          <div className="EditorSection__preview" onClick={openEditor}>
            {value ? (
              <div dangerouslySetInnerHTML={{ __html: value }} />
            ) : (
              <i>{messages.compontents.editorSection.noText}</i>
            )}
          </div>
        )}

        {validationError && <span className="EditorSection__validationErrorLabel">{validationError}</span>}

        {isOpen && (
          <div className="EditorSection__buttons">
            <Button onClick={closeEditor} color="secondary">
              {messages.compontents.editorSection.close}
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

EditorSection.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  titleTooltip: PropTypes.string,
  alertMessage: PropTypes.string,
}

export default EditorSection
