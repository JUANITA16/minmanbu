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
    function download() {
      console.log('fileName download:' + fileName);
      const element = document.createElement("a");
      const file = new Blob([contentFile], { type: 'text/plain;charset-utf-8' });
      element.href = URL.createObjectURL(file);
      element.download = fileName;
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click();
    }

    if (response !== '') {
      setInProgress(() => false);
      showToast('Estamos generando el archivo, por favor consulte el resultado del proceso');
      showToast(() => response);

      // if(fileName !== '' && (typeof fileName !== 'undefined') && contentFile!=='' ) {
      //   download();
      // }
      
    }
  }, [response, fileName, contentFile])


  useEffect(() => {
    setData(() => `Desde: ${setFormatDate(startDate)} hasta: ${setFormatDate(endDate)}`);
  }, [startDate, endDate])

async function submit(event) {
  showToast('Estamos generando el archivo, por favor consulte el resultado del proceso');
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
  return (
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
              <Button node="button" type="submit" small className="indigo darken-4" >
                Generar
                </Button>
            </Col>
          </Row>
        </form>
      </React.Fragment>
    )

}

return renderElement()
}