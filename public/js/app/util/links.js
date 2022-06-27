function replaceAdminUrlWithPublicUrl() {
  const links = document.querySelectorAll('a')
  links.forEach(link => {
    const { href } = link
    if (!href || href.includes('/kursinfoadmin/')) return
    link.href = href.replace('//app', '//www')
  })
}

const goToStartPage = returnToUrl => {
  window.location = returnToUrl
}
export { replaceAdminUrlWithPublicUrl, goToStartPage }
