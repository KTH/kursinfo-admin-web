import React from "react";
import {Provider} from 'mobx-react';
import {render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import {mockAdminStore} from "./mocks/adminStore";

import CourseDescriptionEditorPage from "../public/js/app/pages/CourseDescriptionEditorPage";

const renderEditPage = function () {
    return render(
        <Provider adminStore={mockAdminStore}>
            <CourseDescriptionEditorPage/>
        </Provider>
    );
};

describe('<CourseDescriptionEditorPage> (and subordinates)', () => {

    test('Renders without errors (incl. snapshot)', () => {
        const {asFragment} = renderEditPage();
        expect(asFragment()).toMatchSnapshot();
    });

    test('Has correct main heading', () => {
        const heading = renderEditPage().getByTestId('h1-title');
        expect(heading).toHaveTextContent(/^Redigera introduktion till kursen$/); // require exact match
    });

    describe('Page 1A', () => {

        test('Has correct name in progress bar', () => {
            renderEditPage().getByText('1. Välj bild');
        });

        test('Has correct heading', () => {
            const heading = renderEditPage().getByText('Välja bild');
            expect(heading).toHaveTextContent(/^Välja bild$/); // exact match
        });

        test('Has correct introductory text', () => {
            const introText = renderEditPage().getByTestId('intro-text');
            expect(introText).toHaveTextContent(
                'Börja med att välja vilken bild som ska visas på kursinformationssidan (steg 1 av 3).');
            expect(introText).toHaveTextContent(
                'I nästa steg (2 av 3) kommer du att kunna redigera den inledande texten.');
            expect(introText).toHaveTextContent(
                'I sista steget (3 av 3) ges möjlighet att först granska bild och text och sedan publicera det på sidan "Kursinformation".');
        });
    });

    describe('Page 1B', () => {
    });

    describe('Page 1C', () => {
        test.skip('📌 Has correct alert text', () => {
            return false
        });
        test.skip('📌 Has correct error message', () => {
            return false
        });
    });

    describe('Page 1D', () => {
    });

    describe('Page 1E', () => {
    });

    describe('Page 1F', () => {
    });

    describe('Page 1G', () => {
        test.skip('📌 Has correct alert text', () => {
            return false
        });
    });

    describe('Page 1H', () => {
        test.skip('📌 Has correct alert text', () => {
            return false
        });
    });

    describe('Page 2', () => {
        test.skip('📌 Has correct introductory text', () => {
            return false
        });
    });

    describe('Page 3', () => {
        test.skip('📌 Has correct introductory text', () => {
            return false
        });
        test.skip('📌 Has correct headings', () => {
            return false
        });
    });

    describe('Page 3C', () => {
        test.skip('📌 Has correct alert text', () => {
            return false
        });
    });

});
