import React, { useEffect } from "react";
import { CardHeader } from "../components/index";
import { Link } from 'react-router-dom';
import { Row, Col } from 'react-materialize';
import { useMsal } from "@azure/msal-react";

export default function Home() {
  const { instance } = useMsal();
  const { name } = instance.getActiveAccount().idTokenClaims;
  const base = process.env.PUBLIC_URL;
  const title = 'Inicio';
  const description = 'Mini mambu página principal.';

  useEffect(() => {
    document.title = title
  }, []);

  return (
    <React.Fragment>
      <CardHeader title={title} description={description + " " + name } />
      <Row>
        <Col s={12}>
          <Link to={base + '/ui-generate-sap'} className="brand-logo indigo-text">Generar Archivo</Link>
        </Col>
      </Row>
    </React.Fragment>
  )
}