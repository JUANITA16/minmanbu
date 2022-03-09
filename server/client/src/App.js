import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { Container, Card, Section } from 'react-materialize'
import { ToastContainer } from 'react-toastify';
import { Home, GenerateSap, NavigationBar ,CreacionCuenta, Error404, Logout } from './views/index'

import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import React from 'react';

export default function App() {
  const base = process.env.PUBLIC_URL;
  const { instance } = useMsal();
  const user = instance.getActiveAccount()?.idTokenClaims

  console.log("USER", user);

  return (
    <Section className="blue-grey lighten-5 p0">
      <Router>
        
        <NavigationBar />
        <Container className='bg-white'>
          <Card className="z-depth-3">
            {user &&
              <AuthenticatedTemplate>
              {(user.roles === undefined ?
                <Error404 /> :
                <Switch>
                  <Route path={base + '/'} exact component={Home} />
                  {(user.roles.includes("MINMAMBU_ROLE_ADMINISTRADOR_DEV") || 
                    user.roles.includes("MINMAMBU_ROLE_CUENTES_MASIVAS_CC_DEV") || 
                    user.roles.includes("MINMAMBU_ROLE_CUENTAS_MASIVAS_CDT_DEV")) ? 
                    <Route path={base + '/ui-crea-cuenta-deposito'} exact component={CreacionCuenta} />:
                    <Route path={base + '/ui-crea-cuenta-deposito'} exact component={Error404} />
                  }
                  {(user.roles.includes("MINMAMBU_ROLE_ADMINISTRADOR_DEV") || 
                    user.roles.includes("MINMAMBU_ROLE_CONTABILIDAD_DEV")) ? 
                    <Route path={base + '/ui-generate-sap'} exact component={GenerateSap} />:
                    <Route path={base + '/ui-generate-sap'} exact component={Error404} />
                  }
                </Switch>
              )}
              </AuthenticatedTemplate>
            }
            <UnauthenticatedTemplate>
              <Route path={base + '/'} exact component={Logout} />
              <Route path="*">
                  <Redirect to={"/"} />
              </Route>
            </UnauthenticatedTemplate>
          </Card>
        </Container>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable={false}
          pauseOnHover />
          
      </Router>
    </Section>
  );
}
