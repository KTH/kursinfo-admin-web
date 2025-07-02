jest.mock('../../configuration', () => ({
  server: {
    ugRestApiURL: {
      url: 'https://ug.test.api',
      key: 'dummy-subscription-key',
    },
    ugAuth: {
      authTokenURL: 'https://auth.test.token',
      authClientId: 'dummy-client-id',
      authClientSecret: 'dummy-client-secret',
    },
  },
}))

jest.mock('@kth/ug-rest-api-helper', () => ({
  ugRestApiHelper: {
    initConnectionProperties: jest.fn(),
    getUGGroups: jest.fn(),
    getUGUsers: jest.fn(),
  },
}))

const { ugRestApiHelper } = require('@kth/ug-rest-api-helper')
const log = require('@kth/log')

jest.mock('@kth/log')

log.info = jest.fn()
log.debug = jest.fn()
log.error = jest.fn()

const {
  fetchCourseAndRoundGroups,
  fetchUsersInGroupsCategorizedByRole,
  fetchGroupNamesForUserCategorizedByRole,
} = require('../ugRestApi')

describe('fetchCourseAndRoundGroups', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('fetches groups with correct parameters', async () => {
    const courseCode = 'SF1624'
    const semester = '20222'
    const applicationCodes = ['11111', '22222']

    // Mock getUGGroups to return dummy groups
    const dummyGroups = [{ name: 'group1' }, { name: 'group2' }]
    ugRestApiHelper.getUGGroups.mockResolvedValue(dummyGroups)
    // Mock getCourseGroupName to return expected value
    jest.spyOn(require('../../utils/ugUtils'), 'getCourseGroupName').mockReturnValue('ladok2.kurser.SF.1624')

    const result = await fetchCourseAndRoundGroups(courseCode, semester, applicationCodes)

    const expectedCourseGroupName = 'ladok2.kurser.SF.1624'
    const expectedGroupNames = [
      expectedCourseGroupName,
      `${expectedCourseGroupName}.${semester}.11111`,
      `${expectedCourseGroupName}.${semester}.22222`,
    ]

    expect(ugRestApiHelper.getUGGroups).toHaveBeenCalledWith('name', 'in', expectedGroupNames, false)

    expect(result).toBe(dummyGroups)
  })
})

describe('fetchUsersInGroupsCategorizedByRole', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('fetches users for all roles and removes duplicates', async () => {
    const groups = [
      {
        examiners: ['id1', 'id2'],
        teachers: ['id3'],
        courseCoordinators: ['id4', 'id2'],
      },
    ]

    const usersMap = {
      id1: { kthid: 'id1', username: 'user1' },
      id2: { kthid: 'id2', username: 'user2' },
      id3: { kthid: 'id3', username: 'user3' },
      id4: { kthid: 'id4', username: 'user4' },
    }

    ugRestApiHelper.getUGUsers.mockImplementation((_key, _op, kthid) => Promise.resolve([usersMap[kthid]]))

    const result = await fetchUsersInGroupsCategorizedByRole(groups)

    // Duplicates removed - id2 only once per role list
    expect(result.examiners).toHaveLength(2)
    expect(result.teachers).toHaveLength(1)
    expect(result.courseCoordinators).toHaveLength(2)

    // Check correct users fetched
    expect(result.examiners).toEqual(expect.arrayContaining([usersMap.id1, usersMap.id2]))
    expect(result.teachers).toEqual(expect.arrayContaining([usersMap.id3]))
    expect(result.courseCoordinators).toEqual(expect.arrayContaining([usersMap.id4, usersMap.id2]))
  })

  test('handles groups with missing role arrays gracefully', async () => {
    const groups = [{ examiners: ['id1'] }, { teachers: ['id2'] }, { courseCoordinators: null }]

    ugRestApiHelper.getUGUsers.mockImplementation((_key, _op, kthid) =>
      Promise.resolve([{ kthid, username: `user-${kthid}` }])
    )

    const result = await fetchUsersInGroupsCategorizedByRole(groups)

    expect(result.examiners).toHaveLength(1)
    expect(result.teachers).toHaveLength(1)
    expect(result.courseCoordinators).toHaveLength(0)
  })
})

describe('fetchGroupNamesForUserCategorizedByRole', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('fetches groups for all roles for a user', async () => {
    const userKthId = 'user1'

    const groupsByRole = {
      examiners: [{ name: 'examiners-group' }],
      teachers: [{ name: 'teachers-group' }],
      courseCoordinators: [{ name: 'coordinators-group' }],
    }

    ugRestApiHelper.getUGGroups.mockImplementation(role => Promise.resolve(groupsByRole[role]))

    const result = await fetchGroupNamesForUserCategorizedByRole(userKthId)

    expect(result.examiners).toEqual(['examiners-group'])
    expect(result.teachers).toEqual(['teachers-group'])
    expect(result.courseCoordinators).toEqual(['coordinators-group'])

    expect(ugRestApiHelper.getUGGroups).toHaveBeenCalledTimes(3)
    expect(ugRestApiHelper.getUGGroups).toHaveBeenCalledWith('examiners', 'contains', userKthId)
    expect(ugRestApiHelper.getUGGroups).toHaveBeenCalledWith('teachers', 'contains', userKthId)
    expect(ugRestApiHelper.getUGGroups).toHaveBeenCalledWith('courseCoordinators', 'contains', userKthId)
  })
})
