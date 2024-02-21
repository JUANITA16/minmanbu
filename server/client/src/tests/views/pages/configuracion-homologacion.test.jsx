import React from 'react';
import '@testing-library/jest-dom';
import {render, screen, fireEvent} from '@testing-library/react';
import { ServerAPI } from "../../../services/server";
import ConfiguracionHomologacion from '../../../views/pages/configuracion-homologacion'
import { act } from 'react-dom/test-utils';


jest.mock("../../../index",()=>({
    getToken: jest.fn().mockResolvedValue("test")
}))
jest.mock('../../../services/server');
jest.mock('react-export-excel', () => {
    const originalModule = jest.requireActual('react-export-excel');
    const ExcelFile =  (props) => (<p>Test ExcelFile</p>);
    ExcelFile.ExcelSheet = (props) => (<div>Test ExcelSheet</div>);
    ExcelFile.ExcelColumn = (props) => (<div>Test ExcelSheet</div>);
    const ReactExport = {
      ExcelFile
    }
    //Mock the default export and named export 'foo'
    return {
      __esModule: true,
      ...originalModule,
      default: ReactExport
    };
  });
  
  

afterAll(() => {
    jest.resetAllMocks();
});


describe('ConfiguracionHomologacion', () => {
    test('render ConfiguracionHomologacion with data', async () =>  {

        ServerAPI.mockImplementation(() => ({
            getAllCosif: jest.fn().mockResolvedValue({
                status :200,
                data: [
                    {
                        "costcenteraccounting": "100",
                        "accounting_account": "543247",
                        "accountid": "39a1da42-7922-42e5-9355-a2124b0e4ee5",
                        "creationdate": "2022-07-21T11:59:46-05:00",
                        "cosif": "2421647"
                    }
                ]
            })
        }));

        await act( async () => render(<ConfiguracionHomologacion/>));


        expect(screen.getAllByText(/Configuración Homologaciones/i)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/realizar la configuración de de homologaciones /i)[0]).toBeInTheDocument();
        expect(screen.getByText(/Retroceder/i)).toBeInTheDocument();
        expect(screen.getByText(/Nuevo/i)).toBeInTheDocument();
    
        expect(screen.getByText(/543247/i)).toBeInTheDocument();
    })

  
    test('open modal nuevo', async () =>  {

        ServerAPI.mockImplementation(() => ({
            getAllCosif: jest.fn().mockResolvedValue({
                status :200,
                data: [
                    {
                        "costcenteraccounting": "100",
                        "accounting_account": "543247",
                        "accountid": "39a1da42-7922-42e5-9355-a2124b0e4ee5",
                        "creationdate": "2022-07-21T11:59:46-05:00",
                        "cosif": "2421647"
                    }
                ]
            })
        }));

        await act( async () => render(<ConfiguracionHomologacion/>));


        const button = await screen.getByText(/Nuevo/i)
        fireEvent.click(button)
        expect(screen.getByText(/Nuevo - Configuración homologación/i)).toBeInTheDocument();
        expect(screen.getByText(/realizar la creación de un nuevo registro/i)).toBeInTheDocument();
        
    })


     
    test('click go to back', async () =>  {
        
        ServerAPI.mockImplementation(() => ({
            getAllCosif: jest.fn().mockResolvedValue({
                status :200,
                data: [
                    {
                        "costcenteraccounting": "100",
                        "accounting_account": "543247",
                        "accountid": "39a1da42-7922-42e5-9355-a2124b0e4ee5",
                        "creationdate": "2022-07-21T11:59:46-05:00",
                        "cosif": "2421647"
                    }
                ]
            })
        }));

        await act( async () => render(<ConfiguracionHomologacion/>));

        const button = await screen.getByText(/Retroceder/i)
        fireEvent.click(button)
        expect(screen.getAllByText(/Configuración contable/i)[0]).toBeInTheDocument();        
    })
     
    test('on text change accounting_account', async () =>  {
        
        ServerAPI.mockImplementation(() => ({
            getAllCosif: jest.fn().mockResolvedValue({
                status :200,
                data: [
                    {
                        "costcenteraccounting": "0",
                        "accounting_account": "160540",
                        "accountid": "115ab9b1-9d8f-4ce1-86ce-5cd3ac73239e",
                        "creationdate": "2022-06-29T09:44:31-05:00",
                        "cosif": "1612099353"
                    },
                    {
                        "costcenteraccounting": "100",
                        "accounting_account": "543247",
                        "accountid": "39a1da42-7922-42e5-9355-a2124b0e4ee5",
                        "creationdate": "2022-07-21T11:59:46-05:00",
                        "cosif": "2421647"
                    }
                ]
            })
        }));

        await act( async () => render(<ConfiguracionHomologacion/>));

        const input = screen.getByLabelText("Número de Cuenta")
        fireEvent.change(input,{target: {value: '99999'}})
        expect(input.value).toEqual('99999')
    })

    test('on text change cosif', async () =>  {
        
        ServerAPI.mockImplementation(() => ({
            getAllCosif: jest.fn().mockResolvedValue({
                status :200,
                data: [
                    {
                        "costcenteraccounting": "0",
                        "accounting_account": "160540",
                        "accountid": "115ab9b1-9d8f-4ce1-86ce-5cd3ac73239e",
                        "creationdate": "2022-06-29T09:44:31-05:00",
                        "cosif": "1612099353"
                    },
                    {
                        "costcenteraccounting": "100",
                        "accounting_account": "543247",
                        "accountid": "39a1da42-7922-42e5-9355-a2124b0e4ee5",
                        "creationdate": "2022-07-21T11:59:46-05:00",
                        "cosif": "2421647"
                    }
                ]
            })
        }));

        await act( async () => render(<ConfiguracionHomologacion/>));

        const input = screen.getByLabelText("Número de Cuenta cosif")
        fireEvent.change(input,{target: {value: '99999'}})
        expect(input.value).toEqual('99999')
    })

    
    test('apply filters accounting_account', async () =>  {
        
        ServerAPI.mockImplementation(() => ({
            getAllCosif: jest.fn().mockResolvedValue({
                status :200,
                data: [
                    {
                        "costcenteraccounting": "0",
                        "accounting_account": "160540",
                        "accountid": "115ab9b1-9d8f-4ce1-86ce-5cd3ac73239e",
                        "creationdate": "2022-06-29T09:44:31-05:00",
                        "cosif": "1612099353"
                    },
                    {
                        "costcenteraccounting": "100",
                        "accounting_account": "543247",
                        "accountid": "39a1da42-7922-42e5-9355-a2124b0e4ee5",
                        "creationdate": "2022-07-21T11:59:46-05:00",
                        "cosif": "2421647"
                    }
                ]
            })
        }));

        await act( async () => render(<ConfiguracionHomologacion/>));

        const inputCuenta = screen.getByLabelText("Número de Cuenta")
        fireEvent.change(inputCuenta,{target: {value: '160540'}})

        const button = await screen.getByText("Aplicar filtros")
        fireEvent.click(button)
        const data = screen.queryByText(/2421647/i)
        expect(data).toEqual(null);

        expect(screen.getByText(/1612099353/i)).toBeInTheDocument();

    })


    
    test('apply filters cosif', async () =>  {
        
        ServerAPI.mockImplementation(() => ({
            getAllCosif: jest.fn().mockResolvedValue({
                status :200,
                data: [
                    {
                        "costcenteraccounting": "0",
                        "accounting_account": "160540",
                        "accountid": "115ab9b1-9d8f-4ce1-86ce-5cd3ac73239e",
                        "creationdate": "2022-06-29T09:44:31-05:00",
                        "cosif": "1612099353"
                    },
                    {
                        "costcenteraccounting": "100",
                        "accounting_account": "543247",
                        "accountid": "39a1da42-7922-42e5-9355-a2124b0e4ee5",
                        "creationdate": "2022-07-21T11:59:46-05:00",
                        "cosif": "2421647"
                    }
                ]
            })
        }));

        await act( async () => render(<ConfiguracionHomologacion/>));

        const inputCosif = screen.getByLabelText("Número de Cuenta cosif")
        fireEvent.change(inputCosif,{target: {value: '1612099353'}})

        const button = await screen.getByText("Aplicar filtros")
        fireEvent.click(button)
        const data = screen.queryByText(/2421647/i)
        expect(data).toEqual(null);

        expect(screen.getByText(/160540/i)).toBeInTheDocument();

    })
    
    
    test('apply filters no data', async () =>  {
        
        ServerAPI.mockImplementation(() => ({
            getAllCosif: jest.fn().mockResolvedValue({
                status :200,
                data: [
                    {
                        "costcenteraccounting": "0",
                        "accounting_account": "160540",
                        "accountid": "115ab9b1-9d8f-4ce1-86ce-5cd3ac73239e",
                        "creationdate": "2022-06-29T09:44:31-05:00",
                        "cosif": "1612099353"
                    },
                    {
                        "costcenteraccounting": "100",
                        "accounting_account": "543247",
                        "accountid": "39a1da42-7922-42e5-9355-a2124b0e4ee5",
                        "creationdate": "2022-07-21T11:59:46-05:00",
                        "cosif": "2421647"
                    }
                ]
            })
        }));

        await act( async () => render(<ConfiguracionHomologacion/>));

        const inputCosif = screen.getByLabelText("Número de Cuenta cosif")
        fireEvent.change(inputCosif,{target: {value: '999999'}})

        const button = await screen.getByText("Aplicar filtros")
        fireEvent.click(button)
        const data = screen.queryByText(/2421647/i)
        expect(data).toEqual(null);

        const dataFilter = screen.queryByText(/1612099353/i)
        expect(dataFilter).toEqual(null);

    })

    
    
    test('delete filters', async () =>  {
        
        ServerAPI.mockImplementation(() => ({
            getAllCosif: jest.fn().mockResolvedValue({
                status :200,
                data: [
                    {
                        "costcenteraccounting": "0",
                        "accounting_account": "160540",
                        "accountid": "115ab9b1-9d8f-4ce1-86ce-5cd3ac73239e",
                        "creationdate": "2022-06-29T09:44:31-05:00",
                        "cosif": "1612099353"
                    },
                    {
                        "costcenteraccounting": "100",
                        "accounting_account": "543247",
                        "accountid": "39a1da42-7922-42e5-9355-a2124b0e4ee5",
                        "creationdate": "2022-07-21T11:59:46-05:00",
                        "cosif": "2421647"
                    }
                ]
            })
        }));

        await act( async () => render(<ConfiguracionHomologacion/>));

        const inputCosif = screen.getByLabelText("Número de Cuenta cosif")
        fireEvent.change(inputCosif,{target: {value: '1612099353'}})

        const button = await screen.getByText("Aplicar filtros")
        fireEvent.click(button)

        const buttonDeleteFilters = await screen.getByText("Borrar filtros")
        fireEvent.click(buttonDeleteFilters)

        expect(inputCosif.value).toEqual('')

        expect(screen.getByText(/1612099353/i)).toBeInTheDocument();
        expect(screen.getByText(/2421647/i)).toBeInTheDocument();

    })
})