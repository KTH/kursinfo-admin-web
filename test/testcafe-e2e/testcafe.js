import {Selector as $} from 'testcafe';

fixture`Administrera kursinformation`// declare the fixture
    .page`http://localhost:3001/kursinfoadmin/kurser/kurs/edit/SF1624`;  // specify the start page

test('Logga in och verifiera rubriktexter', async t => {

    await t
        .typeText('#username', process.env.USERNAME)
        .typeText('#password', process.env.PASSWORD)
        .click($('.btn-submit'))
        .expect($('#course-title h1').innerText).eql('Administrera kursinformation')
        .expect($('#course-title h4').innerText).eql('SF1624 Algebra och geometri 7,5 hp')

});
