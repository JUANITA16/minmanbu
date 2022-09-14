import React, { useState, useEffect, Fragment } from "react";
import { Button, Col, Row, CollapsibleItem, Icon, Collapsible } from "react-materialize";
import { CardHeader, InputDate } from "../components";
import Select from 'react-select'
import { convertTZ, showToast } from "../../helpers/utils";
import ActTable from "../components/ActualizacionTable";
import ActualizacionTasasDetalle from './ActualizacionTasasDetalle'

import { ServerAPI } from "../../services/server";

function ActualizacionTasas() {
  const currDate = convertTZ(new Date());
  let minDate = new Date();
  minDate.setDate(minDate.getDate()-6);
  const [filterHeader, setFilterHeader] = useState(<p>Filtros</p>);
  const [selDate, setSelDate] = useState(convertTZ(new Date()));
  const [initDate, setInitDate] = useState(currDate);
  const [finalDate, setFinalDate] = useState(currDate);
  const [consecutivo, setConsecutivo] = useState("");
  const [filtenable, setfiltEnable] = useState(false);
  const [table, setTable] = useState(<></>);
  const [isPantallaPrincipal, setIsPantallaPrincipal] = useState(true);
  const service = new ServerAPI();


  function applyFilters(record, filters) {
    let isValid = true
    return isValid
  };
  const handleApplyFilters = function (event) {
    setFilterHeader(<p><strong><u>Filtros</u></strong></p>);
    setfiltEnable(true);
  };
  const handleDeleteFilters = function (event) {
    setFilterHeader(<p>Filtros</p>);
    setInitDate(currDate);
    setFinalDate(currDate);
    setConsecutivo("");
    setfiltEnable(false);
  };
  const onTextChange = function (event) {
    setConsecutivo(event.target.value)
  };
  
  const updateRates = async function (event) {
    event.preventDefault()
    showToast('Estamos generando la solicitud, por favor consulte el resultado del proceso')
    resp = await service.sendUpdateRate(selDate)
  }

  function renderTable() {
    return table
  }
  useEffect( function () {
    setTable(<ActTable setIsPantallaPrincipal={setIsPantallaPrincipal}/>)
  } ,[isPantallaPrincipal])

  return isPantallaPrincipal ? (
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
          className="indigo darken-4" onClick={updateRates}>
          Ejecutar
        </Button>
      </Row>
      <Row>
        <Collapsible accordion={false}>
            <CollapsibleItem
            expanded={false}
            header={filterHeader}
            icon={<Icon>filter_list</Icon>}
            node="div"
            >
            <Row>
              <Col s={12} m={6} l={6} xl={6}>
                <InputDate labelName="Fecha Inicial" maxValue={finalDate} 
                   setDate={setInitDate} dateInput={initDate}  />
              </Col>
              <Col s={12} m={6} l={6} xl={6}  >
                <InputDate labelName="Fecha Final" maxValue={currDate}
                 minValue={initDate} setDate={setFinalDate} dateInput={finalDate}  />
              </Col>
              <Col s={12} m={6} l={6} xl={6}  >
                <div className="input-field">
                  <input type="text" className="valid" onChange={onTextChange}
                    id="numConsecutivo" value={consecutivo} pattern="[0-9]*"/>
                  <label htmlFor="numConsecutivo" >Consecutivo de Ejecución</label>
                </div>
              </Col>
              </Row>
            <Row>
              <Col s={12} m={6} l={6} xl={3}>
                <Button node="button" small className="indigo darken-4" 
                  onClick={handleApplyFilters} disabled={filtenable} >
                  Aplicar filtros
                </Button>
              </Col>
              <Col s={12} m={6} l={6} xl={3}>
                <Button node="button"  small className="indigo darken-4"
                  onClick={handleDeleteFilters} disabled={!filtenable}>
                  Borrar filtros
                </Button>
              </Col>
            </Row>
          </CollapsibleItem>
        </Collapsible>  
      </Row>
      {renderTable()}
    </Fragment>
  ): (<ActualizacionTasasDetalle setIsPantallaPrincipal={setIsPantallaPrincipal}/>)
}

export default ActualizacionTasas;