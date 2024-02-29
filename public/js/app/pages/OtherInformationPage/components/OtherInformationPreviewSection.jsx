import React from 'react'

const OtherInformationPreviewSection = ({ header, value }) => {
  return (
    <div className="PreviewSection">
      <span className="title_and_info">
        <h3>{header}</h3>
      </span>
      <div>{value && <div className="PreviewSection__textBlock" dangerouslySetInnerHTML={{ __html: value }} />}</div>
    </div>
  )
}

export default OtherInformationPreviewSection
