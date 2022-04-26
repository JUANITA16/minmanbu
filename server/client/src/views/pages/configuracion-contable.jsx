import React, { useEffect } from "react";
import { CardHeader } from "../components/index";
import { Button, Col } from "react-materialize";
import { InputDate } from '../components/index'

export default function configuracionContable() {
  
    const title = "Configuración contable"
    const description = "En esta sección podrá realizar la configuración contable asociada a los moviminetos de CDTs desde Dominus"
    return (
        <React.Fragment>
            <CardHeader title={title} description={description } />

            <Col s={12} m={6} className="input-field date text-left">
                <Button node="button" small className="indigo darken-4" >
                    Configuración general
                </Button>
            </Col>
            <Col s={12} m={6} className="input-field date text-left">
                <Button node="button" small className="indigo darken-4" >
                Configuración homologacíon
                </Button>
            </Col>
        </React.Fragment>
    )
}