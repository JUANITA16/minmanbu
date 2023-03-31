import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { Container, Card, Section } from 'react-materialize'
import { ToastContainer } from 'react-toastify';
import { Home, GenerateSap, NavigationBar ,CreacionCuenta, Error404, Logout, ConfiguracionContable } from './views/index'

import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import React from 'react';
import IdleLogout from './views/components/IdleLogout';
import ActualizacionTasas from './views/pages/ActualizacionTasas';
import ReprocesosContablesD from './views/pages/ReprocesosCont';

export default function App() {
  const base = process.env.PUBLIC_URL;
  const { instance } = useMsal();
  const user = instance.getActiveAccount()?.idTokenClaims
  return (
    <Section className="blue-grey lighten-5 p0">
      <Router>
        <NavigationBar />
        <Container className='bg-white'>
          <Card className="z-depth-3">
            {user &&
              <AuthenticatedTemplate>
                <IdleLogout />
              {(user.roles === undefined ?
                <Error404 /> :
                <Switch>
                  <Route path={base + '/'} exact component={Home} />
                  {(user.roles.includes("MINMAMBU_ROLE_ADMIN") || 
                    user.roles.includes("MINMAMBU_ROLE_ADMIN_PRODUCT_CC") || 
                    user.roles.includes("MINMAMBU_ROLE_ADMIN_PRODUCT_CDT")) ? 
                    <Route path={base + '/ui-crea-cuenta-deposito'} exact component={CreacionCuenta} />:
                    <Route path={base + '/ui-crea-cuenta-deposito'} exact component={Error404} />
                  }
                  {(user.roles.includes("MINMAMBU_ROLE_ADMIN") || 
                    user.roles.includes("MINMAMBU_ROLE_ADMIN_FINANCE")) ? 
                    <Route path={base + '/ui-generate-sap'} exact component={GenerateSap} />:
                    <Route path={base + '/ui-generate-sap'} exact component={Error404} />
                  }
                  {(user.roles.includes("MINMAMBU_ROLE_ADMIN") || 
                    user.roles.includes("MINMAMBU_ROLE_ADMIN_FINANCE")) ? 
                    <Route path={base + '/ui-configuracion-contable'} exact component={ConfiguracionContable} />:
                    <Route path={base + '/ui-configuracion-contable'} exact component={Error404} />
                  }
                  {(user.roles.includes("MINMAMBU_ROLE_ADMIN") || 
                    user.roles.includes("MINMAMBU_ROLE_ADMIN_PRODUCT_CDT")) ? 
                    <Route path={base + '/ui-actualizacion-tasas'} exact component={ActualizacionTasas} />:
                    <Route path={base + '/ui-actualizacion-tasas'} exact component={Error404} />
                  }
                  {/* {(user.roles.includes("MINMAMBU_ROLE_ADMIN") || 
                    user.roles.includes("MINMAMBU_ROLE_ADMIN_FINANCE")) ? 
                    <Route path={base + '/generacion-contabilidad'} exact component={ReprocesosContablesD} />:
                    <Route path={base + '/generacion-contabilidad'} exact component={Error404} />
                  } */}

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
