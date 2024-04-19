import React from 'react'
import i18n from '../../../../../../i18n'
import { parseCourseName } from '../../../components/PageTitle'
import { useWebContext } from '../../../context/WebContext'

const DescriptionPreviewSection = ({ pageState, lang }) => {
  const [context] = useWebContext()

  const imageUrl = pageState.imageInput.previewImageUrl
  const { values } = pageState.textInput
  const courseTitle = parseCourseName(context.routeData.courseData, context.langIndex, lang)
  const step1Labels = i18n.messages[context.langIndex].editDescription.step1
  const labels = i18n.messages[context.langIndex].editDescription.step3

  const isSwe = lang === 'sv'
  const headers = isSwe ? labels.headersSv : labels.headersEn
  const sellingText = isSwe ? values.sellingTextSv : values.sellingTextEn
  const courseDisposition = isSwe ? values.courseDispositionSv : values.courseDispositionEn

  return (
    <div className="PreviewSection">
      <h1>{courseTitle}</h1>
      <p id="page-sub-heading">{headers.page}</p>

      <div className="PreviewSection__imageSection">
        <img src={imageUrl} alt={step1Labels.image.alt} className="PreviewSection__image" />
        <div>
          {sellingText && (
            <div className="PreviewSection__textBlock" dangerouslySetInnerHTML={{ __html: sellingText }} />
          )}
        </div>
      </div>

      <div>
        <h2>{headers.content}</h2>
        {courseDisposition && (
          <div>
            <h3>{headers.courseDisposition}</h3>
            <div className="PreviewSection__textBlock" dangerouslySetInnerHTML={{ __html: courseDisposition }} />
          </div>
        )}
      </div>
    </div>
  )
}

export default DescriptionPreviewSection
