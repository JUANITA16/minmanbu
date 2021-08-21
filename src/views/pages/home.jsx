import React, { useState } from "react";
import { CardHeader } from "../components/index";
import { Link } from 'react-router-dom'
import { Row, Col } from 'react-materialize'

export default function Home() {
  const [title] = useState('Home');
  const [description] = useState('Minmambu pagina princial.');
  
  return (
    <React.Fragment>
      <CardHeader title={title} description={description} />
      <Row>
        <Col s={12}>
          <Link to="/generate-sap" className="brand-logo indigo-text">Generar Archivo</Link>
        </Col>
      </Row>
    </React.Fragment>
  )
}