
import Row from 'inferno-bootstrap/dist/Row'
import i18n from '../../../../i18n'

const ProgressBar = ({language, active}) => {
  return (
    <Row className='progress-bar-container'>
      <div className={`col-md-4 col-sm-12 progress-bar1 ${active === 1 ? 'progress-active' : ''}`}>
        <h4>{i18n.messages[language].pageTitles.header_progress_select_pic}</h4>
      </div>
      <div className={`col-md-4 col-sm-12 progress-bar1 ${active === 2 ? 'progress-active' : ''}`}>
        <h4>{i18n.messages[language].pageTitles.header_progress_edit}</h4>
      </div>
      <div className={`col-md-4 col-sm-12 progress-bar1 ${active === 3 ? 'progress-active' : ''}`}>
        <h4>{i18n.messages[language].pageTitles.header_progress_review}</h4>
      </div>
    </Row>
  )
}

export default ProgressBar
