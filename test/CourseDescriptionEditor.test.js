import React from "react";
import {render} from '@testing-library/react'
import {Provider} from 'mobx-react'
import CourseDescriptionEditorPage from "../public/js/app/pages/CourseDescriptionEditorPage"
var fs=require('fs');


let container = null;
beforeEach(() => {
    // setup a DOM element as a render target
    //container = document.createElement("div");
    //document.body.appendChild(container);
    const mockAdminStore = {
        koppsData: {
            koppsText: {
            sv: 'Algebra och geometri',
            en: 'Ingen information tillagd'
            },
            mainSubject: 'Matematik',
            courseTitleData: {
                course_code: 'SF1624',
                course_title: 'Algebra och geometri',
                course_credits: 7.5,
                apiError: false
            },
            lang: 'sv',
            langIndex: 1
        }
    }
});

/*afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});*/

it("renders", () => {
    //var data=fs.readFileSync(__dirname + '/mocks/koppsDataMock.json', 'utf8');

    const mockAdminStore = {
        koppsData: {
            koppsText: {
                sv: 'Algebra och geometri',
                en: 'Ingen information tillagd'
            },
            mainSubject: 'Matematik',
            courseTitleData: {
                course_code: 'SF1624',
                course_title: 'Algebra och geometri',
                course_credits: 7.5,
                apiError: false
            },
            lang: 'sv',
            langIndex: 1
        },
        browserConfig:{
            storageUri : ''
        }
    }
    render(<Provider adminStore={mockAdminStore}><CourseDescriptionEditorPage /></Provider>)
});