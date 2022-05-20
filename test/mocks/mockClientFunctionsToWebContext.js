import { addClientFunctionsToWebContext } from '../../public/js/app/client-context/addClientFunctionsToWebContext'

function mockClientFunctionsToWebContext() {
  addClientFunctionsToWebContext.mockReturnValue({
    doUpsertItem: (text, courseCode, imageName) => {
      return new Promise((resolve, reject) => {
        resolve({ status: 200 })
      })
    },
  })
}

export { mockClientFunctionsToWebContext }
