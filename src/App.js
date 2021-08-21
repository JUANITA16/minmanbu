import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Container, Card, Section } from 'react-materialize'
import { ToastContainer } from 'react-toastify';
import { Home, GenerateSap, NavigationBar } from './views/index'

export default function App() {
  return (
    <Section className="blue-grey lighten-5 p0">
      <Router>
        <NavigationBar />        
          <Container className='bg-white'>
            <Card className="z-depth-3">
              <Switch>
                <Route path='/' exact component={Home} />
                <Route path='/generate-sap' exact component={GenerateSap} />
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
