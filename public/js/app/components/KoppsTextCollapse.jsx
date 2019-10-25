import React, { Component } from 'react'
import { Collapse } from 'reactstrap'

class KoppsTextCollapse extends Component {
  constructor (props) {
    super(props)
    this.state = {collapse: false}
    this.toggleHeader = this.toggleHeader.bind(this)
  }

  toggleHeader () {
    this.setState(state => ({collapse: !state.collapse}))
  }

  render () {
    const { lang, instructions, koppsText } = this.props
    return (
      <div className='courseIntroTextCollapse'>
        <h3>{instructions.langLabelText[lang]}</h3>
        <div className='card collapsible blue'>
          <div className='card-header' role='tab' tabIndex='0' onClick={this.toggleHeader}>
            <h4 className='mb-0' id={'koppsShortDesc' + lang}>
              <a className='collapse-header' href={'#koppsText' + lang} load='false' aria-expanded={this.state.collapse} aria-controls={'koppsShortDesc' + lang}>
                {instructions.langLabelKopps[lang]}
              </a>
            </h4>
          </div>
          <Collapse isOpen={this.state.collapse} toggler={'#koppsShortDesc' + lang} aria-labelledby={'koppsShortDesc' + lang}>
            <div className='card-body  col'>
              <span className='textBlock' dangerouslySetInnerHTML={{__html: koppsText}}></span>
            </div>
          </Collapse>
        </div>
        <h4>{instructions.langLabelIntro[lang]}</h4>
        <p>{instructions.label_max_number_letters}</p>
      </div>
    )
  }
}

export default KoppsTextCollapse
