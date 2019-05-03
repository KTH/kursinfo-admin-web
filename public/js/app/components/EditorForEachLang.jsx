import TextBlock from './TextBlock.jsx'

const KoppsText = ({header, text, label}) => {
  return (
      <div className='courseIntroTextCollapse'>
        <div className='card collapsible blue'>
          <div className='card-header' role='tab' id={'headingWhite' + label} tabindex='0'>
            <h4 className='mb-0'>
              <a className='collapse-header' data-toggle='collapse' href={'#collapseWhite' + label} load='false' aria-expanded='false' aria-controls={'collapseWhite' + label}>{header}</a>
            </h4>
          </div>
          <div id={'collapseWhite' + label} className='collapse hide' role='tabpanel' aria-labelledby={'headingWhite' + label}>
            <div className='card-body  col'>
              <TextBlock text={text} />
            </div>
          </div>
        </div>
      </div>
      )
}

function EditorForEachLang (props) {
  const textLang = props.lang
  const side = textLang === 'sv' ? 'left' : 'right'
  const key = textLang === 'sv' ? 'leftEditorForSwedish' : 'rightEditorForSwedish'
  return (
    <span className={side} key={key}>
      <h3 className='text-center'>{props.sellingTextLabels}</h3>
      <KoppsText header={props.labelKopps} text={props.koppsCourseDesc} label={textLang} />
      <p>{props.sellingTextLabels.label_max_number_letters}</p>
        {props.children}
    </span>
    )
}

export default EditorForEachLang
