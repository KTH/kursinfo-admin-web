import Row from 'inferno-bootstrap/dist/Row'
import Col from 'inferno-bootstrap/dist/Col'
import Button from 'inferno-bootstrap/lib/Button'
import {Link} from 'inferno-router'
import i18n from '../../../../i18n'

function TextBlock ({text}) {
  return (
      <span className='textBlock' dangerouslySetInnerHTML={{__html: text}}>
      </span>
      )
}

function PreviewContainer ({courseAdminData, src}) {
  const lang = courseAdminData.lang === 'en' ? 0 : 1

  return (
    <Row>
        <Col sm='1' xs='1'></Col>
        <Col sm='10' xs='12'>
        <Row className='courseIntroText'>
            <Col>
            <h3>{i18n.messages[lang].sellingTextLabels.label_sv}</h3>
            <img src={src} alt={i18n.messages[lang].altLabel.image} height='auto' width='300px' />
            {/* {this.state.sellingText_sv === '' ? <TextBlock text={courseAdminData.koppsCourseDesc.sv} /> : <TextBlock text={this.state.sellingText_sv} />} */}
            </Col>
        </Row>
        <Row className='courseIntroText'>
            <Col>
            <h3>{i18n.messages[lang].sellingTextLabels.label_en}</h3>
            <img src={src} alt={i18n.messages[lang].altLabel.image} height='auto' width='300px' />
            {/* {this.state.sellingText_en === '' ? <TextBlock text={courseAdminData.koppsCourseDesc.en} /> : <TextBlock text={this.state.sellingText_en} />} */}
            </Col>
        </Row>
        <Row className='button_group'>
            <Link to={`/admin/kurser/kurs/${courseAdminData.courseTitleData.course_code}?l=${courseAdminData.lang}`} className='btn btn-secondary'>
            {i18n.messages[lang].sellingTextButtons.button_cancel}
            </Link>
            <Button color='primary' alt={i18n.messages[lang].altLabel.button_cancel}>{i18n.messages[lang].sellingTextButtons.button_change}</Button>
            <Button color='success' alt={i18n.messages[lang].altLabel.button_submit}>{i18n.messages[lang].sellingTextButtons.button_submit}</Button>
        </Row>
        </Col>
    </Row>
  )
}

export default PreviewContainer
