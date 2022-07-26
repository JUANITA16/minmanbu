import { render, screen, fireEvent } from '@testing-library/react';
import "@testing-library/jest-dom";

import { BrowserRouter as Router } from "react-router-dom";
import NavigationBar from '../../../views/components/navigation-bar'


jest.mock("@azure/msal-react", () => ({
    useMsal: () => ({ 
        instance:{ 
            getActiveAccount: jest.fn().mockRejectedValue({ homeAccountId: "home_test"}),
            getAccountByHomeId: jest.fn().mockRejectedValue("account_test"),
            logoutRedirect: jest.fn().mockRejectedValue("logout_test")
        } 
    })
  }));

global.M = require('react-materialize');
global.M = require('materialize-css');

beforeAll(() => {
    process.env.PUBLIC_URL = "url_test";
    process.env.REACT_APP_REDIRECT_URI = "";
});
  
describe('navigation-bar', () => {

    test('render navigation-bar', () => {
        render(
            <Router>
                <NavigationBar/> 
            </Router>
        )
        expect(screen.getAllByText(/Home/i)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/Sap/i)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/Creación masiva/i)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/Configuración contable/i)[0]).toBeInTheDocument();
    });  
      
    
    test('click iconButton', () => {
        render(
            <Router>
                <NavigationBar/> 
            </Router>
        )
        const navigation = screen.getAllByRole('button')
        fireEvent.click(navigation[1])
        expect(screen.getAllByText(/Home/i)[0]).toBeInTheDocument();
    });  
      
})
