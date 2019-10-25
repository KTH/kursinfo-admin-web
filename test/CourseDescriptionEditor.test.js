import React from 'react';
import {Provider} from 'mobx-react';
import {render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import {mockAdminStore} from './mocks/adminStore';

import CourseDescriptionEditorPage from '../public/js/app/pages/CourseDescriptionEditorPage';

const renderEditPage = (adminStoreToUse = mockAdminStore) => {
    return render(
        <Provider adminStore={adminStoreToUse}>
            <CourseDescriptionEditorPage/>
        </Provider>
    );
};

const renderWithState = (stateToSet = {}) => {
    const newAdminStore = Object.assign(Object.assign({}, mockAdminStore), stateToSet);
    return renderEditPage(newAdminStore);
};

const useDefaultImage = 'Bild vald utifrån kursens huvudområde';

describe('<CourseDescriptionEditorPage> (and subordinates)', () => {

    test('Renders without errors (incl. snapshot)', () => {
        const {asFragment} = renderEditPage();
        expect(renderEditPage().asFragment()).toMatchSnapshot();
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

    const PUBLISHED_IMAGE_EXISTS = {
        isDefaultChosen: false,
        isApiPicAvailable: true,
        tempImagePath: undefined
    };

    const IMAGE_SELECTED_FOR_UPLOAD = {
        isDefaultChosen: false,
        isApiPicAvailable: false,
        tempImagePath: 'ImageThatWasSelectedForUpload.png'
    };

    const OVERWRITE_PUBLISHED_IMAGE = {
        isDefaultChosen: false,
        isApiPicAvailable: true,
        tempImagePath: 'ImageThatWasSelectedForUpload.png'
    };

    describe('Page 1G', () => {

        test('Has correct alert text (previously published image, switch to default)', () => {
            const {getByRole, getByLabelText} = renderWithState(PUBLISHED_IMAGE_EXISTS);
            getByLabelText(useDefaultImage).click();
            const expected = 'Observera: vid publicering kommer den publicerade bilden att raderas.';
            expect(getByRole('alert')).toHaveTextContent(expected);
        });

        test('Has correct alert text (uploaded initial image, switch to default)', () => {
            const {getByRole, getByLabelText} = renderWithState(IMAGE_SELECTED_FOR_UPLOAD);
            getByLabelText(useDefaultImage).click();
            const expected = 'Observera: vid publicering kommer den egna valda bilden att raderas.';
            expect(getByRole('alert')).toHaveTextContent(expected);
        });

        test('Has correct alert text (uploaded new image, switch to default)', () => {
            const {getByRole, getByLabelText, getByTestId} = renderWithState(OVERWRITE_PUBLISHED_IMAGE);
            getByLabelText(useDefaultImage).click();
            const expected = 'Observera: vid publicering kommer den egna valda och/eller publicerade bilden att raderas.';
            expect(getByRole('alert')).toHaveTextContent(expected);
        });
    });

    describe('Page 1H', () => {
        test('Has correct alert text (selected image, not agreed to terms)', () => {
            const {getByRole, getByTestId} = renderWithState(IMAGE_SELECTED_FOR_UPLOAD);
            getByTestId('termsAgreement').click();
            getByTestId('termsAgreement').click();
            const expected = 'Du behöver godkänna villkoren (se markering i rött nedan) för att kunna gå vidare till "Redigera text".';
            expect(getByRole('alert')).toHaveTextContent(expected);
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
