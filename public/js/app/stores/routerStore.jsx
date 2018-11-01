'use strict'
import { globalRegistry } from 'component-registry'
import { observable, action } from 'mobx'
import axios from 'axios'
import { safeGet } from 'safe-utils'

import { EMPTY, PROGRAMME_URL } from "../util/constants"


class RouterStore {
  @observable language = 'sv' // This won't work because primitives can't be ovserved https://mobx.js.org/best/pitfalls.html#dereference-values-as-late-as-possible
  @observable coursePlanData = undefined


  buildApiUrl (path, params) {
    let host
    if (typeof window !== 'undefined') {
      host = this.apiHost
    } else {
      host = 'http://localhost:' + this.browserConfig.port
    }
    if (host[host.length - 1] === '/') {
      host = host.slice(0, host.length - 1)
    }

    const newPath = params ? _paramReplace(path, params) : path

    return [host, newPath].join('')
  }

  _getOptions (params) {
    // Pass Cookie header on SSR-calls
    let options
    if (typeof window === 'undefined') {
      options = {
        headers: {
          Cookie: this.cookieHeader,
          Accept: 'application/json',
          'X-Forwarded-Proto': (_webUsesSSL(this.apiHost) ? 'https' : 'http')
        },
        timeout: 10000,
        params: params
      }
    } else {
      options = {
        params: params
      }
    }
    return options
  }

  @action async getCourseInformation(courseCode, lang){
 
      return axios.get(`https://api-r.referens.sys.kth.se/api/kopps/internal/courses/${courseCode}?lang=${lang}`).then((res) => {
   
    
      const coursePlan = res.data
      const language = lang === 'en' ? 0 : 1

      //console.log(coursePlan.publicSyllabusVersions && coursePlan.publicSyllabusVersions.publicSyllabusVersions )
      const coursePlanModel ={
        course_code: isValidData(coursePlan.course.courseCode),
        course_title: isValidData(coursePlan.course.title),
        course_other_title:isValidData(coursePlan.course.titleOther),
        course_main_subject: coursePlan.mainSubjects ?  Array.isArray(coursePlan.mainSubjects) ? coursePlan.mainSubjects.map(sub => sub + " ") : isValidData(coursePlan.mainSubjects) : EMPTY,
        course_credits:isValidData(coursePlan.course.credits),
        course_grade_scale: isValidData(coursePlan.formattedGradeScales[coursePlan.course.gradeScaleCode],language), //TODO: can this be an array?
        course_level_code: isValidData(coursePlan.course.educationalLevelCode),
        course_recruitment_text: isValidData(coursePlan.course.recruitmentText),
        course_goals: coursePlan.publicSyllabusVersions && coursePlan.publicSyllabusVersions.length > 0 ? isValidData(coursePlan.publicSyllabusVersions[0].courseSyllabus.goals, language) : EMPTY,
        course_content:  coursePlan.publicSyllabusVersions && coursePlan.publicSyllabusVersions.length > 0 ? isValidData(coursePlan.publicSyllabusVersions[0].courseSyllabus.content, language): EMPTY,
        course_disposition:  coursePlan.publicSyllabusVersions && coursePlan.publicSyllabusVersions.length > 0 ? isValidData(coursePlan.publicSyllabusVersions[0].courseSyllabus.disposition, language): EMPTY, 
        course_eligibility:  coursePlan.publicSyllabusVersions && coursePlan.publicSyllabusVersions.length > 0 ? isValidData(coursePlan.publicSyllabusVersions[0].courseSyllabus.eligibility, language): EMPTY, 
        course_requirments_for_final_grade:  coursePlan.publicSyllabusVersions && coursePlan.publicSyllabusVersions.length > 0 ? isValidData(coursePlan.publicSyllabusVersions[0].courseSyllabus.reqsForFinalGrade, language): EMPTY,
        course_literature: coursePlan.publicSyllabusVersions && coursePlan.publicSyllabusVersions.length > 0 ? isValidData(coursePlan.publicSyllabusVersions[0].courseSyllabus.literature, language): EMPTY, 
        course_valid_from:coursePlan.publicSyllabusVersions && coursePlan.publicSyllabusVersions.length > 0 ? isValidData(coursePlan.publicSyllabusVersions[0].validFromTerm.term, language): EMPTY, 
        course_required_equipment: coursePlan.publicSyllabusVersions && coursePlan.publicSyllabusVersions.length > 0 ? isValidData(coursePlan.publicSyllabusVersions[0].courseSyllabus.requiredEquipment, language): EMPTY,
        course_examination: getExamObject(coursePlan.examinationSets[Object.keys(coursePlan.examinationSets)[0]].examinationRounds, coursePlan.formattedGradeScales, language),
        course_examination_comments:  coursePlan.publicSyllabusVersions && coursePlan.publicSyllabusVersions.length > 0 ? isValidData(coursePlan.publicSyllabusVersions[0].courseSyllabus.examComments, language):EMPTY,
        //Not in course paln
        course_department: isValidData(coursePlan.course.department.name, language),
        course_contact_name:isValidData(coursePlan.course.infoContactName, language),
        course_suggested_addon_studies: isValidData(coursePlan.course.addOn, language),
        course_supplemental_information_url: isValidData(coursePlan.course.supplementaryInfoUrl, language),
        course_supplemental_information_url_text: isValidData(coursePlan.course.supplementaryInfoUrlName, language),
        course_supplemental_information: isValidData(coursePlan.course.supplementaryInfo, language),
        course_examiners: coursePlan.examiners ?  Array.isArray(coursePlan.examiners) ? coursePlan.examiners.map(ex => 
          `<br/><a href="https://www.kth.se/profile/${isValidData(ex.username)}/"> ${isValidData(ex.givenName)}  ${isValidData(ex.lastName)} </a>, Kontakt:${isValidData(ex.email)}`):"" : EMPTY
    }

    console.log("!!coursePlanModel: OK !!")

  //***Get list of rounds and creats options for rounds dropdown**//
  let courseRoundList=[]
    let courseRound
    let courseRoundSelectOptions = ""
    for( let roundInfo of coursePlan.roundInfos){ 
      courseRound = getRound(roundInfo)
      courseRoundList.push(courseRound)
      courseRoundSelectOptions +=  `<option value=${courseRound.round_course_term[0]}:${courseRound.round_course_term[1]}_${courseRound.roundId} > 
                                        VT ${courseRound.round_course_term[0]}:
                                        ${courseRound.round_short_name} - 
                                        ${courseRound.round_campus}
                                    </option>`
      }
      return {coursePlanModel,
              courseRoundList,
              language
            }
    }).catch(err => { //console.log(err.response);
      if (err.response) {
        throw new Error(err.message, err.response.data)
      }
      throw err
    })
    
  }

  @action getLdapUserByUsername (params) {
    return axios.get(this.buildApiUrl(this.paths.api.searchLdapUser.uri, params), this._getOptions()).then((res) => {
      return res.data
    }).catch(err => {
      if (err.response) {
        throw new Error(err.message, err.response.data)
      }
      throw err
    })
  }
  

  @action getFormAnswers (params) {
    return axios.get(this.buildApiUrl(this.paths.api.webformAnswers.uri, params), this._getOptions()).then((res) => {
      const util = globalRegistry.getUtility(IDeserialize, 'niseko-web')
      const data = util.deserialize(res.data)
      return data
    }).catch(err => {
      if (err.response) {
        throw new Error(err.message, err.response.data)
      }
      throw err
    })
  }
  



  @action clearBreadcrumbs () {
    this.breadcrumbs.replace([])
  }

  @action setBreadcrumbs (crumbs) {
    this.breadcrumbs.replace([{
      label: 'KTH',
      href: '/'
    }].concat(crumbs))
  }
  
  @action appendBreadcrumbs (crumbs) {
    this.breadcrumbs.replace(this.breadcrumbs.concat(crumbs))
  }
  
  @action hasBreadcrumbs () {
    return this.breadcrumbs.length > 0
  }

  @action setBrowserConfig (config, paths, apiHost, profileBaseUrl) {
    this.browserConfig = config
    this.paths = paths
    this.apiHost = apiHost
    this.profileBaseUrl = profileBaseUrl
  }

  @action __SSR__setCookieHeader (cookieHeader) {
    if (typeof window === 'undefined') {
      this.cookieHeader = cookieHeader
    }
  }

  @action doSetLanguage (lang) {
    this.language = lang
  }

  @action getBrowserInfo () {
    var navAttrs = ['appCodeName', 'appName', 'appMinorVersion', 'cpuClass',
      'platform', 'opsProfile', 'userProfile', 'systemLanguage',
      'userLanguage', 'appVersion', 'userAgent', 'onLine', 'cookieEnabled']
    var docAttrs = ['referrer', 'title', 'URL']
    var value = {document: {}, navigator: {}}
  
    for (let i = 0; i < navAttrs.length; i++) {
      if (navigator[navAttrs[i]] || navigator[navAttrs[i]] === false) {
        value.navigator[navAttrs[i]] = navigator[navAttrs[i]]
      }
    }
  
    for (let i = 0; i < docAttrs.length; i++) {
      if (document[docAttrs[i]]) {
        value.document[docAttrs[i]] = document[docAttrs[i]]
      }
    }
  
    return value
  }

  

  initializeStore (storeName) {
    const store = this
    console.log("__initialState__",window.__initialState__, "store",store)
    if (typeof window !== 'undefined' && window.__initialState__ && window.__initialState__[storeName]) {
      const util = globalRegistry.getUtility(IDeserialize, 'niseko-web')
      const importData = JSON.parse(decodeURIComponent(window.__initialState__[storeName]))
      for (let key in importData) {
        // Deserialize so we get proper ObjectPrototypes
        // NOTE! We need to escape/unescape each store to avoid JS-injection
        store[key] = util.deserialize(importData[key])
      }
      delete window.__initialState__[storeName]
  
      // Just a nice helper message
      if (Object.keys(window.__initialState__).length === 0) {
        window.__initialState__ = 'Mobx store state initialized'
      }
    }
  }

}


//******************POC TEST Move to a better place!*********************/
//const config = require('../configuration').server
const BasicAPI = require('kth-node-api-call').BasicAPI

let koppsApiInternal = new BasicAPI({
  hostname: "https://kopps-r.referens.sys.kth.se/api/kopps/",//config.kopps.host,
  basePath: '/api/kopps/internal/',
  https: false,//config.kopps.https,
  json: true,
  // Kopps is a public API and needs no API-key
  defaultTimeout: 3000
})
//**********************************************************************/
function isValidData(dataObject, language = 0){
  return !dataObject ? EMPTY : dataObject
}


function getExamObject(dataObject, grades, language = 0){console.log("exam",grades)
  let examString = ""
  if(dataObject.length > 0){
    for(let exam of dataObject){
     examString += `<li>${exam.examCode} - 
                    ${exam.title},
                    ${exam.credits},  
                    Betygskala: ${grades[exam.gradeScaleCode]}             
                    </li>`
    }
  }
  return examString 
}



function getRound(roundObject, language = 0){ console.log("!!! IN rounds!!")
  const courseRoundModel = {
    roundId: isValidData(roundObject.round.ladokRoundId, language),
    round_time_slots: isValidData(roundObject.timeslots, language),
    round_start_date: isValidData(roundObject.round.firstTuitionDate, language),
    round_end_date: isValidData(roundObject.round.lastTuitionDate, language),
    round_target_group:  isValidData(roundObject.round.targetGroup, language),
    round_tutoring_form: isValidData(roundObject.round.tutoringForm.name, language), //ASK FOR CHANGE???
    round_tutoring_time: isValidData(roundObject.round.tutoringTimeOfDay.name, language), 
    round_tutoring_language: isValidData(roundObject.round.language, language),
    round_campus: isValidData(roundObject.round.campus.label, language), 
    round_course_place: isValidData(roundObject.round.campus.name, language),
    round_teacher: "investigate if it could be added in kopps API???",//roundObject.ldapTeachers.map( teacher => isValidData(teacher.email)), 
    round_responsibles: "investigate if it could be added in kopps API???",//roundObject.ldapResponsibles.map( Responsibles => isValidData(Responsibles.email)), 
    round_short_name: isValidData(roundObject.round.shortName, language),
    round_course_code: isValidData(roundObject.round.applicationCodes[0].applicationCode),
    round_schedule: isValidData(roundObject.schemaUrl),
    round_course_term: isValidData(roundObject.schemaUrl).toString().length > 0 ? roundObject.round.startTerm.term.toString().match(/.{1,4}/g) : [],
    round_periods: isValidData(roundObject.round.courseRoundTerms[0].formattedPeriodsAndCredits),
    round_max_seats: isValidData(roundObject.round.maxSeats, language),
   // round_type: isValidData(roundObject.applicationCodes[0].courseRoundType.name, language), //TODO: Map array
    round_application_link:  isValidData(roundObject.admissionLinkUrl),
    round_part_of_programme: roundObject.usage.length > 0 ? getRoundProgramme(roundObject.usage) : EMPTY
  }
  return courseRoundModel
}

function getRoundProgramme(programmeList){
  let programmeString = ""
  programmeList.forEach(programme => {
    programmeString += `<a href="${PROGRAMME_URL}/${programme.programmeCode}/${programme.progAdmissionTerm.term}/arskurs${programme.studyYear}">${programme.title}</a><br/>`
  })
  console.log("!!getRoundProgramme : OK !!",programmeString)
  return programmeString
}

export default RouterStore
