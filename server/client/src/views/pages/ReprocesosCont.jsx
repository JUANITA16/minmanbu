import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, 
        FormLabel, Dialog, DialogActions, DialogContent, 
        DialogContentText, DialogTitle, Grid } from "@mui/material";
import React, { useState, useEffect, Fragment } from "react";
import { CardHeader, InputDate } from "../components";
import { Button } from "react-materialize";
import { convertTZ } from "../../helpers/utils";

function ReprocesosContablesD() {
  const currDate = convertTZ(new Date());
  const [initDate, setInitDate] = useState(currDate);
  const [finalDate, setFinalDate] = useState(currDate);
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
  

  const handleChange = function (event) {
    seteventType({
      ...eventType,
      [event.target.name]: event.target.checked
    })
  }

  const handleChangeProc = function (event) {
    setproCont(event.target.checked)
  }

  const handleChangeAll = function (event) {
    // Cambia el valor de todos los campos.
    seteventType({
      constitucion: true,
      interes: true,
      rendimientos: true,
      vencimientos: true
    })
  }

  const handleClosePrompt = function (event){
    setisPromptOpen(false)
  }
  
  // Definimos las variables y recorremos la lista para ver cuantas han sido seleccionadas
  const {constitucion, interes, rendimientos, vencimientos} = eventType
  const eventLen = [constitucion, interes, rendimientos, vencimientos].filter((v) => v).length
  // Si ningún evento está seleccionado genera error
  let error =  eventLen === 0;

  const handleGenerate = function (event){
    if (error) {
      setisPromptOpen(true)
    } else {
      // Acá se ingresa la función para generar.
      console.log("Generar")
    }
  }

  useEffect(() => {
    // Comparamos las fechas para que no superen los 5 días(Fecha Final)
    let deltaDate = finalDate - initDate
    // El número especifícado en el condicional equivale a la diferencia de 5 días
    if (deltaDate > 518400931) {
      setisPromptOpen(true)
      setFinalDate(initDate)
    }
  }, [initDate])
  useEffect(() => {
    // Comparamos las fechas para que no superen los 5 días(Fecha Inicial)
    let deltaDate = finalDate - initDate
    // El número especifícado en el condicional equivale a la diferencia de 5 días
    if (deltaDate > 518400931) {
      setisPromptOpen(true)
      setInitDate(finalDate)
    }
  }, [finalDate])
  return (<Fragment>
      <CardHeader 
          title={"Generación Contabilidad Dominus"}
          description={"En esta sección podrá generar la contabilidad asociada a los eventos transaccionales de Dominus."}
          />
      <Box sx={{ display: 'flex' }}>
        <FormControl
          required
          error={error}
          component="fieldset"
          sx={{ m: 4 }}
          variant="standard"
        >
          <FormLabel component="legend">Tipo de evento</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
              <Checkbox checked={eventLen===4} 
                indeterminate={eventLen!==4}
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
        <Grid 
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          sx={{ m: 4 }}>
          <Grid item>
            <InputDate labelName="Fecha Inicial" maxValue={finalDate} 
              setDate={setInitDate} dateInput={initDate}  />
          </Grid>
          <Grid item>
          <InputDate labelName="Fecha Final" maxValue={currDate}
            minValue={initDate} setDate={setFinalDate} dateInput={finalDate}  />
          </Grid>
        </Grid>
        <Grid 
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          sx={{ m: 4 }}>
          <Grid item>
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
          <Grid item>
            <Button onClick={handleGenerate}>
              Generar
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Dialog
        open={isPromptOpen}
        onClose={handleClosePrompt}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
        <DialogTitle id="alert-dialog-title">
          {"Fechas no válidas"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            El periodo de fechas a procesar no es válido, el máximo son 5 días.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePrompt}>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
      

  </Fragment>
  )
}

export default ReprocesosContablesD