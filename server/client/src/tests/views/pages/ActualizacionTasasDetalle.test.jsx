import React from 'react';
import '@testing-library/jest-dom';
import {render, screen, fireEvent} from '@testing-library/react';
import ActualizacionTasasDetalle from '../../../views/pages/ActualizacionTasasDetalle'
import { act } from 'react-dom/test-utils';
import selectEvent from 'react-select-event'


afterAll(() => {
    jest.resetAllMocks();
});


global.M = require('react-materialize');
global.M = require('materialize-css');


describe('ActualizacionTasasDetalle', () => {
    test('render ActualizacionTasasDetalle', async () =>  {
        await act( async () => render(<ActualizacionTasasDetalle/>));
    })

    test('select cant pages', async () =>  {

       
        await act( async () => render(<ActualizacionTasasDetalle/>));

        await selectEvent.select(screen.getByLabelText('Cantidad de registros'), '20')
        
        expect(screen.getByTestId('cantRegForm')).toHaveFormValues({
            cantRegSelect: '20',
        })
    })


})