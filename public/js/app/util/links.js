import { ADMIN_OM_COURSE } from './constants'

const goToStartPage = returnToUrl => {
  window.location = returnToUrl
}

const goToAdminStartPage = (courseCode, lang, event) => {
  window.location = `${ADMIN_OM_COURSE}${courseCode}?l=${lang}&serv=kinfo&event=${event}`
}

const courseAdminLink = (courseCode, language) => {
  const languageParameter = language === 'en' ? '?l=en' : ''
  return `/kursinfoadmin/kurser/kurs/${courseCode}${languageParameter}`
}

function replaceAdminUrlWithPublicUrl() {
  const links = document.querySelectorAll('a')
  links.forEach(link => {
    const { href } = link
    if (!href || href.includes('/kursinfoadmin/')) return
    link.href = href.replace('//app', '//www')
  })
}

function replaceSiteUrl(courseCode, language) {
  const siteNameElement = document.querySelector('.block.siteName a')
  if (siteNameElement) {
    siteNameElement.href = courseAdminLink(courseCode, language)
  }
}

export { courseAdminLink, goToStartPage, goToAdminStartPage, replaceAdminUrlWithPublicUrl, replaceSiteUrl }
