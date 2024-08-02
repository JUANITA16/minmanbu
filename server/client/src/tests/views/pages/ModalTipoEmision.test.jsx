import React from 'react';
import '@testing-library/jest-dom';
import {render, screen, fireEvent} from '@testing-library/react';
import ModalTipoEmision from '../../../views/pages/ModalTipoEmision'
import { act } from 'react-dom/test-utils';
import 'materialize-css/dist/css/materialize.min.css';
import * as Materialize from 'materialize-css';

afterAll(() => {
  jest.resetAllMocks();
});
jest.mock("../../../index",()=>({
  getToken: jest.fn().mockResolvedValue("test")
}))
jest.mock('../../../services/server');
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
global.M = Materialize;

const setEdits = jest.fn();
const setOpen = jest.fn();

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

  test('Create emision', async () => {
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

    const button = screen.getByText(/Guardar/i)
    fireEvent.click(button)
    expect(screen.getByText("Todos los campos son de diligenciamiento obligatorio.")).toBeInTheDocument();
  });


  test('Update emision', async () => {
    await act( async () => render(<ModalTipoEmision title="Editar-test"
      description="Descripcion-test-Editar"
      setEdits={setEdits}
      setOpen={setOpen}
      info={{
        id: "123",
        producttypedescription: "TEST",
        producttypemaestrosunicos: "123456",
        user: "user-test"
      }}
      tipoProceso="Editar"
    />));

    expect(screen.getByText("Tipo emisión")).toBeInTheDocument();
    expect(screen.getByText("Descripcion-test-Editar")).toBeInTheDocument();
    expect(screen.getByText("Editar-test")).toBeInTheDocument();
  });

})