import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import '@babel/runtime/regenerator'
import mockWebContext from './mocks/mockWebContext'
import { mockClientFunctionsToWebContext } from './mocks/mockClientFunctionsToWebContext'
import CourseDescriptionEditorPage from '../public/js/app/pages/CourseDescriptionEditorPage'
import { WebContextProvider } from '../public/js/app/context/WebContext'

jest.mock('../public/js/app/client-context/addClientFunctionsToWebContext')

const renderEditPage = (newWebContext = {}, pageNumber) => {
  return render(
    <WebContextProvider
      configIn={{
        ...mockWebContext,
        ...newWebContext,
      }}
    >
      <CourseDescriptionEditorPage progress={pageNumber} />
    </WebContextProvider>
  )
}

const renderWithState = (stateToSet = {}, pageNumber) => {
  const newWebContext = Object.assign(Object.assign({}, mockWebContext), stateToSet)
  return renderEditPage(newWebContext, pageNumber)
}

describe('<CourseDescriptionEditorPage> (and subordinates)', () => {
  beforeAll(() => mockClientFunctionsToWebContext())
  afterAll(() => {
    jest.clearAllMocks()
  })

  test('Has correct main heading', () => {
    renderEditPage()
    const allH1Headers = screen.getAllByRole('heading', { level: 1 })
    expect(allH1Headers.length).toBe(1)
    expect(allH1Headers[0]).toHaveTextContent(/^Redigera introduktion till kursenSF1624 Algebra och geometri 7,5 hp/)
  })

  describe('Page 1A Välj Bild', () => {
    beforeAll(() => mockClientFunctionsToWebContext())
    afterAll(() => {
      jest.clearAllMocks()
    })

    test('Has correct name in progress bar', () => {
      renderEditPage().getByText('1. Välj bild')
    })

    test('Has correct heading', () => {
      const heading = renderEditPage().getByTestId('intro-heading')
      expect(heading).toHaveTextContent(/^Välj bild$/) // exact match
    })

    test('Has correct introductory text', () => {
      const introText = renderEditPage().getByTestId('intro-text')
      expect(introText).toHaveTextContent(
        'I steg 1 av 3 väljer du en bild att visa på sidan Inför kursval. I steg 2 av 3 lägger du in eller redigerar den inledande texten. I steg 3 av 3 granskar du bild och text för att sedan publicera.'
      )
    })
  })

  describe('Page 1B Ingen bild vald', () => {})

  const PUBLISHED_IMAGE_EXISTS = {
    isDefaultChosen: false,
    isApiPicAvailable: true,
    tempImagePath: undefined,
  }

  const IMAGE_SELECTED_FOR_UPLOAD = {
    isDefaultChosen: false,
    isApiPicAvailable: false,
    tempImagePath: 'ImageThatWasSelectedForUpload.png',
  }

  const OVERWRITE_PUBLISHED_IMAGE = {
    isDefaultChosen: false,
    isApiPicAvailable: true,
    tempImagePath: 'ImageThatWasSelectedForUpload.png',
  }

  describe('Page 1C Bildval felaktigt', () => {
    beforeAll(() => mockClientFunctionsToWebContext())
    afterAll(() => {
      jest.clearAllMocks()
    })
    const expectedAlert =
      'Du behöver välja en bild med rätt format (se markering i rött nedan) för att kunna gå vidare till ”Redigera text”.'
    const expectedErrorMessage = 'Obligatoriskt (format: .png eller .jpg)'

    test('Has correct alert text and error message (no image selected)', async () => {
      const { getByText, getByLabelText, getByRole, getByTestId, queryByTestId } = renderEditPage()

      expect(getByLabelText('Standardbild utifrån kursens huvudområde').checked).toBeTruthy()
      expect(getByLabelText('Egen bild').checked).toBeFalsy()
      getByLabelText('Egen bild').click()

      //No error message visible initially
      expect(queryByTestId('error-text')).toBeFalsy()

      getByText('Redigera text').click()

      //Alert and Error Message assertion
      expect(getByRole('alert')).toHaveTextContent(expectedAlert)
      const errorMessageSpan = getByTestId('error-text')
      expect(errorMessageSpan).toHaveTextContent(expectedErrorMessage)
    })

    test('Has correct alert text and error message (wrong format chosen)', () => {
      const { getByLabelText, getByRole, getByTestId, queryByTestId } = renderEditPage()

      expect(getByLabelText('Standardbild utifrån kursens huvudområde').checked).toBeTruthy()
      expect(getByLabelText('Egen bild').checked).toBeFalsy()
      getByLabelText('Egen bild').click()

      //No error message visible initially
      expect(queryByTestId('error-text')).toBeFalsy()

      //simulate file upload with incorrect format
      const imageInput = getByTestId('fileUpload')
      fireEvent.change(imageInput, {
        target: {
          files: [new File(['(⌐□_□)'], 'empty.txt', { type: 'text' })],
        },
      })

      //Alert and Error Message assertion
      expect(getByRole('alert')).toHaveTextContent(expectedAlert)
      const errorMessageSpan = getByTestId('error-text')
      expect(errorMessageSpan).toHaveTextContent(expectedErrorMessage)
    })
  })

  describe('Page 1D Första egen bild valt', () => {})

  describe('Page 1E Tidigare val av egen bild', () => {})

  describe('Page 1F Valt om till, ytterligare ny egen bild', () => {})

  describe('Page 1G Valt om, ämnesbild', () => {
    beforeAll(() => mockClientFunctionsToWebContext())
    afterAll(() => {
      jest.clearAllMocks()
    })

    const useDefaultImage = 'Standardbild utifrån kursens huvudområde'
    const expected =
      'Observera att den egna valda bilden som nu är publicerad kommer att raderas när du publicerar i steg 3.'

    test('Has correct alert text (published image, switch to default)', () => {
      const { getByRole, getByLabelText } = renderWithState(PUBLISHED_IMAGE_EXISTS)
      getByLabelText(useDefaultImage).click()
      expect(getByRole('alert')).toHaveTextContent(expected)
    })

    test('No alert (no published image, upload image, switch to default)', () => {
      const { queryByRole, getByLabelText } = renderWithState(IMAGE_SELECTED_FOR_UPLOAD)
      getByLabelText(useDefaultImage).click()
      expect(queryByRole('alert')).toBeFalsy()
    })

    test('Can go to next page (upload image, switch to default) - used to be a bug', () => {
      const { getByText, getByLabelText } = renderWithState(IMAGE_SELECTED_FOR_UPLOAD)
      getByLabelText(useDefaultImage).click()
      getByText('Redigera text').click()
      expect(getByText('Granska')).toBeInTheDocument()
    })

    test('Has correct alert text (published image, upload image, switch to default)', () => {
      const { getByRole, getByLabelText, getByTestId } = renderWithState(OVERWRITE_PUBLISHED_IMAGE)
      getByLabelText(useDefaultImage).click()
      expect(getByRole('alert')).toHaveTextContent(expected)
    })
  })

  describe('Page 1H Godkänna villkor', () => {
    beforeAll(() => mockClientFunctionsToWebContext())
    afterAll(() => {
      jest.clearAllMocks()
    })

    const expected =
      'Du behöver godkänna villkoren (se markering i rött nedan) för att kunna gå vidare till ”Redigera text”.'

    test('Has correct alert text (selected image, not agreed to terms)', () => {
      const { getByRole, getByTestId } = renderWithState(IMAGE_SELECTED_FOR_UPLOAD)
      getByTestId('termsAgreement').click()
      getByTestId('termsAgreement').click()
      expect(getByRole('alert')).toHaveTextContent(expected)
    })

    test('Must tick box to continue if image was uploaded', () => {
      const { getByLabelText, getByTestId, getByText, getByRole, queryByRole, queryByTestId } =
        renderWithState(IMAGE_SELECTED_FOR_UPLOAD)
      expect(getByLabelText('Standardbild utifrån kursens huvudområde').checked).toBeFalsy()
      expect(getByLabelText('Egen bild').checked).toBeTruthy()

      //No error message visible initially
      expect(queryByTestId('error-text')).toBeFalsy()

      getByText('Redigera text').click()

      // Expect alert, error message and a disabled button
      expect(getByRole('alert')).toHaveTextContent(expected)
      const errorText = getByTestId('error-text')
      expect(errorText).toHaveClass('error-label')
      expect(getByText('Redigera text').disabled).toBeTruthy()

      getByTestId('termsAgreement').click()

      // Expect no alert, no error message and an enabled button
      expect(queryByRole('alert')).toBeFalsy()
      expect(queryByTestId('error-text')).toBeFalsy()
      expect(getByText('Redigera text').disabled).toBeFalsy()
    })
  })

  describe('Page 2 Redigera introduktion till kursen', () => {
    beforeAll(() => mockClientFunctionsToWebContext())
    afterAll(() => {
      jest.clearAllMocks()
    })

    test('Has correct introductory text', () => {
      const pageNumber = 2
      const { getByTestId } = renderEditPage({}, pageNumber)
      const introText = getByTestId('intro-text')
      expect(introText).toHaveTextContent('Här lägger du in en text som beskriver kursen.')
      expect(introText).toHaveTextContent('Texten kommer att visas för din kurs på sidan Inför kursval.')
      expect(introText).toHaveTextContent(
        'Det kan finnas en beskrivande text inlagd sedan tidigare via Kopps/Ladok, men om du lägger in en text här är det den som visas på sidan Inför kursval.'
      )
    })
  })

  describe('Page 3 Granska', () => {
    beforeAll(() => mockClientFunctionsToWebContext())

    afterAll(() => {
      jest.clearAllMocks()
    })

    const pageNumber = 3

    test('Has correct introductory text', () => {
      const introText = renderEditPage({}, pageNumber).getByTestId('intro-text')
      expect(introText).toHaveTextContent('')
    })

    test('Has correct headings', () => {
      const { getByText } = renderEditPage({}, pageNumber)
      getByText('Svensk introduktion till kursen')
      getByText('Engelsk introduktion till kursen')
    })
  })

  describe('Page 3B Att tänka på innan du publicerar', () => {
    beforeAll(() => mockClientFunctionsToWebContext())

    afterAll(() => {
      jest.clearAllMocks()
    })

    const pageNumber = 3

    test('Has correct modal text', async () => {
      const { getByText } = renderWithState({}, pageNumber)
      getByText('Publicera').click()
      expect(getByText(/Kurs: SF1624/)).toBeTruthy()
      const regExpected = /Publicering kommer att ske på sidan ”Inför kursval”\./
      expect(getByText(regExpected)).toBeTruthy()
      expect(getByText(/Vill du fortsätta att publicera?/)).toBeTruthy()
    })
  })

  describe('Page 3C Publicering fel', () => {
    beforeAll(() => mockClientFunctionsToWebContext())
    afterAll(() => {
      jest.clearAllMocks()
    })

    const pageNumber = 3

    test('Has correct alert text', async () => {
      const oldXMLHttpRequest = window.XMLHttpRequest
      window.XMLHttpRequest = jest.fn(() => {
        return {
          upload: {
            addEventListener: jest.fn(() => {
              throw 'trigger error state, for test purposes'
            }),
          },
        }
      })

      const { getByText, findByRole, getByRole } = await renderWithState(IMAGE_SELECTED_FOR_UPLOAD, pageNumber)
      fireEvent.click(getByText('Publicera'))
      await fireEvent.click(getByText('Ja, fortsätt publicera'))
      await waitFor(() => {
        const alert = getByRole('alert')

        expect(alert).toHaveTextContent(
          'Det gick inte att publicera den bild du valt. Gå tillbaka till ”Välj bild” för att byta bild. Prova sedan att ”Publicera”.'
        )
      })

      window.XMLHttpRequest = oldXMLHttpRequest
    })
  })

  describe('Page 3 Publish Progress Bar', () => {
    beforeAll(() => mockClientFunctionsToWebContext())
    afterAll(() => {
      jest.clearAllMocks()
    })

    test('Progress bar should not be visible before publish action', () => {
      const pageNumber = 3
      const { queryByRole, getByText, findByRole } = renderEditPage({}, pageNumber)
      expect(queryByRole('status')).toBeNull()

      getByText('Publicera').click()
      getByText('Ja, fortsätt publicera').click()
      expect(findByRole('status')).toBeTruthy()
    })
  })
})
