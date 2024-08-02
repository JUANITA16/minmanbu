import React, { useState, useEffect } from "react";
import { InputDate, CardHeader } from '../components/index'
import { setFormatDate, showToast, convertTZ } from "../../helpers/utils";
import { Button, Col, Row, CollapsibleItem, Icon, Collapsible } from "react-materialize";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { ServerAPI } from "../../services/server";

import { useMsal } from "@azure/msal-react";
import SapTable from "../components/SapTable";
import ReactExport from 'react-export-excel';


const MIN_YEAR = 2021;
export default function GenerateSap() {
  const ExcelFile = ReactExport.ExcelFile;
  const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
  const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
  const service = new ServerAPI();
  const currDate = convertTZ(new Date());
  const minDate = new Date(MIN_YEAR, 1, 1);

  const { instance } = useMsal();

  const title = 'Archivo SAP';
  const description = 'En esta sección podrá generar el archivo plano SAP, solo debe seleccionar las fechas y enviar la solicitud la cual será procesada de forma automática.';
  const [startDate, setStartDate] = useState(convertTZ(new Date()));
  const [endDate, setEndDate] = useState(convertTZ(new Date()));
  const [initDate, setInitDate] = useState(currDate);
  const [finalDate, setFinalDate] = useState(currDate);
  const [aditional, setData] = useState(`Desde: ${setFormatDate(startDate)} hasta: ${setFormatDate(endDate)}`);
  const [inProgress, setInProgress] = useState(false);
  const [filtenable, setfiltEnable] = useState(true);
  const [filterHeader, setFilterHeader] = useState(<p><strong><u>Filtros</u></strong></p>);
  const [table, setTable] = useState(<></>);
  const [tableData, setTableData] = useState([]);
  const [dbData, setDbData] = useState([]);
  const [dialogOpen, setdialogOpen] = useState(false);

  const handleApplyFilters = async function (_event) {
    setFilterHeader(<p><strong><u>Filtros</u></strong></p>);
    setfiltEnable(true);
    setTableData([])
    const resp = await getdbData(setFormatDate(initDate), setFormatDate(finalDate));
    setDbData(resp)

  };
  const handleDeleteFilters = function (_event) {
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
      alert("Error Cargando tabla")
      return resp;
    }
  }


  useEffect(() => {
    async function fetchData() {
      document.title = title
      const resp = await getdbData(setFormatDate(initDate), setFormatDate(finalDate));
      setDbData(resp)
    }
    fetchData()
  }, []);

  useEffect(() => {
    setTableData(dbData)
  }, [dbData])

  useEffect(() => {
    setTable(<SapTable tableData={tableData} />);
  }, [tableData])


  useEffect(() => {
    setData(() => `Desde: ${setFormatDate(startDate)} hasta: ${setFormatDate(endDate)}`);
  }, [startDate, endDate])




  async function handleSubmit(event) {
    event.preventDefault();
    showToast('Estamos generando el archivo, por favor consulte el resultado del proceso');
    setInProgress(true);

    const {name} = instance.getActiveAccount().idTokenClaims


    service.generateSAP(setFormatDate(startDate), setFormatDate(endDate),name).then( (data) => {
      if( data && data.message){
        showToast(data.message);
      }
    });
  }
  const SEVEN_DAYS_MS = 518400000;
  useEffect(() => {
    // Comparamos las fechas para que no superen los 7 días(Fecha Final)
    const deltaDate = endDate - startDate;
    // El número especifícado en el condicional equivale a la diferencia de 7 días
    if (deltaDate > SEVEN_DAYS_MS) {
      setdialogOpen(true)
      setEndDate(startDate)
    }
  }, [startDate])
  useEffect(() => {
    // Comparamos las fechas para que no superen los 7 días(Fecha Inicial)
    const deltaDate = endDate - startDate;
    // El número especifícado en el condicional equivale a la diferencia de 7 días
    if (deltaDate > SEVEN_DAYS_MS) {
      setdialogOpen(true)
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
        <Dialog
          open={dialogOpen}
          onClose={()=>setdialogOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title" color={"#001E62"}>
            {"Fechas no válidas"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              El periodo de fechas a procesar no es válido, el máximo son 7 días.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={()=>setdialogOpen(false)}
              className="indigo darken-4" autoFocus>
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )

  }

  return renderElement()
};