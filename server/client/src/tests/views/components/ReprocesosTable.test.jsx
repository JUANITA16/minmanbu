import React from 'react';
import '@testing-library/jest-dom';
import {render, screen } from '@testing-library/react';
import ReprTable from '../../../views/components/ReprocesosTable';



afterAll(() => {
    jest.resetAllMocks();
});


describe('Reprocesos Table', () => {
    test('render Table - ok', () => {
        const tableData = [ {
            id: "1234",
            date_process: "2022-06-09",
            user: "Cristian Torrejon",
            date_event: "2022-06-01",
            detailed: "detalle1, detalle2, detalle3",
            value: "10000000",
            type_process: "Continuo",
            status_code: "200",
            status: "Exitoso",
            data_group: "555566633"
        
          }]
        render(
            <ReprTable tableData={tableData}/>
        );

        expect(screen.getByText(/Consecutivo/i)).toBeInTheDocument();
        expect(screen.getByText(/1234/i)).toBeInTheDocument();
    })

    test('table empty', () => {
        const tableData = ["Empty"]

        render(
            <ReprTable tableData={tableData} />
        );

        expect(screen.getByText(/No se encontraron registros./i)).toBeInTheDocument();
    })

    test('setIsLoading true', () => {
        const tableData = []

        render(
            <ReprTable tableData={tableData} />
        );

        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    })


})