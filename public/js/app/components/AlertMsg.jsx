import React from 'react'
import Alert from '../components-shared/Alert'
import { COURSE_INFO_URL, COURSE_PMDATA_URL, COURSE_UTVECKLING, ADMIN_COURSE_PM_DATA } from '../util/constants'

const publicUrls = {
  pm: COURSE_PMDATA_URL,
  kutv: COURSE_UTVECKLING,
  kinfo: COURSE_INFO_URL,
  pmdata: COURSE_PMDATA_URL,
}
const mapAdminUrl = {
  // kutv: ADMIN_COURSE_UTV,
  // kinfo: ADMIN_OM_COURSE,
  pmdata: {
    save: {
      create: ADMIN_COURSE_PM_DATA,
      change: ADMIN_COURSE_PM_DATA + 'published/',
    },
    removedPublished: ADMIN_COURSE_PM_DATA + 'published/',
  },
}
const publishedActions = ['pub', 'pub_changed']

const services = ['kinfo', 'kutv', 'pm', 'pmdata']
const actions = ['delete', 'save', 'removedPublished', ...publishedActions]

const AlertMsg = ({ querySearchParams, courseCode, translate = {}, lang = 'en', publicPagesHref }) => {
  if (!querySearchParams) return null

  const {
    event: doneAction,
    name: courseRoundName,
    serv: serviceAbbr,
    term: semester,
    from: origin,
    ver,
    memoendpoint: memoEndPoint,
    ladokRound,
  } = querySearchParams
  if (!services.includes(serviceAbbr)) return null
  if (!actions.includes(doneAction)) return null
  const publicServiceHostUrl =
    querySearchParams && serviceAbbr
      ? `${publicPagesHref}${publicUrls[serviceAbbr]}`
      : `${publicPagesHref}${COURSE_INFO_URL}`
  const { alertMessages, course_short_semester: shortSemester } = translate
  const semesterLabel = semester
    ? `${shortSemester[semester.toString().substring(4, 5)]} ${semester.toString().substring(0, 4)}`
    : null

  return (
    <Alert type="success" header={alertMessages[serviceAbbr][doneAction]}>
      {semester && <p>{`${alertMessages.semester}: ${semesterLabel}`}</p>}
      {courseRoundName && <p>{`${alertMessages.course_offering}: ${decodeURIComponent(courseRoundName)}`}</p>}
      {publishedActions.includes(doneAction) ? (
        <>
          <p>{ver && `Version: ${decodeURIComponent(ver)} `}</p>
          <p>
            {`${alertMessages[serviceAbbr].see_more} `}
            <a
              href={`${publicServiceHostUrl}${courseCode}${
                serviceAbbr === 'pmdata' ? `/${memoEndPoint}` : ''
              }?l=${lang}`}
              aria-label={translate.links_to[serviceAbbr].ariaLabel}
            >
              {`${translate.links_to[serviceAbbr].aTitle} `}
              {semester && serviceAbbr !== 'pm'
                ? ` ${semesterLabel}${serviceAbbr === 'pmdata' ? `-${ladokRound}` : ''}`
                : ''}
            </a>
          </p>
        </>
      ) : (
        (doneAction === 'save' || doneAction === 'removedPublished') && (
          <p>
            {doneAction === 'save' ? alertMessages[serviceAbbr].s_msg : alertMessages[serviceAbbr].r_msg}
            {mapAdminUrl[serviceAbbr] && (
              <a
                href={`${mapAdminUrl[serviceAbbr][doneAction][origin]}${courseCode}?l=${lang}`}
                aria-label={alertMessages[serviceAbbr].fast_admin_link_label[doneAction][origin]}
              >
                {alertMessages[serviceAbbr].fast_admin_link_label[doneAction][origin]}
              </a>
            )}
          </p>
        )
      )}
    </Alert>
  )
}

export default AlertMsg
