import Alert from 'inferno-bootstrap/lib/Alert'
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
  console.log('params', params)
  const serviceName = (params && params.serv === 'kutv') ? COURSE_UTVECKLING : COURSE_INFO_URL
  return (
    props.location.sellingDesciprion === 'success'
        ? <Alert color='success' aria-live='polite'>
          {translate.alertMessages.selling_description_success}
          <a href={`${KTH_SE_URL}${COURSE_INFO_URL}${courseCode}?l=${lang}`} alt={translate.links_to.kinfo.a_title_alt}>{translate.links_to.kinfo.a_title}</a>
        </Alert>
        : params && (params.serv === 'kutv' || params.serv === 'pm') && params.term
            ? params.event === 'save' || params.event === 'pub' || params.event === 'delete'
                ? <Alert color='success' aria-live='polite'>
                  <h4>{translate.alertMessages[params.serv][params.event]}</h4>
                  <p>{translate.alertMessages.term}: {translate.course_short_semester[params.term.toString().substring(4, 5)]}
                    {params.term.toString().substring(0, 4)}
                  </p>
                  {params.name
                    ? <p>{translate.alertMessages.course_round}: {decodeURIComponent(params.name)}</p>
                    : ''
                  }
                  {params.event === 'pub'
                    ? <p>{translate.alertMessages.see_more} <a href={`${KTH_SE_URL}${serviceName}${courseCode}?l=${lang}`} alt={translate.links_to[params.serv].a_title_alt}>{translate.links_to[params.serv].a_title}</a></p>
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
