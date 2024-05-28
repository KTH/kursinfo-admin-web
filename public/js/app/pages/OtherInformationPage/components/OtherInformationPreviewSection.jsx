import React from 'react'

const OtherInformationPreviewSection = ({ header, value }) => (
  <div className="PreviewSection">
    <h3>{header}</h3>
    <div>{value && <div className="PreviewSection__textBlock" dangerouslySetInnerHTML={{ __html: value }} />}</div>
  </div>
)

export default OtherInformationPreviewSection
