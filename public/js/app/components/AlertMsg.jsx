import React, { Component } from 'react'
import { Alert } from 'reactstrap'
import { KTH_SE_URL, COURSE_INFO_URL, COURSE_UTVECKLING } from '../util/constants'

const _fetchParameters = (props) => {
  var params
  if (props.location.sellingDesciprion !== 'success') {
    params = props.location.search.substring(1).split('&')
      .map(param => param.split('='))
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {})
  }
  return params
}

const AlertMsg = ({props, courseCode, translate, lang}) => {
  const params = _fetchParameters(props)
  const serviceName = (params && params.serv === 'kutv') ? COURSE_UTVECKLING : COURSE_INFO_URL
  return (
    params.serv === 'kutv' || params.serv === 'pm' || params.serv === 'kinfo'
    ? params.event === 'save' || params.event === 'pub' || params.event === 'delete'
        ? <Alert color='success' aria-live='polite'>
          <h4>{translate.alertMessages[params.serv][params.event]}</h4>
          {params.term
            ? <p>{translate.alertMessages.term}: {translate.course_short_semester[params.term.toString().substring(4, 5)]}
              {params.term.toString().substring(0, 4)}
            </p>
            : ''
          }
          {params.name
            ? <p>{translate.alertMessages.course_round}: {decodeURIComponent(params.name)}</p>
            : ''
          }
          {params.event === 'pub'
            ? <p>{translate.alertMessages.see_more} <a href={`${KTH_SE_URL}${serviceName}${courseCode}?l=${lang}`} alt={translate.links_to[params.serv].aAlt}>{translate.links_to[params.serv].aTitle}</a></p>
            : params.event === 'save'
              ? <p>{translate.alertMessages[params.serv].s_msg}</p>
              : ''
          }
        </Alert>
        : ''
    : ''
  )
}

export default AlertMsg
