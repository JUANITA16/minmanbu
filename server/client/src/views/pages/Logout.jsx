import React, { useEffect } from "react";
import { CardHeader } from "../components/index";
import { loginRequest } from "../../config/authConfig";
import { Col, Row, Button } from "react-materialize";
import { useMsal } from "@azure/msal-react";

export default function Logout() {
  const title = 'Debe iniciar sesión';
  const description = 'Debe iniciar sesión con la cuenta de BTG Pactual';
  const { instance } = useMsal();

  const onSSO = () => {
    instance.loginRedirect(loginRequest).catch( e => console.log("Error Login: ", e) );
  };

  useEffect(async() => {
    document.title = title
    onSSO();
  }, [onSSO]);

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