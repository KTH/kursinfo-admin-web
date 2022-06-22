/* eslint-disable react/destructuring-assignment */
import React, { useState } from 'react'
import i18n from '../../../../i18n'
import PageTitle from '../components/PageTitle'
import ProgressBar from '../components/ProgressBar'
import Preview from '../components/PreviewText'
import { useWebContext } from '../context/WebContext'
import { replaceAdminUrlWithPublicUrl } from '../util/links'
import PictureUpload from './PictureUpload'
import SellingInfo from './SellingInfo'

function CourseDescriptionEditorPage(props) {
  const [context] = useWebContext()

  const [state, setState] = useState({ progress: props.progress ? Number(props.progress) : 1 })

  const { koppsData } = context
  const langIndex = koppsData.lang === 'en' ? 0 : 1
  const { storageUri } = context.browserConfig
  const { introLabel } = i18n.messages[langIndex]
  const [, { courseImage }] = i18n.messages
  let courseImageID = courseImage[koppsData.mainSubject]
  if (courseImageID === undefined) courseImageID = courseImage.default
  const defaultImageUrl = `${storageUri}${courseImageID}`
  const introText = introLabel[`step_${state.progress}_desc`]

  function doUpdateStates(states) {
    if (states) setState({ ...state, ...states })
  }

  React.useEffect(() => {
    let isMounted = true
    if (isMounted && typeof window !== 'undefined') replaceAdminUrlWithPublicUrl()
    return () => (isMounted = false)
  }, [])

  return (
    <div key="kursinfo-container" className="kursinfo-main-page col">
      <PageTitle
        key="title"
        courseTitleData={koppsData.courseTitleData}
        pageTitle={introLabel.editCourseIntro}
        language={koppsData.lang}
      />
      <ProgressBar active={state.progress} language={langIndex} introText={introText} />
      {(state.progress === 1 && (
        <PictureUpload
          defaultImageUrl={defaultImageUrl}
          introLabel={introLabel}
          koppsData={koppsData}
          updateParent={doUpdateStates}
        />
      )) ||
        (state.progress === 2 && <SellingInfo updateParent={doUpdateStates} />) || (
          <Preview introLabel={introLabel} defaultImageUrl={defaultImageUrl} updateParent={doUpdateStates} />
        )}
    </div>
  )
}

export default CourseDescriptionEditorPage
