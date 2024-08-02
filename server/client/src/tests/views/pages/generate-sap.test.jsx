import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from "@testing-library/react";
import { GenerateSap } from "../../../views";
import { ServerAPI } from "../../../services/server";

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
jest.mock('react-export-excel', () => {
  const originalModule = jest.requireActual('react-export-excel');
  const ExcelFile = (/* _props */) => (<p>Test ExcelFile</p>);
  ExcelFile.ExcelSheet = (/* _props */) => (<div>Test ExcelSheet</div>);
  ExcelFile.ExcelColumn = (/* _props */) => (<div>Test ExcelColumn</div>);
  const ReactExport = {
    ExcelFile
  };
  //Mock the default export and named export 'foo'
  return {
    __esModule: true,
    ...originalModule,
    default: ReactExport
  };
});


beforeEach(() => {
  process.env.PUBLIC_URL = "url_test";
  process.env.REACT_APP_SERVER_BASE_PATH = "test";
}
);
afterEach(() => {
  jest.resetAllMocks();
});
describe('Test view Generate SAP', () => {
  test('sap screen - ok', () => {
    render(<GenerateSap />);
    expect(screen.getByText("Archivo SAP")).toBeInTheDocument();
  });
  test('sap button submit - ok', () => {
    ServerAPI.mockImplementation(() => ({
      generateSAP: jest.fn().mockResolvedValue({message: "test message"})
    }));

    render(<GenerateSap />);
    const SubmitButton = screen.getByTestId("test-submit");
    fireEvent.click(SubmitButton);
    expect(SubmitButton.disabled).toBe(true);
  });
});