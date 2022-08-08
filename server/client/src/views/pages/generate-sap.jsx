import React, { useState, useEffect } from "react";
import { InputDate, CardHeader, Loading } from '../components/index'
import { setFormatDate, showToast, convertTZ } from "../../helpers/utils";
import { Button, Col, Row, CollapsibleItem, Icon, Collapsible } from "react-materialize";
import { ServerAPI } from "../../services/server";

import { useMsal } from "@azure/msal-react";

export default function GenerateSap() {

  const service = new ServerAPI();
  const currDate = convertTZ(new Date());
  let minDate = new Date();
  minDate.setDate(minDate.getDate()-6);

  // const { instance } = useMsal();

  const title = 'Archivo SAP';
  const description = 'En esta sección podrá generar el archivo plano por parte de SAP, para generarlo solo debe seleccionar las fechas y enviar la solicitud la cual será generada de forma automatica.';
  const [startDate, setStartDate] = useState(convertTZ(new Date()));
  const [endDate, setEndDate] = useState(convertTZ(new Date()));
  const [initDate, setInitDate] = useState(currDate);
  const [finalDate, setFinalDate] = useState(currDate);
  const [aditional, setData] = useState(`Desde: ${setFormatDate(startDate)} hasta: ${setFormatDate(endDate)}`);
  const [loaderText] = useState('Estamos generando el archivo, por favor espere...');
  const [inProgress, setInProgress] = useState(false);
  const [response, setResponse] = useState('');
  const [fileName, setFileName] = useState('');
  const [contentFile, setContenFile] = useState('');
  const [filtenable, setfiltEnable] = useState(false);
  const [filterHeader, setFilterHeader] = useState(<p>Filtros</p>);

  const handleApplyFilters = function (event) {
    setFilterHeader(<p><strong><u>Filtros</u></strong></p>);
    setfiltEnable(true);
  };
  const handleDeleteFilters = function (event) {
    setFilterHeader(<p>Filtros</p>);
    setInitDate(currDate);
    setFinalDate(currDate);
    setfiltEnable(false);
  };

  useEffect(() => {
    console.log(instance)
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

  const user_name = instance.getActiveAccount().idTokenClaims

  
 service.generateSAP(setFormatDate(startDate), setFormatDate(endDate),user_name).then( (data) => {
    if( data && data.message){
      //setFileName(() => data.filename);
      //setContenFile(() => data.information);
      //setResponse(() => data.detail + "-" + data.filename);
      setResponse(() => data.message);
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
              <Button node="button" style={{ float: 'right' }} type="submit" 
                      small className="indigo darken-4" disabled={inProgress} >
                Generar
              </Button>
            </Col>
          </Row>
        </form>
        {/* Filtros */}
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
      </React.Fragment>
    )

}

return renderElement()
}