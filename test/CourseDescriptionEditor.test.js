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

describe('<CourseDescriptionEditorPage>', () => {

    test('Renders without errors', () => {
        renderEditPage();
    });

    test('Has correct main heading', () => {
        const heading = renderEditPage().getByTestId('h1-title');
        expect(heading).toHaveTextContent('Administrera'); // incomplete match - should not be correct
        expect(heading).toHaveTextContent('kursinformation'); // incomplete match - should not be correct
        expect(heading).toHaveTextContent(/^Administrera kursinformation$/); // exact match
    });

    test('Has correct name for first step', () => {
        const name = renderEditPage().getByText('1. Välja bild');
        expect(name).toHaveTextContent(/^1. Välja bild$/); // exact match
    });

    test('Has correct heading for image selection', () => {
        const heading = renderEditPage().getByText('Välja bild');
        expect(heading).toHaveTextContent(/^Välja bild$/); // exact match
    });

});