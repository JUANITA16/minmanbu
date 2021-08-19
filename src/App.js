import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Home, GenerateSap, NavBar } from './views/index'

export const App = () => {
  return (
    <section className="App">
      <Router>
        <NavBar />
        <section className='container-fluid'>
          <div className='container bg-white mt-3 p-5'>
            <Switch>
              <Route path='/' exact component={Home} />
              <Route path='/generate-sap-file' exact component={GenerateSap} />
            </Switch>
          </div>
        </section>
      </Router>
    </section>
  );
}

export default App;
