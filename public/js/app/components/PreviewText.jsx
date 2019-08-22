import Row from 'inferno-bootstrap/dist/Row'
import Col from 'inferno-bootstrap/dist/Col'

function PreviewText ({sellingTextLabels, whichLang, imageUrl, sellingText, koppsTexts}) {
  const text = sellingText === '' ? koppsTexts[whichLang] : sellingText
  return (
    <Row className='courseIntroText'>
      <Col sm='12' xs='12' className='sellingText'>
        <h3>{sellingTextLabels.langLabel[whichLang]}</h3>
        <img src={imageUrl} alt={sellingTextLabels.altLabel.image} height='auto' width='300px' />
        <span className='textBlock' dangerouslySetInnerHTML={{__html: text}}></span>
      </Col>
    </Row>
    )
}

export default PreviewText
