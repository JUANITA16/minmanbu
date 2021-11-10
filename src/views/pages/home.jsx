import React, { useEffect } from "react";
import { CardHeader } from "../components/index";
import { Link } from 'react-router-dom'
import { Row, Col } from 'react-materialize'

export default function Home() {
  const base = process.env.PUBLIC_URL;
  const title = 'Inicio - Versión 2';
  const description = 'Mini mambu pagina princial.';

  useEffect(() => {
    document.title = title
  }, []);

  return (
    <React.Fragment>
      <CardHeader title={title} description={description} />
      <Row>
        <Col s={12}>
          <Link to={base + '/generate-sap'} className="brand-logo indigo-text">Generar Archivo</Link>
        </Col>
      </Row>
    </React.Fragment>
  )
}