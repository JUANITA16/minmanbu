import React, { useState, useEffect } from "react";
import { InputDate, CardHeader } from '../components/index'
import { setFormatDate, showToast, convertTZ } from "../../helpers/utils";
import { Button, Col, Row, CollapsibleItem, Icon, Collapsible } from "react-materialize";
import { ServerAPI } from "../../services/server";

import { useMsal } from "@azure/msal-react";
import SapTable from "../components/SapTable";
import ReactExport from 'react-export-excel';



export default function GenerateSap() {
  const ExcelFile = ReactExport.ExcelFile;
  const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
  const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
  const service = new ServerAPI();
  const currDate = convertTZ(new Date());
  let minDate = new Date(2021, 1, 1);

  const { instance } = useMsal();

  const title = 'Archivo SAP';
  const description = 'En esta sección podrá generar el archivo plano por parte de SAP, para generarlo solo debe seleccionar las fechas y enviar la solicitud la cual será generada de forma automatica.';
  const [startDate, setStartDate] = useState(convertTZ(new Date()));
  const [endDate, setEndDate] = useState(convertTZ(new Date()));
  const [initDate, setInitDate] = useState(currDate);
  const [finalDate, setFinalDate] = useState(currDate);
  const [aditional, setData] = useState(`Desde: ${setFormatDate(startDate)} hasta: ${setFormatDate(endDate)}`);
  const [inProgress, setInProgress] = useState(false);
  const [response, setResponse] = useState('');
  const [fileName, setFileName] = useState('');
  const [contentFile, setContenFile] = useState('');
  const [filtenable, setfiltEnable] = useState(true);
  const [filterHeader, setFilterHeader] = useState(<p><strong><u>Filtros</u></strong></p>);
  const [table, setTable] = useState(<></>);
  const [tableData, setTableData] = useState([]);
  const [dbData, setDbData] = useState([]);


  const handleApplyFilters = async function (event) {
    setFilterHeader(<p><strong><u>Filtros</u></strong></p>);
    setfiltEnable(true);
    let resp = await getdbData(setFormatDate(initDate), setFormatDate(finalDate))
    setDbData(resp)
  };
  const handleDeleteFilters = function (event) {
    setFilterHeader(<p>Filtros</p>);
    setInitDate(currDate);
    setFinalDate(currDate);
    setfiltEnable(false);
    setTableData(["Empty"])
  };


  function renderTable() {
    return table
  }

  const getdbData = async function (from_date, to_date) {
    let resp = [];
    try {
      resp = await service.getSapFiles(from_date, to_date);
      if (resp.length===0) {
        return ["Empty"]
      } else {
        return resp
      }
    } catch (error) {
      console.error(error);
      
      return resp;
    }
  }


  useEffect(async () => {
    document.title = title
    let resp = await getdbData(setFormatDate(initDate), setFormatDate(finalDate))
    setDbData(resp)
  }, []);

  useEffect(() => {
    setTableData(dbData)
  }, [dbData])

  useEffect(() => {
    setTable(<SapTable tableData={tableData} />);
  }, [tableData])

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
      showToast(() => response);
    }
  }, [response, fileName, contentFile])


  useEffect(() => {
    setData(() => `Desde: ${setFormatDate(startDate)} hasta: ${setFormatDate(endDate)}`);
  }, [startDate, endDate])


  

async function handleSubmit(event) {
  event.preventDefault();
  showToast('Estamos generando el archivo, por favor consulte el resultado del proceso');
  setResponse('');
  setFileName('');
  setContenFile('');
  setInProgress(true);

  const {name} = instance.getActiveAccount().idTokenClaims

  
 service.generateSAP(setFormatDate(startDate), setFormatDate(endDate),name).then( (data) => {
    if( data && data.message){
      showToast(data.message);
      }
  });
}
useEffect(() => {
  // Comparamos las fechas para que no superen los 7 días(Fecha Final)
  let deltaDate = endDate - startDate
  // El número especifícado en el condicional equivale a la diferencia de 7 días
  if (deltaDate > 518400931) {
    setEndDate(startDate)
  }
}, [startDate])
useEffect(() => {
  // Comparamos las fechas para que no superen los 7 días(Fecha Inicial)
  let deltaDate = endDate - startDate
  // El número especifícado en el condicional equivale a la diferencia de 7 días
  if (deltaDate > 518400931) {
    setStartDate(endDate)
  }
}, [endDate])


const renderElement = () => {
  return (
      <React.Fragment>
        <CardHeader title={title} description={description} aditional={aditional} />
        <form onSubmit={handleSubmit}>
          <Row>
            <Col s={12} m={6} className="input-field date text-left">
              <InputDate labelName="Fecha inicial" maxValue={endDate} 
                setDate={setStartDate}  dateInput={startDate} minValue={minDate} />
            </Col>
            <Col s={12} m={6} className="input-field date text-left">
              <InputDate labelName="Fecha final" minValue={startDate} 
                setDate={setEndDate}  dateInput={endDate}  />
            </Col>
            <Col s={12} className="input-field m0">
              <Button node="button" style={{ float: 'right' }} type="submit" 
                      small className="indigo darken-4" disabled={inProgress}
                      data-testid="test-submit" >
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
        {/* Renderizado de la tabla */}
        {renderTable()}
        <Row>
            <Col s={12} m={12} className="input-field m0">
              <ExcelFile
                element={<Button node="button" style={{ float: 'right' }} small className="indigo darken-4">Exportar en Excel</Button>}
                filename="Resultado de creación Plano SAP">
                <ExcelSheet data={tableData} name="Resultados">
                  <ExcelColumn label="Fecha generación" value="dateProcess" />
                  <ExcelColumn label="Nombre del Archivo" value="filename" />
                  <ExcelColumn label="Periodo Generación" value="from_date" />
                  <ExcelColumn label="Estado Generación" value="file_status" />
                  <ExcelColumn label="Usuario" value="user_name" />
                </ExcelSheet>
    
              </ExcelFile>
    
            </Col>
          </Row>
      </React.Fragment>
    )

}

return renderElement()
}