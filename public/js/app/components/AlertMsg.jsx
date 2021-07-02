import React from 'react'
import { Alert } from 'reactstrap'
import { COURSE_INFO_URL, COURSE_PMDATA_URL, COURSE_UTVECKLING, ADMIN_COURSE_PM_DATA } from '../util/constants'

const _fetchParameters = props => {
  let params = {}
  if (props && props.location && props.location.sellingDesciprion !== 'success') {
    params = props.location.search
      .substring(1)
      .split('&')
      .map(param => param.split('='))
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {})
  }
  return params
}

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
    save: ADMIN_COURSE_PM_DATA,
    removedPublished: ADMIN_COURSE_PM_DATA + 'published/',
  },
}

const AlertMsg = ({ props, courseCode, translate = {}, lang = 'en' }) => {
  const hostUrl = `https://${window.location.href.replace('app', 'www').split('/')[2]}`
  const params = _fetchParameters(props)
  const { event: doneAction, name: courseRoundName, serv: serviceAbbr, term } = params

  const publicService = params && serviceAbbr ? `${hostUrl}${publicUrls[serviceAbbr]}` : `${hostUrl}${COURSE_INFO_URL}`

  // eslint-disable-next-line camelcase
  const { alertMessages, course_short_semester } = translate

  return (
    (serviceAbbr === 'kutv' || serviceAbbr === 'pm' || serviceAbbr === 'pmdata' || serviceAbbr === 'kinfo') &&
    (doneAction === 'save' || doneAction === 'pub' || doneAction === 'delete' || doneAction === 'removedPublished') && (
      <Alert color="success" aria-live="polite">
        <h4>{alertMessages[serviceAbbr][doneAction]}</h4>
        {term && (
          <p>
            {`${alertMessages.term}: ${course_short_semester[term.toString().substring(4, 5)]}${term
              .toString()
              .substring(0, 4)}`}
          </p>
        )}
        {courseRoundName && <p>{`${alertMessages.course_round}: ${decodeURIComponent(courseRoundName)}`}</p>}
        {doneAction === 'pub' ? (
          <p>
            {`${alertMessages.see_more} `}
            <a href={`${publicService}${courseCode}?l=${lang}`} alt={translate.links_to[serviceAbbr].aAlt}>
              {translate.links_to[serviceAbbr].aTitle}
            </a>
          </p>
        ) : (
          (doneAction === 'save' || doneAction === 'removedPublished') && (
            <p>
              {doneAction === 'save' ? alertMessages[serviceAbbr].s_msg : alertMessages[serviceAbbr].r_msg}
              {mapAdminUrl[serviceAbbr] && (
                <a
                  href={`${mapAdminUrl[serviceAbbr][doneAction]}${courseCode}?l=${lang}`}
                  alt={alertMessages[serviceAbbr].fast_admin_link_label[doneAction]}
                >
                  {alertMessages[serviceAbbr].fast_admin_link_label[doneAction]}
                </a>
              )}
            </p>
          )
        )}
      </Alert>
    )
  )
}

export default AlertMsg
