const _ = require('lodash')

import {
  _getOfferingsWithoutAnalysis,
  _earliestSemesterInRawCourseOfferings,
  _spanOfSemesters,
  _fetchCourseAnalyses,
  _fetchCourseMemos,
  _documentsPerCourseOffering,
  _dataPerSchool
} from '../server/statisticTransformer'
import {
  mockEarliestSemester,
  mockKoppsCourseOfferingsResponse,
  mockOfferingsWithoutAnalysis
} from './mocks/koppsCourseOfferings'
import {
  mockCourseAnalysesSemesters,
  mockExpectedCourseAnalyses,
  mockKursutvecklingData
} from './mocks/courseAnalyses'
import {
  mockCourseMemosSemesters,
  mockExpectedCourseMemos,
  mockKursPmDataApiData
} from './mocks/courseMemos'
import {
  mockRawCourseOfferings,
  mockCourseAnalyses,
  mockCourseMemos,
  mockExpectedCourseOfferings
} from './mocks/courseOfferings'
import {
  mockEmptyCourseAnalyses,
  mockEmptyCourseMemos,
  mockEmptyCourses,
  mockExpectedEmptyCombinedDataPerSchool
} from './mocks/dataPerSchool'

jest.mock('../server/configuration', () => {
  return {
    server: {
      ldap: {},
      koppsApi: {},
      kursutvecklingApi: {},
      kursPmDataApi: {},
      apiKey: {
        kursutvecklingApi: '1234',
        kursPmDataApi: '1234'
      },
      logging: {
        log: {
          level: 'debug'
        }
      }
    }
  }
})

jest.mock('../server/koppsApi', () => {
  return {
    kursutvecklingApi: {
      kursutvecklingApi: {
        client: {
          getAsync: async ({ uri }) => {
            const uriParts = uri.split('/')
            const semester = uriParts[uriParts.length - 1]
            return {
              body: mockKursutvecklingData(semester)
            }
          }
        }
      }
    },
    kursPmDataApi: {
      kursPmDataApi: {
        client: {
          getAsync: async ({ uri }) => {
            const uriParts = uri.split('/')
            const semester = uriParts[uriParts.length - 1]
            return {
              body: mockKursPmDataApiData(semester)
            }
          }
        }
      }
    }
  }
})

const customizer = (objValue, srcValue, key, object) => {
  if (key === 'numberOfUniqAnalyses' && Number.isInteger(objValue) && Number.isInteger(srcValue))
    return objValue + srcValue
}

describe('Test statisticTransformer', () => {
  test('_getOfferingsWithoutAnalysis – Compilation of offerings’ relevant data', () => {
    const rawCourseOfferings = _getOfferingsWithoutAnalysis(mockKoppsCourseOfferingsResponse)
    expect(rawCourseOfferings).toEqual(mockOfferingsWithoutAnalysis)
  })
  test('_earliestSemesterInRawCourseOfferings – Find earliest semester', () => {
    const earliestSemester = _earliestSemesterInRawCourseOfferings(mockOfferingsWithoutAnalysis)
    expect(earliestSemester).toEqual(mockEarliestSemester)
    expect(() => _earliestSemesterInRawCourseOfferings([])).toThrow(
      '_earliestSemesterInRawCourseOfferings - No semesters found in course offerings'
    )
  })
  test('_spanOfSemesters - Create a list of semesters', () => {
    const startSemester = '20171'
    const endSemester = '20202'
    const expectedSpanOfSemesters = [
      '20171',
      '20172',
      '20181',
      '20182',
      '20191',
      '20192',
      '20201',
      '20202'
    ]
    const spanOfSemesters = _spanOfSemesters(startSemester, endSemester)
    expect(spanOfSemesters).toEqual(expectedSpanOfSemesters)
  })
  test('_fetchCourseAnalyses - Fetch course analyses for semesters', async () => {
    const courseAnalyses = await _fetchCourseAnalyses(mockCourseAnalysesSemesters)
    expect(courseAnalyses).toMatchObject(mockExpectedCourseAnalyses)
  })
  test('_fetchCourseMemos - Fetch course memos for semesters', async () => {
    const courseMemos = await _fetchCourseMemos(mockCourseMemosSemesters)
    expect(courseMemos).toMatchObject(mockExpectedCourseMemos)
  })
  test('_documentsPerCourseOffering - Match analyses and memos with course offerings', () => {
    const courseOfferings = _documentsPerCourseOffering(
      mockRawCourseOfferings,
      mockCourseAnalyses,
      mockCourseMemos
    )
    expect(mockExpectedCourseOfferings).toMatchObject(courseOfferings)
  })
  test('_dataPerSchool - Compile statistics per school, including totals', () => {
    let combinedDataPerSchool = _dataPerSchool(
      mockEmptyCourseAnalyses,
      mockEmptyCourseMemos,
      mockEmptyCourses
    )
    expect(mockExpectedEmptyCombinedDataPerSchool).toMatchObject(combinedDataPerSchool)
    combinedDataPerSchool = _dataPerSchool(
      mockCourseAnalyses,
      mockCourseMemos,
      mockKoppsCourseOfferingsResponse
    )
  })
})
