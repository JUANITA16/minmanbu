import React from 'react';
import '@testing-library/jest-dom';
import {render, screen, fireEvent} from '@testing-library/react';
import MyTable from '../../../views/components/EmisionTable'


afterAll(() => {
    jest.resetAllMocks();
});


describe('EmisionTable', () => {
    test('render HoTable', () => {
        const tableData = [
            {
                "updatedate": "2022-10-25T09:48:29-05:00",
                "producttypemaestrosunicos": "550",
                "user": "USER_POSTMAN_2",
                "producttypedescription": "EMISIONES MENOS DE 6 MESES",
                "creationdate": "2022-10-25T09:48:29-05:00",
                "id": "17f423f8-13d6-4441-8241-b9c33e1469b7"
            }
        ]
        const setEdits = 0

        render(
            <MyTable tableData={tableData} setEdits={setEdits}/>
        );

        expect(screen.getByText(/EMISIONES MENOS DE 6 MESES/i)).toBeInTheDocument();
    })

    test('table empty', () => {
        const tableData = ["Empty"]
        const setEdits = 0

        render(
            <MyTable tableData={tableData} setEdits={setEdits}/>
        );

        expect(screen.getByText(/No se encontraron registros./i)).toBeInTheDocument();
    })

    test('setIsLoading true', () => {
        const tableData = []
        const setEdits = 0

        render(
            <MyTable tableData={tableData} setEdits={setEdits}/>
        );

        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    })

})