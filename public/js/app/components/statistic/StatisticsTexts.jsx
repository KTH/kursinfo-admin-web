import React from 'react'

const englishTexts = {
  pageHeader: semester => `Course Information Statistics ${semester}`,
  pageDescription: () => (
    <>
      <p>
        A semester is expressed as a year followed by 1 for Spring or 2 for Autumn, for example, 20191 for Spring
        semester 2019 or 20202 for Autumn semester 2020.
      </p>
      <p>Please note that this service cannot provide accurate statistics from earlier than 2019.</p>
    </>
  ),
  subHeader: 'Per School',
  subPageDescription:
    'Course information statistics grouped by the school, presented for course analyses and course memos, respectively. You also have the possibility to export data from the tables to a csv file.',
  courseAnalysesHeader: 'Course Analyses',
  courseAnalysesDescription: () => (
    <>
      <p>
        Column <q>Number of courses</q> holds the number of active courses for the particular school ending the given
        semester according to KOPPS.
      </p>
      <p>
        Column <q>Number of course analysis</q> holds the number of unique published course analysis for the particular
        school the given semester. For course offerings running over several semesters the course analysis is presented
        at the last semester of the course offerings.
      </p>
    </>
  ),
  sourceOfData: 'Source of Data',
  courseDataApiDescription: koppsApiUrl => (
    <p>
      Course data is fetched from&nbsp;
      <a href="https://www.kth.se/api/kopps/v2/apiInfo/courses">KOPPS API for Courses</a>, endpoint&nbsp;
      <code>/api/kopps/v2/courses/offerings</code>. Data for the current page was fetched from&nbsp;
      <a href={koppsApiUrl} target="_blank" rel="noreferrer">
        <code>{koppsApiUrl}</code>
      </a>
      .
    </p>
  ),
  courseAnalysesFilterDescription: semester => (
    <p>
      For course analyses, offerings that didn’t finish during the {semester} semester are filtered out. This is done by
      discarding offerings that don’t meet the criteria:
      <br />
      <code>course.offered_semesters[&#123;last-element&#125;].semester == {semester}</code>
    </p>
  ),
  courseAnalysesDataApiDescription: (kursutvecklingApiUrl, semestersInAnalyses) => (
    <p>
      Course analyses data is fetched from&nbsp;
      <a href="https://github.com/KTH/kursutveckling-api" target="_blank" rel="noreferrer">
        kursutveckling-api
      </a>
      , endpoint <code>/api/kursutveckling/v1/courseAnalyses/&#123;semester&#125;</code>. Data for the current page was
      fetched from&nbsp;
      <a href={kursutvecklingApiUrl} target="_blank" rel="noreferrer">
        <code>{kursutvecklingApiUrl}&#123;semester&#125;</code>
      </a>
      , using semester(s) <code>{semestersInAnalyses.sort().join(', ')}</code>.
    </p>
  ),
  exportCourseAnalysesData: 'Export course analyses data per school (csv file)',
  courseMemosHeader: 'Course Memos',
  courseMemosDescription: () => (
    <>
      <p>
        Column <q>Number of (#) courses</q> holds the number of active courses for the particular school starting the
        given semester according to KOPPS.
      </p>
      <p>
        Columns <q># web course memos</q> and <q># PDF course memos</q> holds the number of unique published course
        memos for the particular school in the given semester, seperated by publishing method. For course offerings
        running over several semesters, the course memo is presented at the first semester of the course offerings.
      </p>
      <p>
        Columns <q># memos published before start</q> and <q># memos published one week before start</q> holds the
        number of course memos published at specific periods of time. The calculation uses dates in KOPPS.
      </p>
    </>
  ),
  courseMemosDataApiDescription: (kursPmApiUrl, semestersInMemos) => (
    <p>
      Course memo data is fetched from&nbsp;
      <a href="https://github.com/KTH/kurs-pm-data-api" target="_blank" rel="noreferrer">
        kurs-pm-data-api
      </a>
      , endpoint <code>/api/kurs-pm-data/v1/webAndPdfPublishedMemosBySemester/&#123;semester&#125;</code>. Data for the
      current page was fetched from&nbsp;
      <a href={kursPmApiUrl} target="_blank" rel="noreferrer">
        <code>{kursPmApiUrl}&#123;semester&#125;</code>
      </a>
      , using semester(s) <code>{semestersInMemos.sort().join(', ')}</code>.
    </p>
  ),
  courseMemosFilterDescription: semester => (
    <>
      <p>
        For course memos, offerings that didn’t start during the {semester} semester are filtered out. This is done by
        discarding offerings that doesn’t meet the criteria: <code>course.first_yearsemester == {semester}</code>. Date
        used to determine if memo was published before the offering started is{' '}
        <code>course.offered_semesters[&#123;{semester}&#125;].start_date</code>.
      </p>
      <p>
        An earlier version of <i>Publish new course analysis and course data</i> had the option to upload course memos
        together with course analyses. This option does not exist anymore, and course memos uploaded on that page are
        filtered out.
      </p>
    </>
  ),
  exportCourseMemosData: 'Export course memos data per school (csv file)',
  rawDataHeader: 'Raw Data',
  rawDataDescription: () => (
    <p>
      Use the course information raw data to make aggregations for example departments or programs. You can export the
      data to a csv file.
    </p>
  ),
  exportRawCourseAnalysesData: 'Export raw course analyses data (csv file)',
  exportRawCourseMemosData: 'Export raw course memos data (csv file)',
}

export { englishTexts }
