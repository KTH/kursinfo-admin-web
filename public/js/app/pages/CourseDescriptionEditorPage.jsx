/* eslint-disable react/destructuring-assignment */
import React, { useState } from 'react'
import i18n from '../../../../i18n'
import PageTitle from '../components/PageTitle'
import ProgressBar from '../components/ProgressBar'
import Preview from '../components/PreviewText'
import { useWebContext } from '../context/WebContext'
import { replaceAdminUrlWithPublicUrl, replaceSiteUrl } from '../util/links'
import { hasImageBeenChanged, hasTextBeenChanged } from '../util/compareChanges'
import PictureUpload from './PictureUpload'
import SellingInfo from './SellingInfo'

function CourseDescriptionEditorPage(props) {
  const [context] = useWebContext()

  const [progress, setProgress] = useState(props.progress ? Number(props.progress) : 1)

  const [initImage, setInitImage] = useState(null)
  const [initTexts, setInitTexts] = useState(null)

  const { koppsData = {} } = context
  const { courseTitleData = {}, lang } = koppsData
  const { course_code: courseCode } = courseTitleData

  const langIndex = lang === 'en' ? 0 : 1
  const { storageUri } = context.browserConfig
  const { introLabel } = i18n.messages[langIndex]
  const [, { courseImage }] = i18n.messages
  let courseImageID = courseImage[koppsData.mainSubject]
  if (courseImageID === undefined) courseImageID = courseImage.default
  const defaultImageUrl = `${storageUri}${courseImageID}`
  const introText = introLabel[`step_${progress}_desc`]

  function updateProgress(progressNumber) {
    if (progressNumber) setProgress(progressNumber)
  }

  function setInitialImage(states) {
    if (!initImage && states) setInitImage(states)
  }

  function setInitialTexts(states) {
    if (!initTexts && states) setInitTexts(states)
  }
  // TEXT
  function isTextChangedAfterEditorClosed() {
    return hasTextBeenChanged(initTexts, context)
  }

  function isTextChangedWhileEditing(latestStateFromTextEditor) {
    return hasTextBeenChanged(initTexts, latestStateFromTextEditor)
  }

  // IMAGE

  function isImageChangedAfterEditorClosed() {
    return hasImageBeenChanged(initImage, context)
  }

  function isImageChangedWhileEditing(latestStateFromImageEditor) {
    return hasImageBeenChanged(initImage, latestStateFromImageEditor)
  }

  // BOTH: TEXT AND IMAGE

  function hasChangedWhileEditingImage(latestStateFromImageEditor) {
    return isTextChangedAfterEditorClosed() || isImageChangedWhileEditing(latestStateFromImageEditor)
  }

  function hasChangedWhileEditingText(latestStateFromTextEditor) {
    const hasSmthChanged = isImageChangedAfterEditorClosed() || isTextChangedWhileEditing(latestStateFromTextEditor)
    return hasSmthChanged
  }

  function hasSmthChangedAfterEditing() {
    return isTextChangedAfterEditorClosed() || isImageChangedAfterEditorClosed()
  }

  React.useEffect(() => {
    let isMounted = true
    if (isMounted && typeof window !== 'undefined') {
      replaceAdminUrlWithPublicUrl()
      replaceSiteUrl(courseCode, lang)
    }
    return () => (isMounted = false)
  }, [])

  return (
    <div key="kursinfo-container" className="kursinfo-main-page col">
      <PageTitle key="title" courseTitleData={courseTitleData} pageTitle={introLabel.editCourseIntro} language={lang} />
      <ProgressBar active={progress} language={langIndex} introText={introText} />
      {(progress === 1 && (
        <PictureUpload
          defaultImageUrl={defaultImageUrl}
          introLabel={introLabel}
          koppsData={koppsData}
          hasChanges={hasChangedWhileEditingImage}
          updateProgress={updateProgress}
          setInitialImage={setInitialImage}
        />
      )) ||
        (progress === 2 && (
          <SellingInfo
            hasSmthChanged={hasChangedWhileEditingText}
            setInitialTexts={setInitialTexts}
            updateProgress={updateProgress}
          />
        )) || (
          <Preview
            introLabel={introLabel}
            defaultImageUrl={defaultImageUrl}
            hasSmthChanged={hasSmthChangedAfterEditing}
            updateProgress={updateProgress}
          />
        )}
    </div>
  )
}

export default CourseDescriptionEditorPage
