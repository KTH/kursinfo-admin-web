
describe('Login to kursinfo-admin-web', function () {
    context('form submission', function () {
        beforeEach(function () {
            cy.visit('https://login-r.referens.sys.kth.se')
        })

        it('displays errors on login', function () {
            // incorrect username on purpose
            cy.get('input[name=username]').type('jane.lae')
            cy.get('input[name=password]').type('password123{enter}')

            // we should have visible errors now
            cy.contains('Försök igen')

            // and still be on the same URL
            cy.url().should('include', '/login')
        })
    })

})


describe('Can access admin page', function () {
    const username = Cypress.env('username')
    const password = Cypress.env('password')

    context('direct navigate to admin page', function () {
        beforeEach(function () {
            cy.visit('http://localhost:3001/kursinfoadmin/kurser/kurs/edit/SF1624')
        })

        it('asks for login and then redirects to admin page', function () {
            cy.url().should('include', '/login')
            cy.get('input[name=username]').type(username)
            cy.get('input[name=password]').type(password+'{enter}')

            //after successful login
            cy.url().should('include', '/kursinfoadmin')
            cy.get('#course-title h1').should('be.visible')

        })
    })


    context('Reusable "login" custom command', function () {
        // typically we'd put this in cypress/support/commands.js
        // but because this custom command is specific to this example
        // we'll keep it here
        Cypress.Commands.add('loginByForm', (username, password) => {
            Cypress.log({
                name: 'loginByForm',
                message: `${username} | ${password}`,
            })

            return cy.request({
                method: 'POST',
                url: 'https://login-r.referens.sys.kth.se',
                form: true,
                body: {
                    username,
                    password,
                },
            })
        })

        beforeEach(function () {
            // login before each test
            cy.loginByForm(username, password)
        })

        it('can visit kursinfo-admin-web page', function () {
            // after cy.request, the session cookie has been set
            // and we can visit a protected page
            cy.visit('http://localhost:3001/kursinfoadmin/kurser/kurs/edit/SF1624')
            cy.get('#course-title h1').should('be.visible')

            //this will fail as the title today is not according to specs
            cy.get("#course-title h1").should('have.text', 'Redigera introduktion till kursen')
        })

    })
})

