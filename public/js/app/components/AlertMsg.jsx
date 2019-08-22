import Alert from 'inferno-bootstrap/lib/Alert'
import { KTH_SE_URL, COURSE_INFO_URL, COURSE_UTVECKLING } from '../util/constants'

const AlertMsg = ({props, courseCode, translate, lang}) => {
  var params
  if (props.location.sellingDesciprion !== 'success') {
    params = props.location.search.substring(1).split('&')
      .map(param => param.split('='))
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {})
  }
  return (
    props.location.sellingDesciprion === 'success'
        ? <Alert color='success' aria-live='polite'>
          {translate.alertMessages.selling_description_success}
          <a href={`${KTH_SE_URL}${COURSE_INFO_URL}${courseCode}?l=${lang}`} alt={translate.course_info_title_alt}>{translate.course_info_title}</a>
        </Alert>
        : params.serv === 'kutv' && params.term && params.name
            ? params.event === 'save' || params.event === 'pub' || params.event === 'delete'
                ? <Alert color='success' aria-live='polite'>
                  <h4>{translate.alertMessages['kutv'][params.event]}</h4>
                  <p>{translate.alertMessages.term}: {translate.course_short_semester[params.term.toString().substring(4, 5)]}
                    {params.term.toString().substring(0, 4)}
                  </p>
                  <p>{translate.alertMessages.course_round}: {decodeURIComponent(params.name)}</p>
                  {params.event === 'pub'
                    ? <p>{translate.alertMessages.see_more} <a href={`${KTH_SE_URL}${COURSE_UTVECKLING}${courseCode}?l=${lang}`} alt={translate.course_dev_title_alt}>{translate.course_dev_title}</a></p>
                    : params.event === 'save'
                      ? <p>{translate.alertMessages.kutv.s_msg}</p>
                      : ''
                  }
                </Alert>
                : ''
            : ''
    )
}

export default AlertMsg