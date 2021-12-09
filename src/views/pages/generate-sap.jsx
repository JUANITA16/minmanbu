import React, { useState, useEffect } from "react";
import { InputDate, CardHeader, Loading } from '../components/index'
import { MambuService } from "../../services/mambu-service";
import { setFormatDate, showToast, convertTZ } from "../../helpers/utils";
import { Row, Col, Button } from 'react-materialize'

export const service = new MambuService();

export default function GenerateSap() {
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

  // var contentFile = '';

  useEffect(() => {
    document.title = title
  }, []);

  useEffect(() => {
    setData(() => `Desde: ${setFormatDate(startDate)} hasta: ${setFormatDate(endDate)}`);
  }, [startDate, endDate])

  useEffect(() => {

    if (response !== '') {
      setInProgress(() => false);
      showToast(() => response);
      // serviceDownload();
      download();
    }
  }, [response])

  function download() {
    console.log('fileName download:' + fileName);
    // setContenFile(() => 'Ejemplo de text\n Despues otra linea');
    //contentFile = 'Ejemplo de text\n Despues otra linea';
    const element = document.createElement("a");
    const file = new Blob([contentFile], { type: 'text/plain;charset-utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    // console.log(' contentFile:' + contentFile);
  }

  // async function serviceDownload(event) {
  //   await service.downloadFile(fileName)
  //     .then((response) => {
  //       if (response && response.information) {
  //         // contentFile = 'Ejemplo de text\n Despues otra linea';
  //         contentFile = response.information;
  //         download();
  //       }
  //     });
  // }



async function submit(event) {
  event.preventDefault();
  setResponse(() => '');
  setFileName(() => '');
  setContenFile(() => '');
  setInProgress(() => true);
  await service.generateFile(setFormatDate(startDate), setFormatDate(endDate))
    .then((response) => {
      if (response && response.detail) {
        setFileName(() => response.filename);
        setContenFile(() => response.information);
        // setFileName(() => "fileName seteado");
        setResponse(() => response.detail + "-" + response.filename);
        
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
              <InputDate labelName="Fecha inicial" maxValue={endDate} setDate={setStartDate} />
            </Col>
            <Col s={12} m={6} className="input-field date text-left">
              <InputDate labelName="Fecha final" minValue={startDate} setDate={setEndDate} />
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