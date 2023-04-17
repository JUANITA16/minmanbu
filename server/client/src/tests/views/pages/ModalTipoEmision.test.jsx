import React from 'react';
import '@testing-library/jest-dom';
import {render, screen, fireEvent} from '@testing-library/react';
import { ServerAPI } from "../../../services/server";
import ModalTipoEmision from '../../../views/pages/ModalTipoEmision'
import { act } from 'react-dom/test-utils';

afterAll(() => {
    jest.resetAllMocks();
});
jest.mock("../../../index",()=>({
    getToken: jest.fn().mockResolvedValue("test")
}))
jest.mock('../../../services/server');

global.M = require('react-materialize');
global.M = require('materialize-css');

let setEdits = jest.fn()
let setOpen = jest.fn()

describe('Test Modal tipo emision', () => {
    test('Render page', () => {
      render(<ModalTipoEmision title="Nuevo-test"
        description="Descripcion-test" 
        setEdits={setEdits}
        setOpen={setOpen} 
        info={{
          id: "",
          producttypedescription: "", 
          producttypemaestrosunicos: "",
          user: "user-test"
        }}
        tipoProceso="Nuevo"
        />);
      expect(screen.getByText("Tipo emisión")).toBeInTheDocument();
      expect(screen.getByText("Nuevo-test")).toBeInTheDocument();
      expect(screen.getByText("Descripcion-test")).toBeInTheDocument();
    });
    test('Render page', async () => {
        await act( async () => render(<ModalTipoEmision title="Nuevo-test"
        description="Descripcion-test" 
        setEdits={setEdits}
        setOpen={setOpen} 
        info={{
          id: "",
          producttypedescription: "", 
          producttypemaestrosunicos: "",
          user: "user-test"
        }}
        tipoProceso="Nuevo"
        />));
        
          const button = await screen.getByText(/Guardar/i)
          fireEvent.click(button)
          expect(screen.getByText("Todos los campos son de diligenciamiento obligatorio.")).toBeInTheDocument();
      });


  })