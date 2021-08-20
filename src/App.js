import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { Home, GenerateSap, NavBar } from './views/index'
import { Container, Card, Section } from 'react-materialize'

import M from 'materialize-css'

export const App = () => {
  return (
    <Section className="blue-grey lighten-5 p0">
      <Router>
        <NavBar />        
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

document.addEventListener('DomContentLoaded', function () {
  M.AutoInit();
})

export default App;
