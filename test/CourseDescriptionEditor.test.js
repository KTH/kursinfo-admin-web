import React from 'react';
import {Provider} from 'mobx-react';
import {fireEvent, render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import '@babel/runtime/regenerator';
import mockAdminStore from './mocks/adminStore';
import CourseDescriptionEditorPage from '../public/js/app/pages/CourseDescriptionEditorPage';

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

    describe('Page 1C Bildval felaktigt', () => {

        const expectedAlert = 'Du behöver välja en bild med rätt format (se markering i rött nedan) för att kunna gå vidare till ”Redigera text”.';
        const expectedErrorMessage = 'Obligatoriskt (format: .png eller .jpg)';

        test('Has correct alert text and error message (no image selected)', async () => {
            const {getByText, getByLabelText, getByRole, getByTestId} = renderEditPage();

            expect(getByLabelText('Bild vald utifrån kursens huvudområde').checked).toBeTruthy();
            expect(getByLabelText('Egen vald bild').checked).toBeFalsy();
            getByLabelText('Egen vald bild').click()

            //No error message visible initially
            const errorMessageSpan = getByTestId('error-text')
            expect(errorMessageSpan).toHaveClass('no-error')

            getByText('Redigera text').click();

            //Alert and Error Message assertion
            expect(getByRole('alert')).toHaveTextContent(expectedAlert);
            expect(errorMessageSpan).toHaveTextContent(expectedErrorMessage)
        });

        test('Has correct alert text and error message (wrong format chosen)', () => {
            const {getByText, getByLabelText, getByRole, getByTestId} = renderEditPage();

            expect(getByLabelText('Bild vald utifrån kursens huvudområde').checked).toBeTruthy();
            expect(getByLabelText('Egen vald bild').checked).toBeFalsy();
            getByLabelText('Egen vald bild').click()

            //No error message visible initially
            const errorMessageSpan = getByTestId('error-text')
            expect(errorMessageSpan).toHaveClass('no-error')

            //simulate file upload with incorrect format
            const imageInput = getByTestId('fileUpload')
            fireEvent.change(imageInput, {
                target: {
                    files: [new File(['(⌐□_□)'], 'empty.txt', {type: 'text'})],
                },
            })

            //Alert and Error Message assertion
            expect(getByRole('alert')).toHaveTextContent(expectedAlert);
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
        const expected = 'Observera att den egna valda bilden som nu är publicerad kommer att raderas när du publicerar i steg 3.';

        test('Has correct alert text (published image, switch to default)', () => {
            const {getByRole, getByLabelText} = renderWithState(PUBLISHED_IMAGE_EXISTS);
            getByLabelText(useDefaultImage).click();
            expect(getByRole('alert')).toHaveTextContent(expected);
        });

        test('No alert (no published image, upload image, switch to default)', () => {
            const {queryByRole, getByLabelText} = renderWithState(IMAGE_SELECTED_FOR_UPLOAD);
            getByLabelText(useDefaultImage).click();
            expect(queryByRole('alert')).toBeFalsy();
        });

        test('Can go to next page (upload image, switch to default) - used to be a bug', () => {
            const {getByText, getByLabelText} = renderWithState(IMAGE_SELECTED_FOR_UPLOAD);
            getByLabelText(useDefaultImage).click();
            getByText('Redigera text').click()
            expect(getByText('Granska')).toBeInTheDocument()
        });

        test('Has correct alert text (published image, upload image, switch to default)', () => {
            const {getByRole, getByLabelText, getByTestId} = renderWithState(OVERWRITE_PUBLISHED_IMAGE);
            getByLabelText(useDefaultImage).click();
            expect(getByRole('alert')).toHaveTextContent(expected);
        });
    });

    describe('Page 1H Godkänna villkor', () => {

        const expected = 'Du behöver godkänna villkoren (se markering i rött nedan) för att kunna gå vidare till ”Redigera text”.';

        test('Has correct alert text (selected image, not agreed to terms)', () => {
            const {getByRole, getByTestId} = renderWithState(IMAGE_SELECTED_FOR_UPLOAD);
            getByTestId('termsAgreement').click();
            getByTestId('termsAgreement').click();
            expect(getByRole('alert')).toHaveTextContent(expected);
        });

        test('Must tick box to continue if image was uploaded', () => {
            const {getByLabelText, getByTestId, getByText, getByRole, queryByRole} = renderWithState(IMAGE_SELECTED_FOR_UPLOAD);
            expect(getByLabelText('Bild vald utifrån kursens huvudområde').checked).toBeFalsy();
            expect(getByLabelText('Egen vald bild').checked).toBeTruthy();

            const errorText = getByTestId('error-text')
            expect(errorText).toHaveClass('no-error')

            getByText('Redigera text').click();

            // Expect alert, error message and a disabled button
            expect(getByRole('alert')).toHaveTextContent(expected);
            expect(errorText).toHaveClass('error-label')
            expect(getByText('Redigera text').disabled).toBeTruthy()

            getByTestId('termsAgreement').click();

            // Expect no alert, no error message and an enabled button
            expect(queryByRole('alert')).toBeFalsy();
            expect(errorText).toHaveClass('no-error')
            expect(getByText('Redigera text').disabled).toBeFalsy()
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

    describe('Page 3B Att tänka på innan du publicerar', () => {

        const pageNumber = 3;

        test('Has correct modal text', async () => {
            const {getByText} = renderWithState({}, pageNumber);
            getByText('Publicera').click();
            expect(getByText(/Kurs: SF1624/)).toBeTruthy()
            const regExpected = /Publicering kommer att ske på sidan ”Kursinformation” och ersätta befintlig introduktion \(bild och text\) till kursen\./;
            expect(getByText(regExpected)).toBeTruthy()
            expect(getByText(/Vill du fortsätta att publicera?/)).toBeTruthy()
        });
    });

    describe('Page 3C Publicering fel', () => {

        const pageNumber = 3;

        test('Has correct alert text', async () => {
            const oldXMLHttpRequest = window.XMLHttpRequest;
            window.XMLHttpRequest = jest.fn(() => {
                return {
                    upload: {
                        addEventListener: jest.fn(() => {
                            throw 'trigger error state, for test purposes'
                        })
                    }
                }
            });

            const {getByText, findByRole, getByRole} = renderWithState(IMAGE_SELECTED_FOR_UPLOAD, pageNumber);
            getByText('Publicera').click();
            getByText('Ja, fortsätt publicera').click();

            expect(await findByRole('alert')).toHaveTextContent('Det gick inte att publicera den bild du valt. Gå tillbaka till ”Välj bild” för att byta bild. Prova sedan att ”Publicera”.');
            window.XMLHttpRequest = oldXMLHttpRequest;
        });
    });

    describe('Page 3 Publish Progress Bar', () => {
        test('Progress bar should not be visible before publish action', () => {
            const pageNumber = 3;
            const {queryByRole, getByText, findByRole} = renderEditPage(mockAdminStore, pageNumber);
            expect(queryByRole('status')).toBeNull();

            getByText('Publicera').click();
            getByText('Ja, fortsätt publicera').click();
            expect(findByRole('status')).toBeTruthy();
        });
    });
});
