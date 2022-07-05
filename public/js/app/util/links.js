const goToStartPage = returnToUrl => {
  window.location = returnToUrl
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

export { courseAdminLink, goToStartPage, replaceAdminUrlWithPublicUrl, replaceSiteUrl }
