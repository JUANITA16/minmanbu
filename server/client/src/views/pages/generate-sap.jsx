import React, { useState, useEffect } from "react";
import { InputDate, CardHeader, Loading } from '../components/index'
import { setFormatDate, showToast, convertTZ } from "../../helpers/utils";
import { Row, Col, Button } from 'react-materialize'
import { ServerAPI } from "../../services/server";

export default function GenerateSap() {
  
  const service = new ServerAPI();

  const title = 'Archivo SAP';
  const description = 'En esta sección podrá generar el archivo plano por parte de SAP, para generarlo solo debe seleccionar las fechas y enviar la solicitud la cual será generada de forma automatica.';
  const [startDate, setStartDate] = useState(convertTZ(new Date()));
  const [endDate, setEndDate] = useState(convertTZ(new Date()));
  const [aditional, setData] = useState(`Desde: ${setFormatDate(startDate)} hasta: ${setFormatDate(endDate)}`);
  const [loaderText] = useState('Estamos generando el archivo, por favor espere...');
  const [inProgress, setInProgress] = useState(false);
  const [response, setResponse] = useState('');
  const [fileName, setFileName] = useState('');
  const [contentFile, setContenFile] = useState('');


  useEffect(() => {
    document.title = title
  }, []);

  useEffect(() => {
    setData(() => `Desde: ${setFormatDate(startDate)} hasta: ${setFormatDate(endDate)}`);
  }, [startDate, endDate])

  useEffect(() => {
    showToast('Estamos generando el archivo, por favor consulte el resultado del proceso');
  }, [response, fileName, contentFile])

async function submit(event) {
  event.preventDefault();
  setResponse(() => '');
  setFileName(() => '');
  setContenFile(() => '');
  setInProgress(() => true);
  
 service.generateFile(setFormatDate(startDate), setFormatDate(endDate)).then( (data) => {
    if( data && data.detail){
      setFileName(() => data.filename);
      setContenFile(() => data.information);
      setResponse(() => data.detail + "-" + data.filename);
      }
  });
}

const renderElement = () => {
  return !inProgress
    ? (
      <React.Fragment>
        <CardHeader title={title} description={description} aditional={aditional} />
        <form onSubmit={submit}>
          <Row>
            <Col s={12} m={6} className="input-field date text-left">
              <InputDate labelName="Fecha inicial" maxValue={endDate} setDate={setStartDate}  dateInput={startDate}  />
            </Col>
            <Col s={12} m={6} className="input-field date text-left">
              <InputDate labelName="Fecha final" minValue={startDate} setDate={setEndDate}   dateInput={endDate} />
            </Col>
            <Col s={12} className="input-field m0">
              <Button node="button" type="submit" small className="indigo darken-4">
                Generar
                </Button>
            </Col>
          </Row>
        </form>
      </React.Fragment>
    )
    : <Loading text={loaderText} aditional={aditional} />
}

return renderElement()
}