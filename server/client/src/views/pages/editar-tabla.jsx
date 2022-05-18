import React, { useState, useEffect } from "react";
import { CardHeader } from "../components/index";
import { Button } from 'react-materialize'
import TextField from '@mui/material/TextField';
import { ServerAPI } from "../../services/server";
import Stack from '@mui/material/Stack';
import { Col } from 'react-materialize'
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import ConfiguracionContableGeneral from "./configuracion-contable-general";
import Select from 'react-select'


const service = new ServerAPI();

export default function EditarTabla(props) {
  
    const title = "Edicion de CONFIGURACION GENERAL"
    const description = "En esta sección podrá realizar la edicion de los registros CONFIGURACION GENERAL"

    const [open, setOpen] = React.useState(false);
    const [mensajeWarning, setMensajeWarning] = React.useState('');
    const [severity, setSeverity] = React.useState('info');

    var emisionesDefault = []
    var emisiones = [{ value: 0, label: 'Seleccione una emisión' }]
    var taxaccountid=""
    var credittaxaccount=""
    var debittaxaccount=""
    var credittaxaccountinterest=""
    var debittaxaccountinterest=""
    var producttypedescription=""
    var producttypemaestrosunicos=""


    const handleChangeCredittaxaccount = (event) =>{
        credittaxaccount=event.target.value
    }

    const handleChangeDebittaxaccount= (event) =>{
        debittaxaccount=event.target.value
    }

    const handleChangeCredittaxaccountinterest = (event) =>{
        credittaxaccountinterest=event.target.value
    }

    const handleChangeDebittaxaccountinterest = (event) =>{
        debittaxaccountinterest=event.target.value
    }

    const handleChangeProducttypemaestrosunicos = (event) =>{
        producttypemaestrosunicos=event.target.value
    }

    const handleSubmit = (event) => {
        console.log(credittaxaccount)
        if (credittaxaccount==="") {
            console.log("paso")
            setMensajeWarning('La Cuenta crédito no puede estar vacia.')
            setSeverity('warning')
            setOpen(true)
          } else if (debittaxaccount==="") {
            setMensajeWarning('La Cuenta débito no puede estar vacia.')
            setOpen(true)
            setSeverity('warning')
          }
          else if (credittaxaccountinterest==="") {
            setMensajeWarning('La Cuenta crédito interés no puede estar vacia.')
            setOpen(true)
            setSeverity('warning')
          }
          else if (debittaxaccountinterest==="") {
            setMensajeWarning('La Cuenta débito interés no puede estar vacia.')
            setOpen(true)
            setSeverity('warning')
          }
          else if (producttypedescription==="") {
            setMensajeWarning('El Tipo emision no puede estar vacio.')
            setOpen(true)
            setSeverity('warning')
          }
          else if (producttypemaestrosunicos==="") {
            setMensajeWarning('El Código tipo emisión Maestros Únicos no puede estar vacio.')
            setOpen(true)
            setSeverity('warning')
          }else {

            const dataToUpdate ={
                "producttypemaestrosunicos": producttypemaestrosunicos,
                "credittaxaccountinterest": credittaxaccountinterest,
                "credittaxaccount": credittaxaccount,
                "debittaxaccountinterest": debittaxaccountinterest,
                "debittaxaccount": debittaxaccount,
                "producttypedescription": producttypedescription,
            }
            service.updateItemConfiguracionGeneral(dataToUpdate,taxaccountid)
            setMensajeWarning('Datos actualziados')
            setOpen(true)
            setSeverity('info')
            goToConfiguracionGeneral()
            event.preventDefault();
        }
    }

    const [pantallaVisibleEditar, setPantallaVisibleEditar] = useState();

    async function goToConfiguracionGeneral () {
        console.log('go to configuracion general');
        setPantallaVisibleEditar(
            <ConfiguracionContableGeneral/>
        );
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false);
      };

    const onChangeEmision = (event) => {
        producttypedescription=event.value
    }

    useEffect(() => {
        emisiones=props.emisiones
        console.log(emisiones)
        emisionesDefault=[{ value: 0, label: props.info.producttypedescription }]
        taxaccountid=props.info.taxaccountid
        credittaxaccount=props.info.credittaxaccount
        debittaxaccount=props.info.debittaxaccount
        credittaxaccountinterest=props.info.credittaxaccountinterest
        debittaxaccountinterest=props.info.debittaxaccountinterest
        producttypedescription=props.info.producttypedescription
        producttypemaestrosunicos=props.info.producttypemaestrosunicos

        setPantallaVisibleEditar(
        <div>
            <CardHeader title={title} description={description } />
                <Stack direction="row" spacing={0.5} >
                    <TextField
                        id="outlined-multiline-flexible"
                        label="Cuenta crédito"
                        type="number"
                        defaultValue={credittaxaccount}
                        variant="standard"
                        onChange={handleChangeCredittaxaccount}
                    />
                    <TextField
                        id="outlined-multiline-flexible"
                        label="Cuenta débito"
                        type="number"
                        defaultValue={props.info.debittaxaccount}
                        variant="standard"
                        onChange={handleChangeDebittaxaccount}
                    />
                    <TextField
                        id="outlined-multiline-flexible"
                        label="Cuenta crédito interés"
                        type="number"
                        defaultValue={props.info.credittaxaccountinterest}
                        variant="standard"
                        onChange={handleChangeCredittaxaccountinterest}
                    />
                    <TextField
                        id="outlined-multiline-flexible"
                        label="Cuenta débito interés"
                        type="number"
                        defaultValue={props.info.debittaxaccountinterest}
                        variant="standard"
                        onChange={handleChangeDebittaxaccountinterest}
                    />
                    <Col s={8} m={3}>
                        <label className="active">Tipo de emisión</label>
                        <Select 
                            className="basic-single" 
                            defaultValue={emisionesDefault} 
                            options={emisiones} 
                            onChange={onChangeEmision} 
                        />
                    </Col>
                    <TextField
                        id="outlined-multiline-flexible"
                        label="Código tipo emisión Maestros Únicos"
                        type="number"
                        defaultValue={props.info.producttypemaestrosunicos}
                        variant="standard"
                        onChange={handleChangeProducttypemaestrosunicos}
                    />
                </Stack>
                <Stack direction="row" spacing={0.5} >
                    <Button node="button" small className="indigo darken-4" onClick={handleSubmit}>
                        Guardar cambios
                    </Button> 
                    <br />
                    <Button node="button" small className="indigo darken-4" onClick={goToConfiguracionGeneral} >
                        cancelar actualizacion
                    </Button>
                </Stack>
        </div>)
    }, [,props]);

    return (
        <React.Fragment>
            {pantallaVisibleEditar}
            <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
                <Alert onClose={handleClose} variant="filled" severity={severity} sx={{ width: '100%' }}>
                    {mensajeWarning}
                </Alert>
            </Snackbar>
        </React.Fragment>
    )
}