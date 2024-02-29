import React from 'react'
import { Button, Col } from 'reactstrap'

import i18n from '../../../../i18n'
import { useWebContext } from '../context/WebContext'
import { ADMIN_OM_COURSE, CANCEL_PARAMETER } from '../util/constants'
import ButtonModal from './ButtonModal'

export default function ControlButtons({ pageState, back, next }) {
  const [context] = useWebContext()

  const messages = i18n.messages[context.langIndex]
  const backLabel = back?.label ?? messages.compontents.controlButtons.back
  const cancelLabel = messages.compontents.controlButtons.cancel
  const nextLabel = next?.label ?? messages.compontents.controlButtons.next
  const hasChanges = pageState?.hasChanges ?? false
  const confirmModalsLabels = messages.compontents.controlButtons.confirmModals

  return (
    <div className="control-buttons">
      <Col sm="4">
        {back && (
          <Button className="back" onClick={() => pageState.progress.goToPrevious()}>
            {backLabel}
          </Button>
        )}
      </Col>
      <Col sm="4">
        <ButtonModal
          type={hasChanges ? 'cancel-with-modal' : 'cancel-without-modal'}
          course={pageState?.courseCode}
          btnLabel={cancelLabel}
          modalLabels={confirmModalsLabels.cancel}
          returnToUrl={`${ADMIN_OM_COURSE}${pageState?.courseCode}${CANCEL_PARAMETER}`}
        />
      </Col>
      <Col sm="4">
        {next.confirmPublish ? (
          <ButtonModal
            type={'submit'}
            course={pageState?.courseCode}
            btnLabel={nextLabel}
            modalLabels={confirmModalsLabels.publish}
            handleParentConfirm={next.onClick}
            disabled={next.disabled}
          />
        ) : (
          <Button className="next" color="success" onClick={next.onClick} disabled={next.disabled} href={next.href}>
            {nextLabel}
          </Button>
        )}
      </Col>
    </div>
  )
}
