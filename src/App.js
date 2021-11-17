import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Container, Card, Section } from 'react-materialize'
import { ToastContainer } from 'react-toastify';
import { Home, GenerateSap, NavigationBar } from './views/index'

export default function App() {
  const base = process.env.PUBLIC_URL;
  console.log("Variable de entorno:",process.env.REACT_APP_BASE_URL_API);
  return (
    <Section className="blue-grey lighten-5 p0">
      <Router>
        <NavigationBar />
        <Container className='bg-white'>
          <Card className="z-depth-3">
            <Switch>
              <Route path={base + '/'} exact component={Home} />
              <Route path={base + '/generate-sap'} exact component={GenerateSap} />
            </Switch>
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
