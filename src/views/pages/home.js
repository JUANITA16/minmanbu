import React, { Component, navigation } from "react";
import { Information } from "../components/index";
import { Link } from 'react-router-dom'
import { Row, Col } from 'react-materialize'

export class Home extends Component {

  state = {
    title: "Home",
    description: "Mambu pagina principal"
  };

  render() {
    return (
      <React.Fragment>
        <Information title={this.state.title} description={this.state.description} />
        <Row>
          <Col s={12}>
            <Link to="/generate-sap" className="brand-logo indigo-text" onPress={() => navigation.setOptions({ title: 'SAP!' })}>Generar Archivo</Link>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default Home;