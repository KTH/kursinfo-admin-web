require('dotenv').config()

const Nightmare = require('nightmare')
const assert = require('assert')

const loginPage = 'https://login-r.referens.sys.kth.se/login'
const editPage = 'https://localhost:3001/kursinfoadmin/kurser/kurs/edit/SF1624'

describe('Load pages and verify stuff...', function () {

    this.timeout('5s')

    let nightmare = null
    beforeEach(() => {
        nightmare = new Nightmare({show: true})
    })

    describe('Course admin, edit course info', () => {
        it('should load without error', done => {
            nightmare
                .goto(loginPage + '?service=' + editPage)
                .type('#username', process.env.LOGINNAME)
                .type('#password', process.env.PASSWORD)
                .click('.btn-submit')
                .end()
                .evaluate(() => {
                    console.log('###evaluate')
                    return null === document.querySelector('#r1-0 a.result__a')
                })
                // .then(
                //     console.log
                // )
                // .then({
                //     done()
                // })
                .catch(error => {
                    console.log('Failed: ' + error)
                })
        })
    })
})