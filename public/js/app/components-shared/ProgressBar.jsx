/**
 * "Progress bar" used in admin apps. Not based on any KTH style component.
 * Needs style in admin version of "_shared.scss"
 *
 * Changelog:
 * - 2024-05-29 - initial version (added in release of kth-style 10 release of private apps)
 */
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
              {index + 1}. {step.title}
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
