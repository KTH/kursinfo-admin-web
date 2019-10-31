import React from 'react';
import {Provider} from 'mobx-react';
import {render, fireEvent, waitForElement} from '@testing-library/react';
import {shallow, configure, mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';
import '@testing-library/jest-dom/extend-expect';
import {mockAdminStore} from './mocks/adminStore';

import CourseDescriptionEditorPage from '../public/js/app/pages/CourseDescriptionEditorPage';
import Preview from "../public/js/app/components/PreviewText";

const renderEditPage = (adminStoreToUse = mockAdminStore, pageNumber) => {
    return render(
        <Provider adminStore={adminStoreToUse}>
            <CourseDescriptionEditorPage progress={pageNumber}/>
        </Provider>
    );
};

const renderWithState = (stateToSet = {}, pageNumber) => {
    const newAdminStore = Object.assign(Object.assign({}, mockAdminStore), stateToSet);
    return renderEditPage(newAdminStore, pageNumber);
};

describe('<CourseDescriptionEditorPage> (and subordinates)', () => {

    test('Renders without errors (incl. snapshot)', () => {
        expect(renderEditPage().asFragment()).toMatchSnapshot();
    });

    test('Has correct main heading', () => {
        const heading = renderEditPage().getByTestId('main-heading');
        expect(heading).toHaveTextContent(/^Redigera introduktion till kursen$/); // require exact match
    });

    describe('Page 1A Välj Bild', () => {

        test('Has correct name in progress bar', () => {
            renderEditPage().getByText('1. Välj bild');
        });

        test('Has correct heading', () => {
            const heading = renderEditPage().getByTestId('intro-heading');
            expect(heading).toHaveTextContent(/^Välj bild$/); // exact match
        });

        test('Has correct introductory text', () => {
            const introText = renderEditPage().getByTestId('intro-text');
            expect(introText).toHaveTextContent(
                'Börja med att välja vilken bild som ska visas på kursinformationssidan (steg 1 av 3).');
            expect(introText).toHaveTextContent(
                'I nästa steg (2 av 3) kommer du att kunna redigera den inledande texten.');
            expect(introText).toHaveTextContent(
                'I sista steget (3 av 3) ges möjlighet att först granska bild och text och sedan publicera det på sidan ”Kursinformation”.');
        });
    });

    describe('Page 1B Ingen bild vald', () => {
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

    describe('Page 1C Bildval fel', () => {
        test('Has correct alert text and error message', () => {
            const {getByRole, getByTestId} = renderEditPage();

            //No error message visible initially
            const errorMessageSpan = getByTestId('error-text')
            expect(errorMessageSpan).toHaveClass('no-error')

            //simulate file upload with incorrect format
            const imageInput = getByTestId('fileUpload')
            fireEvent.change(imageInput, {
                target: {
                    files: [new File(['(⌐□_□)'], 'empty.txt', { type: 'text' })],
                },
            })

            //Alert and Error Message assertion
            const expectedAlert = 'Du behöver välja en bild med rätt format (se markering i rött nedan) för att kunna gå vidare till ”Redigera text”.';
            expect(getByRole('alert')).toHaveTextContent(expectedAlert);
            const expectedErrorMessage = 'Obligatoriskt (format: .png eller .jpg)';
            expect(errorMessageSpan).toHaveTextContent(expectedErrorMessage)
        });
    });

    describe('Page 1D Första egen bild valt', () => {
    });

    describe('Page 1E Tidigare val av egen bild', () => {
    });

    describe('Page 1F Valt om till, ytterligare ny egen bild', () => {
    });


    describe('Page 1G Valt om, ämnesbild', () => {

        const useDefaultImage = 'Bild vald utifrån kursens huvudområde';

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

    describe('Page 1H Godkänna vilkor fel', () => {
        test('Has correct alert text (selected image, not agreed to terms)', () => {
            const {getByRole, getByTestId} = renderWithState(IMAGE_SELECTED_FOR_UPLOAD);
            getByTestId('termsAgreement').click();
            getByTestId('termsAgreement').click();
            const expected = 'Du behöver godkänna villkoren (se markering i rött nedan) för att kunna gå vidare till ”Redigera text”.';
            expect(getByRole('alert')).toHaveTextContent(expected);
        });
    });

    describe('Page 2 Redigera introduktion till kursen', () => {
        test('Has correct introductory text', () => {
            const pageNumber = 2;
            const {getByTestId} = renderEditPage(mockAdminStore, pageNumber);
            const introText = getByTestId('intro-text');
            expect(introText).toHaveTextContent(
                'Du kan här skapa / redigera en introduktion till kursen i form av text som ersätter kortbeskrivningen som finns i KOPPS.');
            expect(introText).toHaveTextContent(
                'Vill man återgå till kortbeskrivningen tar man bort texten under ”Introduktion till kursen” nedan.');
            expect(introText).toHaveTextContent(
                'I nästa steg kan du granska bild och text (på svenska och engelska) innan du publicerar på sidan ”Kursinformation”');
        });
    });

    describe('Page 3 Granska', () => {

        const pageNumber = 3;

        test('Has correct introductory text', () => {
            const introText = renderEditPage(mockAdminStore, pageNumber).getByTestId('intro-text');
            expect(introText).toHaveTextContent(
                'I detta steg (3 av 3) visas hur bild med text kommer att se ut på sidan ”Kursinformation” (på svenska och engelska).');
            expect(introText).toHaveTextContent(
                'Här finns möjlighet att gå tillbaka för att redigera text (och ett steg till för att välja ny bild) eller publicera introduktionen på sidan ”Kursinformation”.');
        });

        test('Has correct headings', () => {
            const {getByText} = renderEditPage(mockAdminStore, pageNumber);
            getByText('Svensk introduktion till kursen');
            getByText('Engelsk introduktion till kursen');
        });
    });

/*    describe.only('Page 3C Publicering fel', () => {
        const pageNumber = 3;
        test('📌 Has correct alert text', () => {


/!*
            const container = renderEditPage(mockAdminStore,pageNumber)
            fireEvent.click(container.getByText('Publicera'))
            fireEvent.click(container.getByText('Ja, fortsätt publicera'))
*!/
            configure({ adapter: new Adapter() });
            const rejectedPromise = new Promise((resolve, reject) =>
                setTimeout(() => reject(new Error('Fel!')), 100)
            );
            const mockHandleUploadImage = jest.fn(() => Promise.reject('error'));
            let wrapper = mount(<CourseDescriptionEditorPage adminStore={mockAdminStore}/>)
            wrapper.instance().handleUploadImage = jest.fn(() => rejectedPromise);
            wrapper.update()
            wrapper.instance().handleUploadImage()
                .catch(()=> {
                wrapper.update();
                expect(wrapper.find('Alert').length).toEqual(0);
            });

        });
    });*/
});
