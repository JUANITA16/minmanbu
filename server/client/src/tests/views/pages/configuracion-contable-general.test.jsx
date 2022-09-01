import React from 'react';
import '@testing-library/jest-dom';
import {render, screen, fireEvent} from '@testing-library/react';
import { ServerAPI } from "../../../services/server";
import ConfiguracionContableGeneral from '../../../views/pages/configuracion-contable-general'
import { act } from 'react-dom/test-utils';
import selectEvent from 'react-select-event'

jest.mock("../../../index",()=>({
    getToken: jest.fn().mockResolvedValue("test")
}))
jest.mock('../../../services/server');


afterAll(() => {
    jest.resetAllMocks();
});


global.M = require('react-materialize');
global.M = require('materialize-css');


describe('ConfiguracionContableGeneral', () => {
    test('render ConfiguracionContableGeneral with data', async () =>  {

        ServerAPI.mockImplementation(() => ({
            getAllTaxAProdT: jest.fn().mockResolvedValue({
                status :200,
                data: [
                    {
                        "updatedate": "2022-06-10T12:31:45-05",
                        "producttypemaestrosunicos": "12",
                        "credittaxaccount": "12",
                        "credittaxaccountinterest": "12",
                        "debittaxaccountinterest": "12",
                        "debittaxaccount": "13",
                        "producttypedescription": "NO APLICA",
                        "creationdate": "2022-06-10T09:05:15-05",
                        "taxaccountid": "333a771c518948d7b935271ebbeacfd2"
                    }
                ]
            })
        }));
        await act( async () => render(<ConfiguracionContableGeneral/>));
        
        expect(screen.getAllByText(/Configuración general/i)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/asociada a los movimientos de CDTs desde Dominus/i)[0]).toBeInTheDocument();
        expect(screen.getByText(/Retroceder/i)).toBeInTheDocument();
        expect(screen.getByText(/Nuevo/i)).toBeInTheDocument();
    
        expect(screen.getByText(/NO APLICA/i)).toBeInTheDocument();
    })


    test('render ConfiguracionContableGeneral without data', async () =>  {

        ServerAPI.mockImplementation(() => ({
            getAllTaxAProdT: jest.fn().mockResolvedValue({
                status :200,
                data: []
            })
        }));
        await act( async () => render(<ConfiguracionContableGeneral/>));
        const data = screen.queryByText(/NO APLICA/i)
        expect(data).toEqual(null);
        
    })

    
    test('render ConfiguracionContableGeneral error data', async () =>  {

        ServerAPI.mockImplementation(() => ({
            getAllTaxAProdT: jest.fn().mockResolvedValue({
                status :400,
                detail: "Error en traer data"
            })
        }));
        await act( async () => render(<ConfiguracionContableGeneral/>));
        const data = screen.queryByText(/NO APLICA/i)
        expect(data).toEqual(null);
    })

    
    test('open modal nuevo', async () =>  {

        ServerAPI.mockImplementation(() => ({
            getAllTaxAProdT: jest.fn().mockResolvedValue({
                status :200,
                data: [
                    {
                        "updatedate": "2022-06-10T12:31:45-05",
                        "producttypemaestrosunicos": "12",
                        "credittaxaccount": "12",
                        "credittaxaccountinterest": "12",
                        "debittaxaccountinterest": "12",
                        "debittaxaccount": "13",
                        "producttypedescription": "NO APLICA",
                        "creationdate": "2022-06-10T09:05:15-05",
                        "taxaccountid": "333a771c518948d7b935271ebbeacfd2"
                    }
                ]
            })
        }));
        await act( async () => render(<ConfiguracionContableGeneral/>));

        const button = await screen.getByText(/Nuevo/i)
        fireEvent.click(button)
        expect(screen.getByText(/Nuevo - Configuración general/i)).toBeInTheDocument();
        expect(screen.getByText(/realizar la creación de un nuevo registro/i)).toBeInTheDocument();
        
    })

    
    test('open modal editar', async () =>  {

        ServerAPI.mockImplementation(() => ({
            getAllTaxAProdT: jest.fn().mockResolvedValue({
                status :200,
                data: [
                    {
                        "updatedate": "2022-06-10T12:31:45-05",
                        "producttypemaestrosunicos": "12",
                        "credittaxaccount": "12",
                        "credittaxaccountinterest": "12",
                        "debittaxaccountinterest": "12",
                        "debittaxaccount": "13",
                        "producttypedescription": "NO APLICA",
                        "creationdate": "2022-06-10T09:05:15-05",
                        "taxaccountid": "333a771c518948d7b935271ebbeacfd2"
                    }
                ]
            })
        }));
        await act( async () => render(<ConfiguracionContableGeneral/>));

        const button = await screen.getByText(/Editar/i)
        fireEvent.click(button)
        expect(screen.getByText(/Editar - Configuración general/i)).toBeInTheDocument();
        expect(screen.getByText(/realizar la edición de los registros/i)).toBeInTheDocument();
        
    })
    
    test('click go to back', async () =>  {

        ServerAPI.mockImplementation(() => ({
            getAllTaxAProdT: jest.fn().mockResolvedValue({
                status :200,
                data: [
                    {
                        "updatedate": "2022-06-10T12:31:45-05",
                        "producttypemaestrosunicos": "12",
                        "credittaxaccount": "12",
                        "credittaxaccountinterest": "12",
                        "debittaxaccountinterest": "12",
                        "debittaxaccount": "13",
                        "producttypedescription": "NO APLICA",
                        "creationdate": "2022-06-10T09:05:15-05",
                        "taxaccountid": "333a771c518948d7b935271ebbeacfd2"
                    }
                ]
            })
        }));
        await act( async () => render(<ConfiguracionContableGeneral/>));

        const button = await screen.getByText(/Retroceder/i)
        fireEvent.click(button)
        expect(screen.getAllByText(/Configuración contable/i)[0]).toBeInTheDocument();        
    })

    
    test('select cant pages', async () =>  {

        ServerAPI.mockImplementation(() => ({
            getAllTaxAProdT: jest.fn().mockResolvedValue({
                status :200,
                data: [
                    {
                        "updatedate": "2022-06-10T12:31:45-05",
                        "producttypemaestrosunicos": "12",
                        "credittaxaccount": "12",
                        "credittaxaccountinterest": "12",
                        "debittaxaccountinterest": "12",
                        "debittaxaccount": "13",
                        "producttypedescription": "NO APLICA",
                        "creationdate": "2022-06-10T09:05:15-05",
                        "taxaccountid": "333a771c518948d7b935271ebbeacfd2"
                    }
                ]
            })
        }));
        await act( async () => render(<ConfiguracionContableGeneral/>));

        await selectEvent.select(screen.getByLabelText('Cantidad de registros'), '20')
        
        expect(screen.getByTestId('cantRegForm')).toHaveFormValues({
            cantRegSelect: '20',
        })
    })


    
    test('select emisiones', async () =>  {

        ServerAPI.mockImplementation(() => ({
            getAllTaxAProdT: jest.fn().mockResolvedValue({
                status :200,
                data: [
                    {
                        "updatedate": "2022-06-10T12:31:45-05",
                        "producttypemaestrosunicos": "12",
                        "credittaxaccount": "12",
                        "credittaxaccountinterest": "12",
                        "debittaxaccountinterest": "12",
                        "debittaxaccount": "13",
                        "producttypedescription": "NO APLICA",
                        "creationdate": "2022-06-10T09:05:15-05",
                        "taxaccountid": "333a771c518948d7b935271ebbeacfd2"
                    }
                ]
            })
        }));
        await act( async () => render(<ConfiguracionContableGeneral/>));

        await selectEvent.select(screen.getByLabelText('Tipo de emisión'), "NO APLICA")
        
        expect(screen.getByTestId('tipoEmisionForm')).toHaveFormValues({
            tipoEmisionSelect: 'NO APLICA',
        })
    })
})