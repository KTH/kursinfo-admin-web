import '@testing-library/jest-dom'
import { render, fireEvent } from '@testing-library/react'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { addClientFunctionsToWebContext } from '../public/js/app/client-context/addClientFunctionsToWebContext'
import { WebContextProvider } from '../public/js/app/context/WebContext'
import DescriptionPage from '../public/js/app/pages/DescriptionPage'
import { compressFile, uploadImage } from '../public/js/app/pages/DescriptionPage/components/imageUtils'

jest.mock('../public/js/app/client-context/addClientFunctionsToWebContext')
jest.mock('../public/js/app/pages/DescriptionPage/components/imageUtils')

const doUpsertItem = jest.fn().mockName('doUpsertItem').mockResolvedValue({})
addClientFunctionsToWebContext.mockReturnValue({ doUpsertItem })

jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(),
  useSearchParams: () => [null],
}))

const standardImageLabel = 'Standardbild utifrån kursens huvudområde'
const customImageLabel = 'Egen bild'

const courseCode = 'ABC123'

const createContext = () => {
  return {
    langIndex: 1,
    routeData: {
      values: {
        sellingTextSv: '',
        sellingTextEn: '',
        courseDispositionSv: '',
        courseDispositionEn: '',
      },
      defaultImage: { imageName: 'defaultImageName' },

      courseData: { courseCode: courseCode },
    },
  }
}

const renderPageWithStandardImage = () => {
  const context = createContext()
  context.routeData.imageFromApi = {
    hasCustomImage: false,
    imageName: undefined,
    url: undefined,
  }
  const renderResult = render(
    <WebContextProvider configIn={context}>
      <DescriptionPage />
    </WebContextProvider>
  )
  expect(renderResult.getByLabelText(standardImageLabel).checked).toBeTrue()
  expect(renderResult.getByLabelText(customImageLabel).checked).toBeFalse()
  return renderResult
}

const renderPageWithCustomImage = () => {
  const context = createContext()
  context.routeData.imageFromApi = {
    hasCustomImage: true,
    imageName: 'customImage',
    url: `imageHostUrl/imageName`,
  }
  const renderResult = render(
    <WebContextProvider configIn={context}>
      <DescriptionPage />
    </WebContextProvider>
  )
  expect(renderResult.getByLabelText(standardImageLabel).checked).toBeFalse()
  expect(renderResult.getByLabelText(customImageLabel).checked).toBeTrue()
  return renderResult
}

const stepToPreviewAndPublish = async findByRole => {
  await act(async () => {
    const editBtn = await findByRole('button', { name: 'Redigera text' })
    editBtn.click()
  })
  await act(async () => {
    const previewBtn = await findByRole('button', { name: 'Granska' })
    previewBtn.click()
  })
  await act(async () => {
    const publishBtn = await findByRole('button', { name: 'Publicera' })
    publishBtn.click()
  })
  await act(async () => {
    const confirmBtn = await findByRole('button', { name: 'Ja, fortsätt publicera' })
    confirmBtn.click()
  })
}

describe('DescriptionPage - call doUpsertItem with correct imageName value', () => {
  it('should use empty string when keeping standard image (standard -> standard)', async () => {
    const { findByRole } = renderPageWithStandardImage()
    await stepToPreviewAndPublish(findByRole)

    expect(doUpsertItem).toHaveBeenCalledWith(
      courseCode,
      expect.objectContaining({
        imageName: '',
      })
    )
  })

  it('should use undefined when keeping custom image (custom -> custom)', async () => {
    const { findByRole } = renderPageWithCustomImage()
    await stepToPreviewAndPublish(findByRole)

    expect(doUpsertItem).toHaveBeenCalledWith(
      courseCode,
      expect.objectContaining({
        imageName: undefined,
      })
    )
  })

  it('should use empty string when switching to standard image (custom -> standard)', async () => {
    const { findByRole, getByLabelText } = renderPageWithCustomImage()

    act(() => {
      // Change to standard image
      getByLabelText(standardImageLabel).click()
    })
    expect(getByLabelText(standardImageLabel).checked).toBeTrue()
    expect(getByLabelText(customImageLabel).checked).toBeFalse()

    await stepToPreviewAndPublish(findByRole)

    expect(doUpsertItem).toHaveBeenCalledWith(
      courseCode,
      expect.objectContaining({
        imageName: '',
      })
    )
  })

  it('should use custom name when switching to custom image (standard -> custom)', async () => {
    const expectedImageName = 'mockCustomImageName'
    compressFile.mockResolvedValue({ imageFilePath: '/path', imageFormData: 'data' })
    uploadImage.mockReturnValue({ imageName: expectedImageName })

    const { findByRole, getByLabelText, getByTestId } = renderPageWithStandardImage()

    expect(getByLabelText(standardImageLabel).checked).toBeTrue()
    expect(getByLabelText(customImageLabel).checked).toBeFalse()

    // Change to standard image
    act(() => {
      getByLabelText(customImageLabel).click()
    })
    expect(getByLabelText(standardImageLabel).checked).toBeFalse()
    expect(getByLabelText(customImageLabel).checked).toBeTrue()

    await act(async () => {
      const imageInput = getByTestId('fileUpload')
      fireEvent.change(imageInput, {
        target: {
          files: [new File([], 'hello.png'), , { type: 'image/png' }],
        },
      })
    })

    act(() => {
      getByTestId('termsAgreement').click()
    })
    await stepToPreviewAndPublish(findByRole)

    expect(doUpsertItem).toHaveBeenCalledWith(
      courseCode,
      expect.objectContaining({
        imageName: expectedImageName,
      })
    )
  })
})
