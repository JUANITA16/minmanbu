import React from 'react';
import '@testing-library/jest-dom';
import {render, screen, fireEvent} from '@testing-library/react';
import { ServerAPI } from "../../../services/server";
import ConfiguracionTipoEmision from '../../../views/pages/configuracion-tipo-emision'
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event'


jest.mock("@azure/msal-react", () => ({
    useMsal: () => ({ 
        instance:{ 
            getActiveAccount: jest.fn()
            .mockReturnValue(
                {
                  idTokenClaims: {name: "test_name"}
                }
            )
        } 
      })
    })
  );
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


describe('ConfiguracionTipoEmision', () => {
    test('render ConfiguracionTipoEmision with data', async () =>  {

        ServerAPI.mockImplementation(() => ({
            getAllAndFiltersTypeProduct: jest.fn().mockResolvedValue( 
                [
                    {
                        "updatedate": "2022-10-25T09:48:29-05:00",
                        "producttypemaestrosunicos": "550",
                        "user": "USER_POSTMAN_2",
                        "producttypedescription": "EMISIONES MENOS DE 6 MESES",
                        "producttype": "CDT",
                        "creationdate": "2022-10-25T09:48:29-05:00",
                        "id": "17f423f8-13d6-4441-8241-b9c33e1469b7"
                    }
                ]
            )
        }));

        await act( async () => render(<ConfiguracionTipoEmision/>));


        expect(screen.getAllByText(/Configuración Tipo Emisión/i)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/realizar la configuración de los tipos de emisión asociados/i)[0]).toBeInTheDocument();
        expect(screen.getByText(/Retroceder/i)).toBeInTheDocument();
        expect(screen.getByText(/Nuevo/i)).toBeInTheDocument();
        expect(screen.getByText(/550/i)).toBeInTheDocument();
        expect(screen.getByText(/CDT/i)).toBeInTheDocument();
    })

     
    test('click go to back', async () =>  {
        
        ServerAPI.mockImplementation(() => ({
            getAllAndFiltersTypeProduct: jest.fn().mockResolvedValue(
                [
                    {
                        "updatedate": "2022-10-25T09:48:29-05:00",
                        "producttypemaestrosunicos": "550",
                        "user": "USER_POSTMAN_2",
                        "producttypedescription": "EMISIONES MENOS DE 6 MESES",
                        "producttype": "CDT",
                        "creationdate": "2022-10-25T09:48:29-05:00",
                        "id": "17f423f8-13d6-4441-8241-b9c33e1469b7"
                    }
                ]
            )
        }));

        await act( async () => render(<ConfiguracionTipoEmision/>));

        const button = screen.getByText(/Retroceder/i)
        fireEvent.click(button)
        expect(screen.getAllByText(/Configuración contable/i)[0]).toBeInTheDocument();        
    })
     
    test('on text change tipo emisión', async () =>  {
        
        ServerAPI.mockImplementation(() => ({
            getAllAndFiltersTypeProduct: jest.fn().mockResolvedValue(
                [
                    {
                        "updatedate": "2022-10-25T09:48:29-05:00",
                        "producttypemaestrosunicos": "550",
                        "user": "USER_POSTMAN_2",
                        "producttypedescription": "EMISIONES MENOS DE 6 MESES",
                        "producttype": "CDT",
                        "creationdate": "2022-10-25T09:48:29-05:00",
                        "id": "17f423f8-13d6-4441-8241-b9c33e1469b7"
                    },
                    {
                        "updatedate": "2022-10-28T12:56:45-05:00",
                        "producttypemaestrosunicos": "552",
                        "user": "USER_POSTMAN",
                        "producttypedescription": "EMITIDOS IGUAL A 12 MESES Y MENOR DE 18 MESES",
                        "producttype": "CDT",
                        "creationdate": "2022-10-28T12:56:45-05:00",
                        "id": "f524b50f-aa21-420a-8965-756c105a6f91"
                    }
                ]
            )
        }));

        await act( async () => render(<ConfiguracionTipoEmision/>));

        const input = screen.getByLabelText("Tipo emisión")
        fireEvent.change(input,{target: {value: '123ABC'}})
        expect(input.value).toEqual('123ABC')
    })

    test('on text change Código tipo emisión', async () =>  {
        
        ServerAPI.mockImplementation(() => ({
            getAllAndFiltersTypeProduct: jest.fn().mockResolvedValue(
                [
                    {
                        "updatedate": "2022-10-25T09:48:29-05:00",
                        "producttypemaestrosunicos": "550",
                        "user": "USER_POSTMAN_2",
                        "producttypedescription": "EMISIONES MENOS DE 6 MESES",
                        "producttype": "CDT",
                        "creationdate": "2022-10-25T09:48:29-05:00",
                        "id": "17f423f8-13d6-4441-8241-b9c33e1469b7"
                    },
                    {
                        "updatedate": "2022-10-28T12:56:45-05:00",
                        "producttypemaestrosunicos": "552",
                        "user": "USER_POSTMAN",
                        "producttypedescription": "EMITIDOS IGUAL A 12 MESES Y MENOR DE 18 MESES",
                        "producttype": "CDT",
                        "creationdate": "2022-10-28T12:56:45-05:00",
                        "id": "f524b50f-aa21-420a-8965-756c105a6f91"
                    }
                ]
            )
        }));

        await act( async () => render(<ConfiguracionTipoEmision/>));

        const input = screen.getByLabelText("Código tipo emisión")
        fireEvent.change(input,{target: {value: '12345'}})
        expect(input.value).toEqual('12345')
    })
    
    test('on text change Tipo de producto', async () =>  {
        
        ServerAPI.mockImplementation(() => ({
            getAllAndFiltersTypeProduct: jest.fn().mockResolvedValue(
                [
                    {
                        "updatedate": "2022-10-25T09:48:29-05:00",
                        "producttypemaestrosunicos": "550",
                        "user": "USER_POSTMAN_2",
                        "producttypedescription": "EMISIONES MENOS DE 6 MESES",
                        "producttype": "CDT",
                        "creationdate": "2022-10-25T09:48:29-05:00",
                        "id": "17f423f8-13d6-4441-8241-b9c33e1469b7"
                    },
                    {
                        "updatedate": "2022-10-28T12:56:45-05:00",
                        "producttypemaestrosunicos": "552",
                        "user": "USER_POSTMAN",
                        "producttypedescription": "EMITIDOS IGUAL A 12 MESES Y MENOR DE 18 MESES",
                        "producttype": "CDT",
                        "creationdate": "2022-10-28T12:56:45-05:00",
                        "id": "f524b50f-aa21-420a-8965-756c105a6f91"
                    }
                ]
            )
        }));

        await act( async () => render(<ConfiguracionTipoEmision/>));

        const selectLabel = /Tipo de producto/i;
        const selectElement = await screen.findByLabelText(selectLabel);

        userEvent.click(selectElement);
        const dropdownItem = await screen.findByRole("option", { name: 'CDT' });
        userEvent.click(dropdownItem);

        const cdtElements = screen.getAllByText('CDT');
        expect(cdtElements.length).toBeGreaterThan(0);
    })

    
    test('apply filters tipoEmision', async () =>  {
        
        ServerAPI.mockImplementation(() => ({
            getAllAndFiltersTypeProduct: jest.fn()
            .mockResolvedValue(
                [
                    {
                        "updatedate": "2022-10-25T09:48:29-05:00",
                        "producttypemaestrosunicos": "550",
                        "user": "USER_POSTMAN_2",
                        "producttypedescription": "EMISIONES MENOS DE 6 MESES",
                        "producttype": "CDT",
                        "creationdate": "2022-10-25T09:48:29-05:00",
                        "id": "17f423f8-13d6-4441-8241-b9c33e1469b7"
                    }
                ]
            )
        }));

        await act( async () => render(<ConfiguracionTipoEmision/>));

        const inputCuenta = screen.getByLabelText("Tipo emisión")
        fireEvent.change(inputCuenta,{target: {value: 'EMISIONES MENOS DE 6 MESES'}})

        const button = screen.getByText("Aplicar filtros")
        fireEvent.click(button)
        const data = screen.queryByText(/552/i)
        expect(data).toEqual(null);

        expect(screen.getByText(/550/i)).toBeInTheDocument();

    })
    
    test('apply filters Tipo de producto', async () =>  {
        
        ServerAPI.mockImplementation(() => ({
            getAllAndFiltersTypeProduct: jest.fn()
            .mockResolvedValue(
                [
                    {
                        "updatedate": "2022-10-25T09:48:29-05:00",
                        "producttypemaestrosunicos": "550",
                        "user": "USER_POSTMAN_2",
                        "producttypedescription": "EMISIONES MENOS DE 6 MESES",
                        "producttype": "CDT",
                        "creationdate": "2022-10-25T09:48:29-05:00",
                        "id": "17f423f8-13d6-4441-8241-b9c33e1469b7"
                    }
                ]
            )
        }));

        await act( async () => render(<ConfiguracionTipoEmision/>));

        const selectLabel = /Tipo de producto/i;
        const selectEl = await screen.findByLabelText(selectLabel);

        userEvent.click(selectEl);
        const dropdownItem = await screen.findByRole("option", { name: 'CDT' });
        userEvent.click(dropdownItem);

        const button = screen.getByText("Aplicar filtros")
        fireEvent.click(button)
        const data = screen.queryByText(/551/i)
        expect(data).toEqual(null);

        expect(screen.getByText(/550/i)).toBeInTheDocument();

    })

})