import React, { useState, useEffect, Fragment } from "react";
import { Button, Col, Row } from "react-materialize";
import { CardHeader, InputDate } from "../components";
import Select from 'react-select'
import { convertTZ } from "../../helpers/utils";

function ActualizacionTasas() {
  const currDate = convertTZ(new Date());
  let minDate = new Date();
  minDate.setDate(minDate.getDate()-6)
  const [selDate, setSelDate] = useState(convertTZ(new Date()));
  return (
    <Fragment>
      <CardHeader title={"Actualización Masiva de Tasas"}
        description={"En esta sección podrá realizar el proceso de actualización de tasas de forma masiva."} />
      <Row>
        <Col s={"6"} m={"3"}>
          <label className="active">Tipo Producto</label>
          <Select className="basic-single" defaultValue={{value: 1, label: 'CDT'}}
            options={[{value: 1, label: 'CDT'}, {value: 2, label: 'Bonos'}]}/>
        </Col>
        <Col s={"6"} m={"9"}>
          <InputDate labelName="Fecha" maxValue={currDate} 
            minValue={minDate} setDate={setSelDate} dateInput={selDate}  />
        </Col>
      </Row>
      <Row>
        <Button node="button" style={{ float: 'right' }} 
          className="indigo darken-4">
          Ejecutar
        </Button>

      </Row>
    </Fragment>
  )

}

export default ActualizacionTasas;