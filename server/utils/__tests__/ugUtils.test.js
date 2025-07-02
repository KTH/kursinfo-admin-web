const {
  getCourseGroupName,
  getCourseRoundGroupName,
  buildEmployeesHtmlObject,
  createPersonHtml,
} = require('../ugUtils')

describe('ugUtils', () => {
  describe('getCourseGroupName', () => {
    test('returns correct group name for 7-char course code', () => {
      expect(getCourseGroupName('ABC1234')).toBe('ladok2.kurser.ABC.1234')
    })

    test('returns correct group name for 6-char course code', () => {
      expect(getCourseGroupName('AB1234')).toBe('ladok2.kurser.AB.1234')
    })

    test('returns undefined for other lengths', () => {
      expect(getCourseGroupName('ABCDE')).toBeUndefined()
      expect(getCourseGroupName('')).toBeUndefined()
      expect(getCourseGroupName('ABCDEFGH')).toBeUndefined()
    })
  })

  describe('getCourseRoundGroupName', () => {
    test('returns full group name if all inputs are valid', () => {
      expect(getCourseRoundGroupName('ABC1234', '20222', '11111')).toBe('ladok2.kurser.ABC.1234.20222.11111')
    })

    test('returns undefined if courseCode is missing', () => {
      expect(getCourseRoundGroupName(null, '20222', '11111')).toBeUndefined()
    })

    test('returns undefined if semester is missing', () => {
      expect(getCourseRoundGroupName('ABC1234', null, '11111')).toBeUndefined()
    })

    test('returns undefined if applicationCode is missing', () => {
      expect(getCourseRoundGroupName('ABC1234', '20222', null)).toBeUndefined()
    })

    test('returns undefined if course group name is undefined', () => {
      expect(getCourseRoundGroupName('AB123', '20222', '11111')).toBeUndefined()
    })
  })

  describe('createPersonHtml', () => {
    test('creates correct HTML string for person list', () => {
      const persons = [
        { username: 'user1', givenName: 'John', surname: 'Doe' },
        { username: 'user2', givenName: 'Jane', surname: 'Smith' },
      ]

      const html = createPersonHtml(persons)
      expect(html).toContain('<p class="person">')
      expect(html).toContain('John Doe')
      expect(html).toContain('Jane Smith')
      expect(html).toContain('https://www.kth.se/files/thumbnail/user1')
      expect(html).toContain('/profile/user2/')
    })

    test('returns empty string for empty array', () => {
      expect(createPersonHtml([])).toBe('')
    })
  })

  describe('buildEmployeesHtmlObject', () => {
    const createPerson = (username, givenName, surname) => ({ username, givenName, surname })

    test('returns object with HTML strings for non-empty role arrays', () => {
      const examiners = [createPerson('exam1', 'Exam', 'One')]
      const teachers = [createPerson('teach1', 'Teach', 'One')]
      const courseCoordinators = [createPerson('coord1', 'Coord', 'One')]

      const result = buildEmployeesHtmlObject(examiners, teachers, courseCoordinators)

      expect(result.examiners).toContain('Exam One')
      expect(result.teachers).toContain('Teach One')
      expect(result.courseCoordinators).toContain('Coord One')
    })

    test('omits roles if arrays are empty or undefined', () => {
      expect(buildEmployeesHtmlObject([], [], [])).toEqual({})
      expect(buildEmployeesHtmlObject()).toEqual({})
      expect(buildEmployeesHtmlObject(null, null, null)).toEqual({})
    })

    test('only includes roles with non-empty arrays', () => {
      const examiners = [createPerson('exam1', 'Exam', 'One')]
      const teachers = []
      const courseCoordinators = undefined

      const result = buildEmployeesHtmlObject(examiners, teachers, courseCoordinators)

      expect(result).toHaveProperty('examiners')
      expect(result).not.toHaveProperty('teachers')
      expect(result).not.toHaveProperty('courseCoordinators')
    })
  })
})
