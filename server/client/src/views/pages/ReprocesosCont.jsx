import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, 
        FormLabel, Dialog, DialogActions, DialogContent, 
        DialogContentText, DialogTitle, Grid } from "@mui/material";
import React, { useState, useEffect, Fragment } from "react";
import { CardHeader, InputDate } from "../components";
import { Button, Row, Col, CollapsibleItem, Icon, Collapsible } from "react-materialize";
import { convertTZ, showToast, setFormatDate } from "../../helpers/utils";
import ReactExport from 'react-export-excel';
import ReprTable from "../components/ReprocesosTable";

import { ServerAPI } from "../../services/server";
import { useMsal } from "@azure/msal-react";

function ReprocesosContablesD() {

  const { instance } = useMsal();
  const { name } = instance.getActiveAccount().idTokenClaims;
  const service = new ServerAPI();

  let testData = [ {
    id: "1234",
    date_process: "2022-06-09",
    user: "Cristian Triana",
    date_event: "2022-06-01",
    detailed: "detalle1, detalle2, detalle3",
    value: "10000000",
    type_process: "Continuo",
    status_code: "200",
    status: "Exitoso",
    data_group: "555566633"

  }]

  const ExcelFile = ReactExport.ExcelFile;
  const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
  const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

  const currDate = convertTZ(new Date());
  const [startDate, setStartDate] = useState(currDate);
  const [endDate, setEndDate] = useState(currDate);
  const [initDate, setInitDate] = useState(currDate);
  const [finalDate, setFinalDate] = useState(currDate);
  const [table, setTable] = useState(<></>);
  const [tableData, setTableData] = useState(testData);
  const [eventType, seteventType] = useState(
    {
      constitucion: false,
      interes: false,
      rendimientos: false,
      vencimientos: false
    }
  )
  const [isPromptOpen, setisPromptOpen] = useState(false)
  const [proCont, setproCont] = useState(false)
  const [dialogContent, setdialogContent] = useState({
    title: "",
    content: ""
  })
  const [filtenable, setfiltEnable] = useState(true);
  const [filterHeader, setFilterHeader] = useState(<p><strong><u>Filtros</u></strong></p>);

  const handleChange = function (event) {
    seteventType({
      ...eventType,
      [event.target.name]: event.target.checked
    })
  }

  const handleChangeProc = function (event) {
    setproCont(event.target.checked)
  }

  const handleApplyFilters = async function (event) {
    setFilterHeader(<p><strong><u>Filtros</u></strong></p>);
    setfiltEnable(true);
    setTableData(["Empty"])
  };

  const handleDeleteFilters = function (event) {
    setFilterHeader(<p>Filtros</p>);
    setInitDate(currDate);
    setFinalDate(currDate);
    setfiltEnable(false);
    setTableData(["Empty"])
  };

  const handleChangeAll = function (event) {
    // Cambia el valor de todos los campos.
    if (eventLen === 0) {
      seteventType({
        constitucion: true,
        interes: true,
        rendimientos: true,
        vencimientos: true
      })
    } else {
      seteventType({
        constitucion: false,
        interes: false,
        rendimientos: false,
        vencimientos: false
      })
    }
  }

  const handleClosePrompt = function (event){
    setisPromptOpen(false)
  }
  
  // Definimos las variables y recorremos la lista para ver cuantas han sido seleccionadas
  const {constitucion, interes, rendimientos, vencimientos} = eventType
  const eventLen = [constitucion, interes, rendimientos, vencimientos].filter((v) => v).length
  // Si ningún evento está seleccionado genera error
  let error =  eventLen === 0;

  const handleGenerate =  async function (event){
    if (error) {
      setdialogContent({
        title: "No se pudo generar la solicitud.",
        content: "Debe seleccionar al menos un tipo de evento para realizar el proceso."
      })
      setisPromptOpen(true)
    } else {
      // Acá se ingresa la función para generar.
      showToast("Estamos procesando su solicitud.")
      if(interes){
        let respInteres = await service.createDailyInterest(setFormatDate(initDate),name,setFormatDate(initDate))
        if (respInteres && respInteres.status==200){
          showToast("Proceso finalizado correctamente, por favor consulte los resultado.")
        } else {
          showToast("Error al generar asiento.")
        }
       
      }
    }
  }

  useEffect(() => {
    // Comparamos las fechas para que no superen los 5 días(Fecha Final)
    let deltaDate = finalDate - initDate
    // El número especifícado en el condicional equivale a la diferencia de 5 días
    if (deltaDate > 345601000 && proCont) {
      setdialogContent({
        title: "Fechas no válidas",
        content: "El periodo de fechas a procesar no es válido, el máximo son 5 días."
      })
      setisPromptOpen(true)
      setFinalDate(initDate)
    }
  }, [initDate, proCont])
  useEffect(() => {
    // Comparamos las fechas para que no superen los 5 días(Fecha Inicial)
    let deltaDate = finalDate - initDate
    // El número especifícado en el condicional equivale a la diferencia de 5 días
    if (deltaDate > 345601000) {
      setdialogContent({
        title: "Fechas no válidas",
        content: "El periodo de fechas a procesar no es válido, el máximo son 5 días."
      })
      setisPromptOpen(true)
      setInitDate(finalDate)
    }
  }, [finalDate])

  // Carga de la tabla
  useEffect(() => {
    setTable(<ReprTable tableData={tableData} />)
  }, [tableData])
  

  function renderTable() {
    return table
  }

  return (<Fragment>
      <CardHeader 
          title={"Generación Contabilidad Dominus"}
          description={"En esta sección podrá generar la contabilidad asociada a los eventos transaccionales de Dominus."}
          />
      <Box sx={{ flexGrow: 1 }}>
        <Grid container
          direction="row"
          justifyContent="center"
          alignItems="center" >
          <Grid item md={4} sm={12}
                justifyContent="center"
                alignItems="center">
            <FormControl
              required
              error={error}
              component="fieldset"
              variant="standard"
            >
              <FormLabel component="legend">Tipo de evento</FormLabel>
              <FormGroup>
                <FormControlLabel
                  control={
                  <Checkbox checked={eventLen===4} 
                    indeterminate={eventLen!==4 && eventLen!==0}
                    onChange={handleChangeAll} 
                    name="todos" />
                  }
                  label="Todos"
                  labelPlacement="start"
                />
                <FormControlLabel
                  control={
                  <Checkbox checked={constitucion} onChange={handleChange} name="constitucion" />
                  }
                  label="Constitución"
                  labelPlacement="start"
                />
                <FormControlLabel
                  control={
                  <Checkbox checked={interes} onChange={handleChange} name="interes" />
                  }
                  label="Interés diario"
                  labelPlacement="start"
                />
                <FormControlLabel
                  control={
                  <Checkbox checked={rendimientos} onChange={handleChange} name="rendimientos" />
                  }
                  label="Pago de rendimientos"
                  labelPlacement="start"
                />
                <FormControlLabel
                  control={
                  <Checkbox checked={vencimientos} onChange={handleChange} name="vencimientos" />
                  }
                  label="Pago de vencimientos"
                  labelPlacement="start"
                />
              </FormGroup>
              {error ? 
                (<FormHelperText>Debes seleccionar al menos una opción.</FormHelperText>) :
                (<></>)
              }
              
            </FormControl>

          </Grid>
          <Grid item md={4} sm={12}
                justifyContent="center"
                alignItems="center" >
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center" >
              <Grid item>
                <InputDate labelName="Fecha Inicial" maxValue={finalDate} 
                  setDate={setInitDate} dateInput={initDate}  />
              </Grid>
              <Grid item >
                {proCont ? (
                  <InputDate labelName="Fecha Final" maxValue={currDate}
                    minValue={initDate} setDate={setFinalDate} dateInput={finalDate}  />) :
                    <></>
                  }
              
              </Grid>
            </Grid>
          </Grid>

          <Grid item md={4} sm={12}
                justifyContent="flex-end"
                alignItems="center" >
            <FormControlLabel
                control={
                <Checkbox checked={proCont} 
                  onChange={handleChangeProc} 
                  name="procesamiento" />
                }
                label="Procesamiento continuo"
                labelPlacement="start"
              />
          </Grid>

          <Grid item md={12}  justifyContent="flex-end"
              alignItems="flex-start">
            <Button onClick={handleGenerate} 
              className="indigo darken-4" style={{ float: 'right', marginRight: '10%' }} >
              Generar
            </Button>
          </Grid>
        </Grid>
          
      </Box>

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
                  <InputDate labelName="Fecha Inicial" maxValue={endDate} 
                    setDate={setStartDate} dateInput={startDate}  />
                </Col>
                <Col s={12} m={6} l={6} xl={6}  >
                  <InputDate labelName="Fecha Final" maxValue={currDate}
                    minValue={startDate} setDate={setEndDate} dateInput={endDate}  />
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
            filename="Resultado-ProcesoContable">
            <ExcelSheet data={tableData} name="Resultados">
              <ExcelColumn label="Consecutivo" value="id" />
              <ExcelColumn label="Fecha ejecución" value="date_process" />
              <ExcelColumn label="Usuario" value="user" />
              <ExcelColumn label="Fecha del registro" value="date_event" />
              <ExcelColumn label="Detalle" value="detailed" />
              <ExcelColumn label="Valor" value="value" />
              <ExcelColumn label="Tipo proceso" value="type_process" />
              <ExcelColumn label="Cod. estado" value="status_code" />
              <ExcelColumn label="Estado" value="status" />
              <ExcelColumn label="Grupo datos Dominus" value="data_group" />
            </ExcelSheet>
          </ExcelFile>
        </Col>
      </Row>
      <Dialog
        open={isPromptOpen}
        onClose={handleClosePrompt}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
        <DialogTitle id="alert-dialog-title">
          {dialogContent.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogContent.content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePrompt} className="indigo darken-4">
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
      

  </Fragment>
  )
}

export default ReprocesosContablesD