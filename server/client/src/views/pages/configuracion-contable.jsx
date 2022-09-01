import React, { useState, useEffect } from "react";
import { CardHeader } from "../components/index";
import { Col, Button } from 'react-materialize'
import ConfiguracionContableGeneral from "./configuracion-contable-general";
import ConfiguracionHomologacion from "./configuracion-homologacion";
export default function ConfiguracionContable() {
  
    const title = "Configuración contable"
    const description = "En esta sección podrá realizar la configuración contable asociada a los movimientos de CDTs desde Dominus"

    const [pantallaVisible, setPantallaVisible] = useState();
    async function goToConfiguracionGeneral (event) {
        setPantallaVisible(
            <ConfiguracionContableGeneral/>
        );
    };

    async function goToHomologacion (event) {
        setPantallaVisible(
            <ConfiguracionHomologacion />
        );
    };
    
    useEffect(() => {
        setPantallaVisible(
            <div>
                <CardHeader title={title} description={description } />
                <Col s={12} m={6} className="input-field date text-left">
                    <Button node="button" small className="indigo darken-4"  onClick={goToConfiguracionGeneral}>
                        Configuración general
                    </Button>
                </Col>
                <Col s={12} m={6} className="input-field date text-left">
                    <Button node="button" small className="indigo darken-4" onClick={goToHomologacion} >
                        Configuración homologacíon
                    </Button>
                </Col>
            </div>
            
        );
    }, []);

    return (
        <React.Fragment>
            {pantallaVisible}
        </React.Fragment>
    )
}