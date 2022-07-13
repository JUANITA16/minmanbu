import React from 'react';
import '@testing-library/jest-dom';
import {render, screen, fireEvent} from '@testing-library/react';
import MyTable from '../../../views/components/HoTable'

jest.mock("../../../views/pages/ModalHomologacion", () => () => <mock-widget /> );


afterAll(() => {
    jest.resetAllMocks();
});


describe('HoTable', () => {
    test('render HoTable', () => {
        const tableData = [
            {
                "updatedate": "2022-06-14T00:06:10Z",
                "accountid": "76b848c3-b7e0-48f1-a0cb-8b8818fe2270",
                "costcenteraccounting": "8888888888",
                "accounting_account": "0000001",
                "creationdate": "2022-06-09T09:04:05Z",
                "cosif": "8176900003"
            }
        ]
        const setEdits = 0

        render(
            <MyTable tableData={tableData} setEdits={setEdits}/>
        );

        expect(screen.getByText(/Número de Cuenta./i)).toBeInTheDocument();
        expect(screen.getByText(/8888888888/i)).toBeInTheDocument();
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

    test('click edit', async() => {
        const tableData = [
            {
                "updatedate": "2022-06-14T00:06:10Z",
                "accountid": "76b848c3-b7e0-48f1-a0cb-8b8818fe2270",
                "costcenteraccounting": "8888888888",
                "accounting_account": "0000001",
                "creationdate": "2022-06-09T09:04:05Z",
                "cosif": "8176900003"
            }
        ]
        const setEdits = 0

        render(
            <MyTable tableData={tableData} setEdits={setEdits}/>
        );
        const button = await screen.getByText(/Editar/i)
        fireEvent.click(button)
        expect(screen.getByRole("presentation")).toBeInTheDocument();
    })

})