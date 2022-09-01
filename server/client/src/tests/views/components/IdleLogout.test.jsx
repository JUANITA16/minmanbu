import React from 'react';
import '@testing-library/jest-dom';
import {render, screen, fireEvent} from '@testing-library/react';
import IdleLogout from '../../../views/components/IdleLogout'
import { createMocks } from 'react-idle-timer'

jest.mock("@azure/msal-react", () => ({
    useMsal: () => ({ 
        instance:{ 
            getActiveAccount: jest.fn()
            .mockReturnValueOnce(
                {
                 homeAccountId: "homeAccountId-test"
                }
            ),
            getAccountByHomeId: jest.fn()
            .mockReturnValueOnce("getAccountByHomeId-test"),
            logoutRedirect: jest.fn()
            .mockReturnValueOnce("logoutRedirect-test")
        } 
    }),
    AuthenticatedTemplate: ({children}) => (<>{children}</>),
    UnauthenticatedTemplate: ({children}) => (<>{children}</>)
}));
  

beforeAll(() => {
    createMocks();
    process.env.REACT_APP_REDIRECT_URI = "";
});


describe('HoTable', () => {
    test('render HoTable', () => {
        render(
            <IdleLogout/>
        );
        const title = screen.queryByText(/ha expirado./i)
        expect(title).toEqual(null);
    });

});