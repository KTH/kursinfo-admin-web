import { ADMIN_ABOUT_COURSE } from './constants'

const goToStartPage = returnToUrl => {
  window.location = returnToUrl
}

const goToAdminStartPage = (courseCode, lang, event) => {
  window.location = `${ADMIN_ABOUT_COURSE}${courseCode}?l=${lang}&serv=kinfo&event=${event}`
}

const courseAdminLink = (courseCode, language) => {
  const languageParameter = language === 'en' ? '?l=en' : ''
  return `/kursinfoadmin/kurser/kurs/${courseCode}${languageParameter}`
}

export { courseAdminLink, goToStartPage, goToAdminStartPage }
