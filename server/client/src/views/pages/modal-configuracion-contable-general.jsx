import React, {useState,useEffect } from "react";
import { Button,Row, Col, Divider } from 'react-materialize'
import { ServerAPI } from "../../services/server";
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { toast } from 'react-toastify';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';


const service = new ServerAPI();

export default function ModalConfiguracionContableGeneral(props) {

    const [open, setOpen] = useState(false);
    const [mensajeWarning, setMensajeWarning] = useState('');
    const [severity, setSeverity] = useState('info');
    const [openModalNotificacion, setOpenModalNotificacion] = useState(false);

    const [emisiones, setEmisiones] = useState();

    const [credittaxaccount, setCredittaxaccount] = useState("");
    const [credittaxaccountValid, setCredittaxaccountValid] = useState(true);

    const [debittaxaccount, setDebittaxaccount] = useState("");
    const [debittaxaccountValid, setDebittaxaccountValid] = useState(true);
    
    const [credittaxaccountinterest, setCredittaxaccountinterest] = useState("");
    const [credittaxaccountinterestValid, setCredittaxaccountinterestValid] = useState(true);

    const [debittaxaccountinterest, setDebittaxaccountinterest] = useState("");
    const [debittaxaccountinterestValid, setDebittaxaccountinterestValid] = useState(true);
    
    const [producttypedescription, setProducttypedescription] = useState("");
    const [producttypedescriptionError, setProducttypedescriptionError] = useState(false);
    
    const [producttypemaestrosunicos, setProducttypemaestrosunicos] = useState("");
    const [producttypemaestrosunicosValid, setProducttypemaestrosunicosValid] = useState(true);

    const [tipoProceso, setTipoProceso] = useState('');


    function validateNumber(e) {
        const pattern = /^[0-9]{1,}$/;
        return pattern.test(e)
    }

    const handleChangeCredittaxaccount = (event) =>{
        if(event.target.validity.valid){
            setCredittaxaccount(event.target.value)
            setCredittaxaccountValid(event.target.value!='');
        }
    }

    const handleChangeDebittaxaccount= (event) =>{
        if(event.target.validity.valid){
            setDebittaxaccount(event.target.value)
            setDebittaxaccountValid(event.target.value!='');
        }
    }

    const handleChangeCredittaxaccountinterest = (event) =>{
        if(event.target.validity.valid){
            setCredittaxaccountinterest(event.target.value)
            setCredittaxaccountinterestValid(event.target.value!='');
        }
    }

    const handleChangeDebittaxaccountinterest = (event) =>{
        if(event.target.validity.valid){
            setDebittaxaccountinterest(event.target.value)
            setDebittaxaccountinterestValid(event.target.value!='');
        }
    }

    const handleChangeProducttypemaestrosunicos = (event) =>{
        if(event.target.validity.valid){
            setProducttypemaestrosunicos(event.target.value)
            setProducttypemaestrosunicosValid(event.target.value!='');
        }
    }

    const onChangeEmision = (event) => {
        const productDescription = event.target.value;
        setProducttypedescription(productDescription)
        if(productDescription===""){
            setProducttypedescriptionError(true);
        }else{
            setProducttypedescriptionError(false);
        }
    }

    function msjError(){
        setOpenModalNotificacion(true);
        setMensajeWarning('Todos los campos son de diligenciamiento obligatorio.')
        setSeverity('error')
        setOpen(true)
    }

    async function handleSubmit() {
        if (credittaxaccount===""){
            setCredittaxaccountValid(false);
            msjError();
        }else if(debittaxaccount===""){
            setDebittaxaccountValid(false)
            msjError();
        }else if(credittaxaccountinterest===""){
            setCredittaxaccountinterestValid(false);
            msjError()
        }else if(debittaxaccountinterest===""){
            setDebittaxaccountinterestValid(false);
            msjError()
        }else if(producttypedescription===""){
            setProducttypedescriptionError(true)
            msjError();
        }else if(producttypemaestrosunicos===""){
            setProducttypemaestrosunicosValid(false);
            msjError();
        }else {

            const dataSubmit ={
                "producttypemaestrosunicos": producttypemaestrosunicos,
                "credittaxaccountinterest": credittaxaccountinterest,
                "credittaxaccount": credittaxaccount,
                "debittaxaccountinterest": debittaxaccountinterest,
                "debittaxaccount": debittaxaccount,
                "producttypedescription": producttypedescription,
            }
            if(tipoProceso==='Nuevo'){
                const responseCreate = await service.createItemConfiguracionGeneral(dataSubmit).then(response => {
                    return response;
                    });
                if(responseCreate.status===200){
                    toast.success("Configuración registrada correctamente.");
                }else{
                    toast.error("Error al registrar configuración.");
                }
            }else if(tipoProceso==='Editar'){
                const mensajeRespuesta =  await service.updateItemConfiguracionGeneral(dataSubmit,props.info.taxaccountid).then(response => {
                    return response;
                    }
                );
                if (mensajeRespuesta.status === 200){
                    toast.success("Configuración actualizada correctamente.");
                }else{
                    toast.error("Error al actualizar configuración.");
                }
            }
            props.reloadTableMain(props.cantPaginas,"0")
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


    useEffect(() => {
        setProducttypedescription(props.info.producttypedescription)
        setTipoProceso(props.tipoProceso)
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
            <Row>
                <Col s={12}>
                    <h4 className='card-title indigo-text'>{props.title}</h4>
                    <Divider></Divider>
                    <div>
                        <p className="grey-text text-darken-2">{props.description}</p>
                    </div>
                </Col>
            </Row>
            <Stack direction="row" spacing={0.5} >
                <div className="input-field-2">
                    <label className={`${credittaxaccountValid? '':'txt-red'}`}>Cuenta crédito</label>
                    <input className={`${credittaxaccountValid? 'valid':'invalid'}`} 
                    onChange={handleChangeCredittaxaccount}
                    placeholder={props.info.credittaxaccount}
                    type="text"
                    pattern="[0-9]*"
                    value = {credittaxaccount}
                    />
                </div>
                <div className="input-field-2">
                    <label className={`${debittaxaccountValid? '':'txt-red'}`}>Cuenta débito</label>
                    <input className={`${debittaxaccountValid? 'valid':'invalid'}`} 
                    onChange={handleChangeDebittaxaccount}
                    placeholder={props.info.debittaxaccount}
                    type="text"
                    pattern="[0-9]*"
                    value = {debittaxaccount}
                    />
                </div>
                <div className="input-field-2">
                    <label className={`${credittaxaccountinterestValid? '':'txt-red'}`}>Cuenta crédito interés</label>
                    <input className={`${credittaxaccountinterestValid? 'valid':'invalid'}`} 
                    onChange={handleChangeCredittaxaccountinterest}
                    placeholder={props.info.credittaxaccountinterest}
                    type="text"
                    pattern="[0-9]*"
                    value = {credittaxaccountinterest}
                    />
                </div>
                <div className="input-field-2">
                    <label  className={`${debittaxaccountinterestValid? '':'txt-red'}`}>Cuenta débito interés</label>
                    <input className={`${debittaxaccountinterestValid? 'valid':'invalid'}`} 
                    onChange={handleChangeDebittaxaccountinterest}
                    placeholder={props.info.debittaxaccountinterest}
                    type="text"
                    pattern="[0-9]*"
                    value = {debittaxaccountinterest}
                    />
                </div>
                <Col s={10} m={3}>
                    <label  className={`${producttypedescriptionError? 'txt-red':''}`} >Tipo de emisión</label>
                    <FormControl variant="standard" error={producttypedescriptionError} sx={{ m: 1, minWidth: 200 , maxWidth: 200}}>
                        <Select
                            defaultValue={props.info.producttypedescription}
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
                    <label  className={`${producttypemaestrosunicosValid? '':'txt-red'}`}>Código tipo emisión Maestros Únicos</label>
                    <input  className={`${producttypemaestrosunicosValid? 'valid':'invalid'}`} 
                    onChange={handleChangeProducttypemaestrosunicos}
                    placeholder={props.info.producttypemaestrosunicos}
                    type="text"
                    pattern="[0-9]*"
                    value = {producttypemaestrosunicos}
                    />
                </div>
            </Stack>
            <Stack direction="row" spacing={0.5} >
                <Button node="button" small className="indigo darken-4" onClick={handleSubmit}>
                    Guardar
                </Button>
                <br />
                <Button node="button" small  className="indigo darken-4" onClick={goToConfiguracionGeneral} >
                    Cancelar
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