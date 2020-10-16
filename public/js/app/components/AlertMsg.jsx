import React from 'react'
import { Alert } from 'reactstrap'
import {
  COURSE_INFO_URL,
  COURSE_PMDATA_URL,
  COURSE_UTVECKLING,
  ADMIN_COURSE_PM_DATA
} from '../util/constants'

const _fetchParameters = (props) => {
  let params
  if (props.location.sellingDesciprion !== 'success') {
    params = props.location.search
      .substring(1)
      .split('&')
      .map((param) => param.split('='))
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {})
  }
  return params
}

const publicUrls = {
  pm: COURSE_INFO_URL,
  kutv: COURSE_UTVECKLING,
  kinfo: COURSE_INFO_URL,
  pmdata: COURSE_PMDATA_URL
}
const mapAdminUrl = {
  // pm: ADMIN_COURSE_PM,
  // kutv: ADMIN_COURSE_UTV,
  // kinfo: ADMIN_OM_COURSE,
  pmdata: {
    save: ADMIN_COURSE_PM_DATA,
    removedPublished: ADMIN_COURSE_PM_DATA + 'published/'
  }
}

const AlertMsg = ({ props, courseCode, translate, lang }) => {
  const hostUrl = `https://${window.location.href.replace('app', 'www').split('/')[2]}`
  const params = _fetchParameters(props)
  const { event, serv, term, name } = params

  const publicService =
    params && serv ? `${hostUrl}${publicUrls[serv]}` : `${hostUrl}${COURSE_INFO_URL}`

  return (
    (serv === 'kutv' || serv === 'pm' || serv === 'pmdata' || serv === 'kinfo') &&
    (event === 'save' || event === 'pub' || event === 'delete' || event === 'removedPublished') && (
      <Alert color="success" aria-live="polite">
        <h4>{translate.alertMessages[serv][event]}</h4>
        {term && (
          <p>
            {translate.alertMessages.term}:{' '}
            {translate.course_short_semester[term.toString().substring(4, 5)]}
            {term.toString().substring(0, 4)}
          </p>
        )}
        {name && (
          <p>
            {translate.alertMessages.course_round}:{decodeURIComponent(name)}
          </p>
        )}
        {event === 'pub' ? (
          <p>
            {translate.alertMessages.see_more}{' '}
            <a href={`${publicService}${courseCode}?l=${lang}`} alt={translate.links_to[serv].aAlt}>
              {translate.links_to[serv].aTitle}
            </a>
          </p>
        ) : (
          (event === 'save' || event === 'removedPublished') && (
            <p>
              {event === 'save'
                ? translate.alertMessages[serv].s_msg
                : translate.alertMessages[serv].r_msg}
              {mapAdminUrl[serv] && (
                <a
                  href={`${mapAdminUrl[serv][event]}${courseCode}?l=${lang}`}
                  alt={translate.alertMessages[serv].fast_admin_link_label[event]}
                >
                  {translate.alertMessages[serv].fast_admin_link_label[event]}
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
