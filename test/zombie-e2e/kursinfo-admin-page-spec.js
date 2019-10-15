const nodeEnv = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase()
console.log('node env', nodeEnv)

if (nodeEnv === 'test' || !nodeEnv) {
    require('dotenv').config()
}



const Browser = require('zombie')
//Browser.localhost('localhost', 3001)

const browser = new Browser()

describe('login to application', function () {
    before(function (done) {
        browser.visit('https://login-r.referens.sys.kth.se', done)
    })

    it('should contain a login form', function () {
        browser.assert.element('#username')
        browser.assert.element('#password')
    })

    it('login with cas', function (done) {
        console.log('User name : ', process.env.LOGINNAME)
        browser.fill('username', process.env.LOGINNAME)
        browser.fill('password', process.env.PASSWORD)
        browser.pressButton('Logga in').then(function() {
            console.log('log in pressed')
            browser.assert.success()
        }).then(done, done);
    })


    describe('navigate to course info admin page', function () {
        const baseUrl = 'http://localhost:3001'
        before(function (done) {
            browser.visit(baseUrl + '/kursinfoadmin/kurser/kurs/edit/MJ2411?l=sv', done)
        })

        it('should be successful', function () {
            browser.assert.success()
        })

        it('Displays correct title on pagetext', function () {
            browser.assert.element('#course-title')
            browser.assert.text('#course-title h1', 'Redigera introduktion till kursen')
        })
    })
})


















/*describe('navigate to login page', function () {
    before(function (done) {
        browser.visit('/kursinfoadmin/kurser/kurs/edit/MJ2411?l=sv', done)
    })

    it('should contain a login form', function () {
        browser.assert.element('#username')
        browser.assert.element('#password')
    })

    describe('login with cas', function () {
        before(function (done) {
            console.log('username', process.env.USER)
            browser.fill('username', process.env.USER)
            browser.fill('password', process.env.PASSWORD)
            browser.pressButton('Logga in', done)
        })

        it('should be successful', function () {
            browser.assert.success()
        })

        it('should be on correct url', function () {
            console.log('Browser ', browser.source)
         //   browser.assert.url({ pathname: '/node' })
        })

        it('should contain course title', function () {
            browser.assert.element('#course-title')
        })
    })
})*/


