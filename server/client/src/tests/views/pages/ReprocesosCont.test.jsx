import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from "@testing-library/react";
import { GenerateSap } from "../../../views";
import { ServerAPI } from "../../../services/server";
import ReprocesosContablesD from '../../../views/pages/ReprocesosCont';

jest.mock("../../../index",()=>({
    getToken: jest.fn().mockResolvedValue("test")
  }));
  
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

beforeEach(() => {
  process.env.PUBLIC_URL = "url_test";
  process.env.REACT_APP_SERVER_BASE_PATH = "test";
    }
    );

afterEach(() => {
  jest.resetAllMocks();
});



describe('Test view Reprocesos Contables', () => {
  test('Reprocesos screen - ok', () => {
    render(<ReprocesosContablesD />);
    expect(screen.getByText("Generación Contabilidad Dominus")).toBeInTheDocument();
  });

})