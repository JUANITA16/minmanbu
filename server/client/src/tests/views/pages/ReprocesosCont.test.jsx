import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from "@testing-library/react";
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

jest.mock('react-export-excel', () => {
  const originalModule = jest.requireActual('react-export-excel');
  const ExcelFile = (_props) => (<p>Test ExcelFile</p>);
  ExcelFile.ExcelSheet = (_props) => (<div>Test ExcelSheet</div>);
  ExcelFile.ExcelColumn = (_props) => (<div>Test ExcelColumn</div>);
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

describe('Test view Reprocesos Contables', () => {
  test('Reprocesos screen - ok', () => {
    render(<ReprocesosContablesD />);
    expect(screen.getByText("Generación Contabilidad Dominus")).toBeInTheDocument();
  });

})