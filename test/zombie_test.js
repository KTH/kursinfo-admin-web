/*
  
  ------------------------------------------
  Test file for zombie.js functional testing
  ------------------------------------------

  To run:
  NODE_PATH=`pwd` USER='' PASSWORD='' node_modules/mocha/bin/mocha test/zombie_test.js

  Where USER/PASSWORD is credentials in UG reference

  IMPORTANT! Make sure to run node-api with: npm run startMock

*/

const Browser = require('zombie')

Browser.localhost('localhost', 3000)

const browser = new Browser()
// If we have js turned on, the test will fail due to searchbox.autocomplete error
browser.runScripts = false

describe('navigate to login page', function() {

  before(function(done) {
    browser.visit('/node/login', done)
  })

  it('should contain a login form', function() {
    browser.assert.element('#username')
    browser.assert.element('#password')
  })

  describe('login with cas', function() {

    before(function(done) {
      browser
        .fill('username', process.env.USER)
        .fill('password', process.env.PASSWORD)
        .pressButton('Logga in', done)
    })

    it('should be successful', function() {
      browser.assert.success()
    })

    it('should be on correct url', function() {
      browser.assert.url({ pathname: '/node' })
    })

  })

})

describe('check mock data', function() {

  it('page should have api-data element', function() {
    browser.assert.element('#api-data')
  })  

  it('api-data element should contain mockdata', function() {
    browser.assert.text('#api-data', 'mockdata')    
  })

})

describe('check _monitor page', function() {

  before(function(done) {
    browser.visit('/node/_monitor', done)
  })

  it('should be successful', function() {
    browser.assert.success()
  })

  it('should contain APPLICATION_STATUS: OK', function() {
    browser.assert.text('body', new RegExp('^APPLICATION_STATUS: OK(.*)$'))
  })

})