const _ = require('lodash')

import {
  _parseOfferings,
  _semestersInParsedOfferings,
  _fetchCourseAnalyses,
  _fetchCourseMemos,
  _documentsPerCourseOffering,
  _dataPerSchool,
  _publishData,
} from '../server/statisticTransformer'
import {
  mockEarliestSemester,
  mockSemester,
  mockKoppsCourseOfferingsResponse,
  mockAnalysisOfferings,
  mockSemestersInAnalyses,
  mockMemoOfferings,
  mockSemestersInMemos,
  mockParsedOfferings,
  mockOfferingsWithoutAnalysis,
  mockAnalysisOfferingsWithStartDateOfLastOffering,
} from './mocks/koppsCourseOfferings'
import { mockCourseAnalysesSemesters, mockExpectedCourseAnalyses, mockKursutvecklingData } from './mocks/courseAnalyses'
import { mockCourseMemosSemesters, mockExpectedCourseMemos, mockKursPmDataApiData } from './mocks/courseMemos'
import {
  mockCourseAnalyses,
  mockCourseMemos,
  mockExpectedCourseOfferings,
  mockPublishData,
} from './mocks/courseOfferings'
import {
  mockEmptyCourseAnalyses,
  mockEmptyCourseMemos,
  mockEmptyCourses,
  mockExpectedEmptyCombinedDataPerSchool,
} from './mocks/dataPerSchool'

jest.mock('../server/configuration', () => {
  return {
    server: {
      koppsApi: {},
      kursutvecklingApi: {},
      kursPmDataApi: {},
      apiKey: {
        kursutvecklingApi: '1234',
        kursPmDataApi: '1234',
      },
      logging: {
        log: {
          level: 'debug',
        },
      },
    },
  }
})

jest.mock('../server/apiCalls/koppsApi', () => {
  return {
    kursutvecklingApi: {
      kursutvecklingApi: {
        client: {
          getAsync: async ({ uri }) => {
            const uriParts = uri.split('/')
            const semester = uriParts[uriParts.length - 1]
            return {
              body: mockKursutvecklingData(semester),
            }
          },
        },
      },
    },
    kursPmDataApi: {
      kursPmDataApi: {
        client: {
          getAsync: async ({ uri }) => {
            const uriParts = uri.split('/')
            const semester = uriParts[uriParts.length - 1]
            return {
              body: mockKursPmDataApiData(semester),
            }
          },
        },
      },
    },
  }
})

describe('Test statisticTransformer', () => {
  test('_parseOfferings – Compilation of offerings’ relevant data', () => {
    const parsedOfferings = _parseOfferings(mockKoppsCourseOfferingsResponse, '20201')
    const { forAnalyses: analysisOfferings, forMemos: memoOfferings } = parsedOfferings
    expect(analysisOfferings).toEqual(mockAnalysisOfferingsWithStartDateOfLastOffering)
    expect(memoOfferings).toEqual(mockMemoOfferings)
  })
  test('_semestersInParsedOfferings – Find unique semesters', () => {
    const semestersInAnalyses = _semestersInParsedOfferings(mockAnalysisOfferings)
    expect(semestersInAnalyses).toEqual(mockSemestersInAnalyses)
    const semestersInMemos = _semestersInParsedOfferings(mockMemoOfferings)
    expect(semestersInMemos).toEqual(mockSemestersInMemos)
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
    const courseOfferings = _documentsPerCourseOffering(mockParsedOfferings, mockCourseAnalyses, mockCourseMemos)
    expect(mockExpectedCourseOfferings).toMatchObject(courseOfferings)
  })
  test('_dataPerSchool - Compile statistics per school, including totals', () => {
    let combinedDataPerSchool = _dataPerSchool(mockEmptyCourseAnalyses, mockEmptyCourseMemos, mockEmptyCourses)
    expect(mockExpectedEmptyCombinedDataPerSchool).toMatchObject(combinedDataPerSchool)
    combinedDataPerSchool = _dataPerSchool(mockCourseAnalyses, mockCourseMemos)
  })
  test('_publishData - Calculate and compile memo publish data', () => {
    const { startDate } = mockMemoOfferings[0]
    const { lastChangeDate } = mockCourseMemos.AAA123[20201][1]
    let publishData = _publishData(startDate, lastChangeDate)
    expect(mockPublishData).toMatchObject(publishData)
  })
})
