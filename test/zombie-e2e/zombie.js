const Browser = require('zombie')

Browser.localhost('localhost', 3001)

const browser = new Browser()
browser.runScripts = false
// browser.debug()

const editPage = '/kursinfoadmin/kurser/kurs/edit/SF1624'

describe('navigate to login page', function () {

    before(() => {
        return browser.visit(editPage)
    })

    it('should contain a login form', () => {
        browser.assert.element('#username')
        browser.assert.element('#password')
    })

    describe('login with cas', () => {
        before(function () {
            browser.fill('#username', process.env.USERNAME)
            browser.fill('#password', process.env.PASSWORD)
            return browser.pressButton('Logga in')
        })

        it('should be successful', () => {
            browser.assert.success()
        })

        it('should be on correct url', () => {
            // console.log("Source: " + browser.location)
            browser.assert.url({pathname: editPage}, 'Inloggning ej ok? ' + browser.source)
        })

        it('should have correct title(s)', () => {
            browser.assert.elements('h1', 2)
            browser.assert.text('title', 'KTH | Kursinformationsadmin | SF1624')
            browser.assert.text('.courseTitle h1', 'Administrera kursinformation')
        })

        after(() => {
            // browser.dump()
        })

    })
})
