import React from 'react'

const KoppsTextCollapse = ({ lang, instructions, koppsText }) => (
  <div className="courseIntroTextCollapse">
    <h3>{instructions.langLabelText[lang]}</h3>
    <details>
      <summary className="blue">{instructions.langLabelKopps[lang]}</summary>
      <div>
        <span className="textBlock" dangerouslySetInnerHTML={{ __html: koppsText }} />
      </div>
    </details>
    <h4>{instructions.langLabelIntro[lang]}</h4>
  </div>
)

export default KoppsTextCollapse
