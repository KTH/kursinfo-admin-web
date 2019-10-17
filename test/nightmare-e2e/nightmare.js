require('dotenv').config()

const Nightmare = require('nightmare')
const assert = require('assert')
const chai = require('chai')
const expect = chai.expect
const loginPage = 'https://login-r.referens.sys.kth.se/login'
const editPage = 'http://localhost:3001/kursinfoadmin/kurser/kurs/edit/SF1624'

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
                .then(result => {

                    done()
                })
                .catch(error => {
                    console.log('Failed: ' + error)
                })
        })
    })
})


describe('KursInfo Admin page title', function() {
    this.timeout('15s')

    it('should login and navigate to page', (done) => {
        const nightmare = Nightmare({show: true})
        nightmare
            .goto(editPage)
            .type('#username', process.env.LOGINNAME)
            .type('#password', process.env.PASSWORD)
            .click('.btn-submit')
            .wait('#course-title')
            .evaluate(() =>
                document.querySelector('#course-title h1').innerText
            )
            .end()
            .then((text) => {
                expect(text).to.equal('Administrera kursinformation');
                done();
            })
    });
})
