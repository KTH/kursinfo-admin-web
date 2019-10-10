const nodeEnv = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase()
console.log('node env', nodeEnv)

if (nodeEnv === 'test' || !nodeEnv) {
    require('dotenv').config()
}


import {Selector as $} from 'testcafe';

fixture `Administrera kursinformation`// declare the fixture
    .page `http://localhost:3001/kursinfoadmin/kurser/kurs/edit/SF1624`;  // specify the start page

test('Logga in och verifiera rubriktexter', async t => {
    await t
        .typeText('#username', process.env.USER)
        .typeText('#password', process.env.PASSWORD)
        .click($('.btn-submit'))
        .expect($('#course-title h1').innerText).eql('Administrera kursinformation')
      });