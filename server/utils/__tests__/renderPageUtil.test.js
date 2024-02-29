const { renderCoursePage } = require('../renderPageUtil')
const { getServerSideFunctions } = require('../serverSideRendering')
const configuration = require('../../configuration')

jest.mock('../serverSideRendering')
jest.mock('../../configuration')

const testContext = {
  proxyPrefixPath: { uri: '/mockedProxyPrefixPath' },
  lang: 'sv',
  langIndex: 1,
  routeData: {
    courseData: {
      courseCode: 'ABC123',
    },
  },
}
const req = { url: 'http://mockrequesturl' }

describe('renderPageUtil', () => {
  const mockGetServerSideFunctions = {
    renderStaticPage: jest.fn().mockName('renderStaticPage'),
    getCompressedData: jest.fn().mockName('getCompressedData'),
  }
  beforeEach(() => {
    getServerSideFunctions.mockReturnValue(mockGetServerSideFunctions)
  })

  test('should call render', () => {
    const res = {
      render: jest.fn().mockName('render'),
    }
    renderCoursePage(req, res, testContext)
    expect(res.render).toHaveBeenCalledWith('course/index', expect.objectContaining({}))
  })

  it('should call render with metadata', () => {
    const res = {
      render: jest.fn().mockName('render'),
    }

    renderCoursePage(req, res, { ...testContext, lang: 'en', langIndex: 0 })
    expect(res.render).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        title: 'Administer About course | ABC123',
        description: expect.any(String),
        instrumentationKey: configuration.server.appInsights.instrumentationKey,
      })
    )
  })

  it('should call renderStaticPage', async () => {
    const res = {
      render: jest.fn().mockName('render'),
    }
    const mockHtml = '<div>...</div>'
    mockGetServerSideFunctions.renderStaticPage.mockImplementationOnce(() => mockHtml)
    renderCoursePage(req, res, testContext)

    expect(mockGetServerSideFunctions.renderStaticPage).toHaveBeenCalledWith(
      expect.objectContaining({
        context: testContext,
        applicationStore: {},
        location: req.url,
        basename: testContext.proxyPrefixPath.uri,
      })
    )

    expect(res.render).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        html: mockHtml,
      })
    )
  })

  it('should call getCompressedData', async () => {
    const res = {
      render: jest.fn().mockName('render'),
    }

    const mockCompressedData = 'DATA123'
    mockGetServerSideFunctions.getCompressedData.mockReturnValueOnce(mockCompressedData)

    renderCoursePage(req, res, testContext)

    expect(res.render).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        compressedData: mockCompressedData,
      })
    )
  })
})
