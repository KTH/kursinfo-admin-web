import Alert from 'inferno-bootstrap/lib/Alert'
import { KTH_SE_URL, COURSE_INFO_URL, COURSE_UTVECKLING } from '../util/constants'

const AlertMsg = ({props, courseCode, translate, lang}) => {
    // TODO: RETURN KTH SE
  var params
  if (props.location.sellingDesciprion !== 'success') {
    params = props.location.search.substring(1).split('&').map(param => param.split('=')).reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {})
  }
  return (
    props.location.sellingDesciprion === 'success'
        ? <Alert color='success' aria-live='polite'>
          {translate.alertMessages.selling_description_success}
          <a href={`${KTH_SE_URL}${COURSE_INFO_URL}${courseCode}?l=${lang}`} alt={translate.course_info_title_alt}>{translate.course_info_title}</a>
        </Alert>
        : params.serv === 'kutv' && params.term && params.name
            ? params.ev === 's' || params.ev === 'p' || params.ev === 'd'
                ? <Alert color='success' aria-live='polite'>
                  <h4>{translate.alertMessages['kutv'][params.ev]}</h4>
                  <p>{translate.alertMessages.term}: {params.term}</p>
                  <p>{translate.alertMessages.course_round}: {decodeURIComponent(params.name)}</p>
                  {params.ev === 'p'
                    ? <p>{translate.alertMessages.see_more} <a href={`${KTH_SE_URL}${COURSE_UTVECKLING}${courseCode}?l=${lang}`} alt={translate.course_dev_title_alt}>{translate.course_dev_title}</a></p>
                    : params.ev === 's'
                      ? <p>{translate.alertMessages.kutv.s_msg}</p>
                      : ''
                  }
                </Alert>
                : ''
            : ''
    )
}

export default AlertMsg
