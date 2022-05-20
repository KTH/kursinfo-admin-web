import React from 'react'
import { Row } from 'reactstrap'
import i18n from '../../../../i18n'

const ProgressBar = ({ language, active, introText }) => (
  <Row className="progress-bar-container">
    <div className={`col-md-4 col-sm-12 progress-bar1 ${active === 1 ? 'progress-active' : ''}`}>
      <span>{i18n.messages[language].pageTitles.header_progress_select_pic}</span>
    </div>
    <div className={`col-md-4 col-sm-12 progress-bar1 ${active === 2 ? 'progress-active' : ''}`}>
      <span>{i18n.messages[language].pageTitles.header_progress_edit}</span>
    </div>
    <div className={`col-md-4 col-sm-12 progress-bar1 ${active === 3 ? 'progress-active' : ''}`}>
      <span>{i18n.messages[language].pageTitles.header_progress_review}</span>
    </div>
    <div>
      <p data-testid="intro-text">{introText}</p>
    </div>
  </Row>
)

export default ProgressBar
