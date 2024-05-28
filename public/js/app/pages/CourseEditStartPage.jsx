import React from 'react'

import i18n from '../../../../i18n'
import ControlButtons from '../components/ControlButtons'
import KoppsErrorPage from '../components/KoppsErrorPage'
import PageTitle from '../components/PageTitle'
import { useWebContext } from '../context/WebContext'

const options = ['description', 'otherInformation']

function CourseEditStartPage() {
  const [selectedOption, setSelectedOption] = React.useState(options[0])
  const [context] = useWebContext()
  const labels = i18n.messages[context.langIndex].editCourseStart
  const { courseData, editOptions } = context.routeData
  const pageTitleProps = { courseTitleData: courseData, pageTitle: labels.pageHeader }

  if (context.koppsApiError) {
    return <KoppsErrorPage pageTitleProps={pageTitleProps} />
  }

  const targetLink = editOptions[selectedOption]

  return (
    <div className="kursinfo-main-page edit-start-page">
      <PageTitle {...pageTitleProps} />
      <div className="edit-start-page__intro">
        <p>{labels.intro}</p>
      </div>

      <h2>{labels.header}</h2>

      <div className="form-group">
        {options.map(name => (
          <div key={name} className="form-check form-group">
            <input
              type="radio"
              id={name}
              name="editOption"
              value={name}
              checked={selectedOption === name}
              onChange={e => setSelectedOption(e.target.value)}
            />
            <label htmlFor={name}> {labels.options[name]}</label>
          </div>
        ))}
      </div>

      <ControlButtons
        pageState={{ courseCode: courseData.courseCode }}
        next={{
          label: labels.nextButton,
          href: targetLink,
        }}
      />
    </div>
  )
}

export default CourseEditStartPage
