import React from 'react'
import i18n from '../../../../../i18n'

const CKEditorConfigs = {
  startupFocus: true,
  toolbarGroups: [
    { name: 'mode' },
    { name: 'find' },
    { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
    { name: 'list' },
    { name: 'links' },
    { name: 'about' },
  ],
  removeButtons: 'CopyFormatting,Underline,Strike,Subscript,Superscript,Anchor',
  language: i18n.isSwedish() ? 'sv' : 'en',
  mathJaxLib: '//cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS_HTML',
}

function useToggleCKEditor(id, { onChange, onInstanceReady }) {
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    if (isOpen) {
      if (!CKEDITOR.instances[id]) {
        const editor = CKEDITOR.replace(id, CKEditorConfigs)
        onInstanceReady && editor.on('instanceReady', ev => onInstanceReady(ev))
        onChange && editor.on('change', ev => onChange(ev))
      }
    }
    // eslint rule disabled for onChange and onInstanceReady, would be great if
    // it wasn't needed, but should hopefully not be a problem to disable it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isOpen])

  const destroyEditor = () => {
    CKEDITOR.instances[id]?.destroy()
  }

  const openEditor = () => {
    setIsOpen(true)
  }
  const closeEditor = () => {
    destroyEditor()
    setIsOpen(false)
  }
  const toggleEditor = () => (isOpen ? closeEditor() : openEditor())

  return {
    isOpen,
    openEditor,
    closeEditor,
    toggleEditor,
  }
}

export { useToggleCKEditor }
