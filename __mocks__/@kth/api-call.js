const mockGetAsync = jest.fn().mockResolvedValue({
  response: {
    statusCode: 200,
    ok: true,
  },
})

const mockPatchAsync = jest.fn().mockResolvedValue({
  response: {
    statusCode: 200,
    ok: true,
  },
})

const mockPaths = {
  getCourseInfoByCourseCode: { uri: '/get123' },
  patchCourseInfoByCourseCode: { uri: '/patch123' },
}

module.exports = {
  mockGetAsync,
  mockPatchAsync,
  mockPaths,
  Connections: {
    setup: () => ({
      kursinfoApi: {
        paths: mockPaths,
        client: {
          getAsync: mockGetAsync,
          patchAsync: mockPatchAsync,
          resolve: jest.fn((uri, { courseCode }) => `${uri}/${courseCode}`),
        },
      },
    }),
  },
}
