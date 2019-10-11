const loginPage = 'https://login-r.referens.sys.kth.se/login'
const editPage = 'https://localhost:3001/kursinfoadmin/kurser/kurs/edit/SF1624'

context('Admin-tester', () => {

    Cypress.Commands.add('loginByForm', (username, password) => {
        Cypress.log({
            name: 'loginByForm',
            message: `${username} | <password>`,
        })

        return cy.request({
            method: 'POST',
            url: loginPage + '?service=' + editPage,
            form: true,
            body: {
                username,
                password,
            },
        }).then(res => {
            expect(res.status).to.eq(200)
        })
    })

    beforeEach(() => {
        cy.loginByForm(process.env.USERNAME, process.env.PASSWORD)
    })

    describe('Redigera Om kursen', () => {

        it('Go to course page', () => {
            cy.visit(editPage)
                .then(res => {
                    expect(res.body).to.contain('Svencska')
                })
        })
    })

})
