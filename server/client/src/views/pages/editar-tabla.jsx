import React, {useEffect } from "react";
import { CardHeader } from "../components/index";
import { Button } from 'react-materialize'
import { ServerAPI } from "../../services/server";
import Stack from '@mui/material/Stack';
import { Col } from 'react-materialize'
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { toast } from 'react-toastify';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
const service = new ServerAPI();

export default function EditarTabla(props) {

    const title = "Edicion de CONFIGURACION GENERAL"
    const description = "En esta sección podrá realizar la edicion de los registros CONFIGURACION GENERAL"

    const [open, setOpen] = React.useState(false);
    const [mensajeWarning, setMensajeWarning] = React.useState('');
    const [severity, setSeverity] = React.useState('info');
    const [openModalNotificacion, setOpenModalNotificacion] = React.useState(false);

    const [errorCuentaCrédito, setErrorCuentaCrédito] = React.useState(false);
    const [errorCuentaDebito, setErrorCuentaDebito] = React.useState(false);
    const [errorCuentaCreditoInteres, setErrorCuentaCreditoInteres] = React.useState(false);
    const [errorCuentaDebitoInteres, setErrorCuentaDebitoInteres] = React.useState(false);
    const [errorTipoEmisionMaestrosUnicos, setErrorTipoEmisionMaestrosUnicos] = React.useState(false);
    

    const [emisiones, setEmisiones] = React.useState();


    
    var taxaccountid=""
    var credittaxaccount=""
    var debittaxaccount=""
    var credittaxaccountinterest=""
    var debittaxaccountinterest=""
    var producttypedescription=""
    var producttypemaestrosunicos=""

    function validateNumber(e) {
        const pattern = /^[0-9]{1,}$/;
        return pattern.test(e)
    }

    const handleChangeCredittaxaccount = (event) =>{
        console.log(event.target.value)
        credittaxaccount=event.target.value
        console.log(credittaxaccount)
        setErrorCuentaCrédito(!validateNumber(credittaxaccount));
    }

    const handleChangeDebittaxaccount= (event) =>{
        debittaxaccount=event.target.value
        setErrorCuentaDebito(!validateNumber(debittaxaccount));
    }

    const handleChangeCredittaxaccountinterest = (event) =>{
        credittaxaccountinterest=event.target.value
        setErrorCuentaCreditoInteres(!validateNumber(credittaxaccountinterest));
    }

    const handleChangeDebittaxaccountinterest = (event) =>{
        debittaxaccountinterest=event.target.value
        setErrorCuentaDebitoInteres(!validateNumber(debittaxaccountinterest));
    }

    const handleChangeProducttypemaestrosunicos = (event) =>{
        producttypemaestrosunicos=event.target.value
        setErrorTipoEmisionMaestrosUnicos(!validateNumber(producttypemaestrosunicos));
    }

    async function handleSubmit() {

        console.log(credittaxaccount)
        console.log(debittaxaccount)
        console.log(credittaxaccountinterest)
        console.log(debittaxaccountinterest)
        console.log(producttypedescription)
        console.log(producttypemaestrosunicos)
        if (credittaxaccount==="") {
            setOpenModalNotificacion(true)
            setErrorCuentaCrédito(true)
            setMensajeWarning('Todos los campos son de diligenciamiento obligatorio.')
            setSeverity('error')
            setOpen(true)
          } else if (debittaxaccount==="") {
            setOpenModalNotificacion(true)
            setErrorCuentaDebito(true)
            setMensajeWarning('Todos los campos son de diligenciamiento obligatorio.')
            setOpen(true)
            setSeverity('error')
          }
          else if (credittaxaccountinterest==="") {
            setOpenModalNotificacion(true)
            setErrorCuentaCreditoInteres(true)
            setMensajeWarning('Todos los campos son de diligenciamiento obligatorio.')
            setOpen(true)
            setSeverity('error')
          }
          else if (debittaxaccountinterest==="") {
            setOpenModalNotificacion(true)
            setErrorCuentaDebitoInteres(true)
            setMensajeWarning('Todos los campos son de diligenciamiento obligatorio.')
            setOpen(true)
            setSeverity('error')
          }
          else if (producttypedescription==="") {
            setOpenModalNotificacion(true)
            setMensajeWarning('Todos los campos son de diligenciamiento obligatorio.')
            setOpen(true)
            setSeverity('error')
          }
          else if (producttypemaestrosunicos==="") {
            setOpenModalNotificacion(true)
            setErrorTipoEmisionMaestrosUnicos(true)
            setMensajeWarning('Todos los campos son de diligenciamiento obligatorio.')
            setOpen(true)
            setSeverity('error')
          }else {

            const dataToUpdate ={
                "producttypemaestrosunicos": producttypemaestrosunicos,
                "credittaxaccountinterest": credittaxaccountinterest,
                "credittaxaccount": credittaxaccount,
                "debittaxaccountinterest": debittaxaccountinterest,
                "debittaxaccount": debittaxaccount,
                "producttypedescription": producttypedescription,
            }
            console.log(dataToUpdate)
            const mensajeRespuesta =  await service.updateItemConfiguracionGeneral(dataToUpdate,taxaccountid).then(response => {
                return response;
                }
            );
            if (mensajeRespuesta.status === 200){
                toast.success("Datos actualizados");
            }else{
                toast.error("Datos no actualizados");
            }

            props.reloadTableMain("10","0")
            goToConfiguracionGeneral()

        }
    }

    async function goToConfiguracionGeneral () {
        props.setOpenModal(false)
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false);
        setOpenModalNotificacion(false)
      };

    const onChangeEmision = (event) => {
        producttypedescription=event.target.value
    }

    useEffect(() => {
        props.emisiones.shift()
        setEmisiones(props.emisiones)
    }, [,props]);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
      };

    return (
        <React.Fragment>
            <CardHeader title={title} description={description } />
            <Stack direction="row" spacing={0.5} >
                <div className="input-field-2">
                    <label className={`${errorCuentaCrédito ? 'txt-red':''}`}>Cuenta crédito</label>
                    <input className={`${errorCuentaCrédito? 'invalid':''}`}
                    onChange={handleChangeCredittaxaccount}
                    placeholder={props.info.credittaxaccount}
                    />
                </div>
                <div className="input-field-2">
                    <label className={`${errorCuentaDebito ? 'txt-red':''}`}>Cuenta débito</label>
                    <input className={`${errorCuentaDebito? 'invalid':''}`}
                    onChange={handleChangeDebittaxaccount}
                    placeholder={props.info.debittaxaccount}
                    />
                </div>
                <div className="input-field-2">
                    <label className={`${errorCuentaCreditoInteres ? 'txt-red':''}`}>Cuenta crédito interés</label>
                    <input className={`${errorCuentaCreditoInteres? 'invalid':''}`}
                    onChange={handleChangeCredittaxaccountinterest}
                    placeholder={props.info.credittaxaccountinterest}
                    />
                </div>
                <div className="input-field-2">
                    <label className={`${errorCuentaDebitoInteres ? 'txt-red':''}`}>Cuenta débito interés</label>
                    <input className={`${errorCuentaDebitoInteres? 'invalid':''}`}
                    onChange={handleChangeDebittaxaccountinterest}
                    placeholder={props.info.debittaxaccountinterest}
                    />
                </div>
                <Col s={10} m={3}>
                    <label >Tipo de emisión</label>
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                        <Select
                            onChange={onChangeEmision}
                            sx={{fontSize: 16, border: 'red 5px none'}}
                            >
                            {props.emisiones.map((option) => (
                                <MenuItem key={option.value} value={option.label}>
                                {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Col>
                 <div className="input-field-2">
                    <label className={`${errorTipoEmisionMaestrosUnicos ? 'txt-red':''}`}>Código tipo emisión Maestros Únicos</label>
                    <input className={`${errorTipoEmisionMaestrosUnicos? 'invalid':''}`}
                    onChange={handleChangeProducttypemaestrosunicos}
                    placeholder={props.info.producttypemaestrosunicos}
                    />
                </div>
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

            <Modal
                open={openModalNotificacion}
                onClose={() => setOpenModalNotificacion(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Snackbar open={open} onClose={handleClose}>
                            <Alert onClose={handleClose} variant="filled" severity={severity} sx={{ width: '100%' }}>
                                {mensajeWarning}
                            </Alert>
                        </Snackbar>
                    </Box>
            </Modal>
        </React.Fragment>
    )
}