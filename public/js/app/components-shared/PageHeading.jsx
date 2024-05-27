/**
 * "Page heading" used in admin apps. Not based on any KTH style component.
 * Needs style in admin version of "_shared.scss"
 *
 * Changelog:
 * - 2024-05-29 - initial version (added in release of kth-style 10 release of private apps)
 */
import React from 'react'

const PageHeading = ({ id, heading, subHeading }) => (
  <h1 id={id} className="page-heading">
    <span className="page-heading__heading">{heading}</span>
    <span className="page-heading__subHeading">{subHeading}</span>
  </h1>
)

export default PageHeading
