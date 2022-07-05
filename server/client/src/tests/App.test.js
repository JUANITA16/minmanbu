import { render, screen } from '@testing-library/react';
import "@testing-library/jest-dom";
import App from '../App';
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("../views/pages/generate-sap", () => () => <mock-widget /> );
jest.mock("../views/components/navigation-bar", () => () => <mock-widget /> );
jest.mock("../views/pages/carga-creacion-cuenta-deposito", () => () => <mock-widget /> );
jest.mock("../views/pages/Logout", () => () => <mock-widget /> );
jest.mock("../views/pages/configuracion-contable", () => () => <mock-widget /> );
jest.mock("../views/components/IdleLogout", () => () => <mock-widget /> );

jest.mock("@azure/msal-react", () => ({
  useMsal: () => ({ 
      instance:{ 
          getActiveAccount: jest.fn()
          .mockReturnValueOnce({ idTokenClaims: { roles: ["MINMAMBU_ROLE_ADMIN"], preferred_username: "test" } })
          .mockReturnValueOnce({ idTokenClaims: { roles: undefined } })
      } 
  }),
  AuthenticatedTemplate: ({children}) => (<>{children}</>),
  UnauthenticatedTemplate: ({children}) => (<>{children}</>)
}));

afterAll(() => {
  jest.resetAllMocks();
});


beforeAll(() => {
  process.env.PUBLIC_URL = "";
});


describe('App', () => {
  test('render home', () => {
    render( 
      <Router>
          <App /> 
      </Router>
    );
    expect(screen.getByText(/Mini mambu página principal./i)).toBeInTheDocument();
  });  
});
