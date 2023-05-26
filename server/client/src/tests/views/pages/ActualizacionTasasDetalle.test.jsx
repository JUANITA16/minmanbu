import React from 'react';
import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';
import ActualizacionTasasDetalle from '../../../views/pages/ActualizacionTasasDetalle'
import { act } from 'react-dom/test-utils';
import selectEvent from 'react-select-event'


afterAll(() => {
    jest.resetAllMocks();
});


global.M = require('react-materialize');
global.M = require('materialize-css');

let details = []
let setIsPantallaPrincipal = jest.fn()
let setdetails = jest.fn()
describe('ActualizacionTasasDetalle', () => {
    test('render ActualizacionTasasDetalle', async () =>  {
        await act( async () => render(<ActualizacionTasasDetalle 
            setIsPantallaPrincipal={setIsPantallaPrincipal}
            details={details} setdetails={setdetails} isCuentaCorriente={false}/>));
    })

    test('select cant pages', async () =>  {

       
        await act( async () => render(<ActualizacionTasasDetalle setIsPantallaPrincipal={setIsPantallaPrincipal}
            details={details} setdetails={setdetails}  isCuentaCorriente={false}/>));

        await selectEvent.select(screen.getByLabelText('Cantidad de registros'), '20')
        
        expect(screen.getByTestId('cantRegForm')).toHaveFormValues({
            cantRegSelect: '20',
        })
    })

    
    test('Cuenta Corriente', async () =>  {
        await act( async () => render(<ActualizacionTasasDetalle setIsPantallaPrincipal={setIsPantallaPrincipal}
            details={details} setdetails={setdetails}  isCuentaCorriente={true}/>));

        expect(screen.getByText(/Nro. Cuenta/i)).toBeInTheDocument();
    })

    
    
    test('Not Cuenta Corriente', async () =>  {
        await act( async () => render(<ActualizacionTasasDetalle setIsPantallaPrincipal={setIsPantallaPrincipal}
            details={details} setdetails={setdetails}  isCuentaCorriente={false}/>));

        expect(screen.getAllByText(/Id/i)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/Estado/i)[0]).toBeInTheDocument();
    })

})