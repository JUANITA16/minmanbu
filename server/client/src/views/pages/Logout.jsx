import React, { useEffect } from "react";
import { CardHeader } from "../components/index";
import { loginRequest } from "../../config/authConfig";
import { msalInstance } from "../../App";
import { Col, Row, Button } from "react-materialize";

export default function Home() {
  const title = 'Debe iniciar sesión';
  const description = 'Debe iniciar sesión con la cuenta de BTG Pactual';

  useEffect(() => {
    document.title = title
  }, []);

  const onSSO = async () => {
    const result = await msalInstance.loginPopup(loginRequest);
    // const Auth = `Bearer ${result.accessToken}`;
};

  return (
    <React.Fragment>
      <CardHeader title={title} description={description} />
      <Row>
        <Col s={12}>
          <Button node="button" small className="indigo darken-4" onClick={() => onSSO()}>
            Login with Office
          </Button>
        </Col>
      </Row>
    </React.Fragment>
  )
}