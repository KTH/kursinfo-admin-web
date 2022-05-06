/* eslint-disable react/destructuring-assignment */
import React, { useReducer } from 'react'
import { Alert, Button, Col, Row } from 'reactstrap'
import ProgressBar from 'react-bootstrap/ProgressBar'
import i18n from '../../../../i18n'
import { useWebContext } from '../context/WebContext'
import { ADMIN_OM_COURSE, CANCEL_PARAMETER } from '../util/constants'
import ButtonModal from './ButtonModal'

const paramsReducer = (state, action) => ({ ...state, ...action })

function Preview(props) {
  const [context, setContext] = useWebContext()

  const [state, setState] = useReducer(paramsReducer, {
    hasDoneSubmit: false,
    redirectAfterSubmit: false,
    isError: false,
    errMsg: '',
    fileProgress: 0,
  })

  const { isDefaultChosen, newImage, tempFilePath, apiImageUrl, koppsData, courseCode, userLang } = context

  const langIndex = context.koppsData.lang === 'en' ? 0 : 1

  function handleUploadImage() {
    const formData = newImage
    const { hostUrl } = context.browserConfig
    const [saveImageUrl] = context.paths.storage.saveImage.uri.split(':')
    let { fileProgress } = state
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest()
      req.upload.addEventListener('progress', event => {
        if (event.lengthComputable) {
          fileProgress = (event.loaded / event.total) * 100
          setState({ fileProgress })
        }
      })
      req.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          resolve({ imageName: this.response })
        }
        if (this.readyState === 4 && this.status !== 200) {
          this.setState({ fileProgress: 0 })
          reject({ error: this })
        }
      }
      req.open('POST', `${hostUrl}${saveImageUrl}${this.courseCode}/published`)
      req.send(formData)
    })
  }

  function _shapeText() {
    return {
      sv: context.sellingTexts.sv,
      en: context.sellingTexts.en,
    }
  }

  function handleSellingText(image) {
    const { imageName } = image
    const sellingTexts = _shapeText()
    context
      .doUpsertItem(sellingTexts, courseCode, imageName)
      .then(savedText => {
        setContext({ ...context, sellingText: savedText })
        setState({
          hasDoneSubmit: true,
          redirectAfterSubmit: true,
          fileProgress: 100,
          isError: false,
        })
        window.location = `${ADMIN_OM_COURSE}${courseCode}?l=${userLang}&serv=kinfo&event=pub`
      })
      .catch(err => {
        setState({
          hasDoneSubmit: false,
          isError: true,
          errMsg: i18n.messages[langIndex].pageTitles.alertMessages.api_error,
          errDebug: err,
        })
      })
  }

  function handlePublish() {
    setState({
      hasDoneSubmit: true,
      isError: false,
    })
    if (isDefaultChosen) {
      handleSellingText({ imageName: '' })
    } else if (tempFilePath) {
      handleUploadImage()
        .then(response => {
          const { imageName } = response

          if (!imageName) {
            setState({
              hasDoneSubmit: false,
              isError: true,
              errMsg: i18n.messages[langIndex].pageTitles.alertMessages.storage_api_error,
            })
          } else handleSellingText(response)
        })
        .catch(err => {
          setState({
            hasDoneSubmit: false,
            isError: true,
            errMsg: i18n.messages[langIndex].pageTitles.alertMessages.storage_api_error,
            errDebug: err,
          })
        })
    } else {
      handleSellingText({ imageName: context.imageNameFromApi })
    }
  }

  function returnToEditor(event) {
    event.preventDefault()
    props.updateParent({ progress: 2 })
  }

  const { koppsText } = koppsData
  const { introLabel, defaultImageUrl } = props
  const pictureUrl = isDefaultChosen ? defaultImageUrl : tempFilePath || apiImageUrl

  return (
    <div className="Preview--Changes col">
      {state.isError && state.errMsg ? (
        <Alert color="danger">
          <p>{state.errMsg}</p>
        </Alert>
      ) : (
        ''
      )}
      <span className="title_and_info">
        <h2>{`${introLabel.label_step_3} `}</h2>
      </span>
      <Row id="pageContainer" key="pageContainer">
        <Col sm="12" xs="12" lg="12" id="middle" key="middle">
          {['sv', 'en'].map(lang => (
            <Row className="courseIntroText" key={`intro-text-${lang}`}>
              <Col sm="12" xs="12" className="sellingText">
                <h3>{introLabel.langLabelPreview[lang]}</h3>
                <img src={pictureUrl} alt={introLabel.alt.image} height="auto" width="300px" />
                <span
                  className="textBlock"
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{
                    __html: state[lang].length > 0 ? state[lang] : koppsText[lang],
                  }}
                />
              </Col>
            </Row>
          ))}
          <Row className="control-buttons">
            <Col sm="4" className="step-back">
              <Button onClick={returnToEditor} className="back" aria-label={introLabel.alt.step2Back}>
                {introLabel.button.step2}
              </Button>
            </Col>
            <Col sm="4" className="btn-cancel">
              <ButtonModal
                id="cancelStep3"
                type="cancel"
                btnLabel={introLabel.button.cancel}
                returnToUrl={`${ADMIN_OM_COURSE}${this.courseCode}${CANCEL_PARAMETER}`}
                modalLabels={introLabel.info_cancel}
                course={courseCode}
              />
            </Col>
            <Col sm="4" className="btn-last">
              <ButtonModal
                id="publish"
                type="submit"
                btnLabel={introLabel.button.publish}
                handleParentConfirm={handlePublish}
                modalLabels={introLabel.info_publish}
                course={courseCode}
                alt={introLabel.alt.publish}
                disabled={state.hasDoneSubmit}
              />
            </Col>
          </Row>
        </Col>
      </Row>

      {(state.hasDoneSubmit || state.isError) && (
        <span className={state.isError ? 'text-danger' : 'text-success'} role="status">
          <div className="text-center">{state.fileProgress + '%'}</div>
          <ProgressBar
            now={state.isError ? '100' : state.fileProgress}
            variant={state.isError ? 'danger' : 'success'}
          />
        </span>
      )}
    </div>
  )
}

export default Preview
