import React from 'react'

/**
 *
 * @param {*} steps should be an array with labels and optional intro text for steps in progressbar { label: string, intro?: string }
 * @returns progressbar state
 */
const useProgressBar = steps => {
  const [current, setCurrent] = React.useState(0)

  return {
    current,
    steps,
    goToNext: () => {
      setCurrent(Math.min(current + 1, steps.length - 1))
    },
    goToPrevious: () => {
      setCurrent(Math.max(current - 1, 0))
    },
  }
}

const ProgressBar = ({ current, steps }) => {
  const currentStep = steps[current]

  return (
    <div className="progress-bar-container">
      <div className="progress-bar">
        {steps.map((step, index) => (
          <div key={index} className={`progress-bar-item ${current === index ? 'progress-active' : ''}`}>
            <span>
              {index + 1}. {step.label}
            </span>
          </div>
        ))}
      </div>
      {currentStep.intro && (
        <div>
          <p data-testid="intro-text">{currentStep.intro}</p>
        </div>
      )}
    </div>
  )
}

export { useProgressBar }

export default ProgressBar
