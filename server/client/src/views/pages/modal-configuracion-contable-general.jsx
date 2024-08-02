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

const HTTP_OK = 200;
export default function ModalConfiguracionContableGeneral(props) {

    const service = new ServerAPI();
    
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
    const [producttypedescriptionEdit, setProducttypedescriptionEdit] = useState("");
    
    const [producttypemaestrosunicos, setProducttypemaestrosunicos] = useState("");
    const [producttypemaestrosunicosValid, setProducttypemaestrosunicosValid] = useState(true);

    const [producttype, setProducttype] = useState("");

    const [tipoProceso, setTipoProceso] = useState('');

    //Nuevo campos
    
    const [credittaxaccountemission, setCredittaxaccountemission] = useState("");
    const [credittaxaccountemissionValid, setCredittaxaccountemissionValid] = useState(true);

    const [debittaxaccountemission, setDebittaxaccountemission] = useState("");
    const [debittaxaccountemissionValid, setDebittaxaccountemissionValid] = useState(true);
     
    const [credittaxaccountinterestpaymet, setCredittaxaccountinterestpaymet] = useState("");
    const [credittaxaccountinterestpaymetValid, setCredittaxaccountinterestpaymetValid] = useState(true);

    const [debittaxaccountinterestpaymet, setDebittaxaccountinterestpaymet] = useState("");
    const [debittaxaccountinterestpaymetValid, setDebittaxaccountinterestpaymetValid] = useState(true);

    const [credittaxaccountcapitalpaymet, setCredittaxaccountcapitalpaymet] = useState("");
    const [credittaxaccountcapitalpaymetValid, setCredittaxaccountcapitalpaymetValid] = useState(true);

    const [debittaxaccountcapitalpaymet, setDebittaxaccountcapitalpaymet] = useState("");
    const [debittaxaccountcapitalpaymetValid, setDebittaxaccountcapitalpaymetValid] = useState(true);

    const [credittaxaccountgmf, setCredittaxaccountgmf] = useState("");
    const [credittaxaccountgmfValid, setCredittaxaccountgmfValid] = useState(true);
    
    const [debittaxaccountgmf, setDebittaxaccountgmf] = useState("");
    const [debittaxaccountgmfValid, setDebittaxaccountgmfValid] = useState(true);


    const handleChangeCredittaxaccount = (event) =>{
        if(event.target.validity.valid){
            setCredittaxaccount(event.target.value)
            setCredittaxaccountValid(event.target.value!=='');
        }
    }

    const handleChangeDebittaxaccount= (event) =>{
        if(event.target.validity.valid){
            setDebittaxaccount(event.target.value)
            setDebittaxaccountValid(event.target.value!=='');
        }
    }

    const handleChangeCredittaxaccountinterest = (event) =>{
        if(event.target.validity.valid){
            setCredittaxaccountinterest(event.target.value)
            setCredittaxaccountinterestValid(event.target.value!=='');
        }
    }

    const handleChangeDebittaxaccountinterest = (event) =>{
        if(event.target.validity.valid){
            setDebittaxaccountinterest(event.target.value)
            setDebittaxaccountinterestValid(event.target.value!=='');
        }
    }

    const handleChangeProducttypemaestrosunicos = (event) =>{
        if(event.target.validity.valid){
            setProducttypemaestrosunicos(event.target.value)
            setProducttypemaestrosunicosValid(event.target.value!=='');
        }
    }

    //Nuevo campos
    

    const handleChangeCredittaxaccountemission = (event) =>{
        if(event.target.validity.valid){
            setCredittaxaccountemission(event.target.value)
            setCredittaxaccountemissionValid(event.target.value!=='');
        }
    }
	
	
    const handleChangeDebittaxaccountemission = (event) =>{
        if(event.target.validity.valid){
            setDebittaxaccountemission(event.target.value)
            setDebittaxaccountemissionValid(event.target.value!=='');
        }
    }
	
    const handleChangeCredittaxaccountinterestpaymet = (event) =>{
        if(event.target.validity.valid){
            setCredittaxaccountinterestpaymet(event.target.value)
            setCredittaxaccountinterestpaymetValid(event.target.value!=='');
        }
    }
	
    const handleChangeDebittaxaccountinterestpaymet = (event) =>{
        if(event.target.validity.valid){
            setDebittaxaccountinterestpaymet(event.target.value)
            setDebittaxaccountinterestpaymetValid(event.target.value!=='');
        }
    }
	
	
    const handleChangeCredittaxaccountcapitalpaymet = (event) =>{
        if(event.target.validity.valid){
            setCredittaxaccountcapitalpaymet(event.target.value)
            setCredittaxaccountcapitalpaymetValid(event.target.value!=='');
        }
    }
	
	
    const handleChangeDebittaxaccountcapitalpaymet = (event) =>{
        if(event.target.validity.valid){
            setDebittaxaccountcapitalpaymet(event.target.value)
            setDebittaxaccountcapitalpaymetValid(event.target.value!=='');
        }
    }
	
	
    const handleChangeCredittaxaccountgmf = (event) =>{
        if(event.target.validity.valid){
            setCredittaxaccountgmf(event.target.value)
            setCredittaxaccountgmfValid(event.target.value!=='');
        }
    }
	
	
    const handleChangeDebittaxaccountgmf = (event) =>{
        if(event.target.validity.valid){
            setDebittaxaccountgmf(event.target.value)
            setDebittaxaccountgmfValid(event.target.value!=='');
        }
    }

    const onChangeEmision = (event) => {
        const productDescription = event.target.value;
        const emisionJsonSelect = emisiones.find(element => element.value === productDescription)
        setProducttypemaestrosunicos(emisionJsonSelect['product_number'])
        setProducttype(emisionJsonSelect['product_type'])
        setProducttypedescription(productDescription)
        if(productDescription===""){
            setProducttypedescriptionError(true);
        }else{
            setProducttypedescriptionError(false);
        }
    }

    function msjError(msj){
        setOpenModalNotificacion(true);
        setMensajeWarning(msj)
        setSeverity('error')
        setOpen(true)
    }

    async function handleSubmit() {
        if (credittaxaccount===""){
            setCredittaxaccountValid(false);
            msjError('Todos los campos son de diligenciamiento obligatorio.');
        }else if(debittaxaccount===""){
            setDebittaxaccountValid(false)
            msjError('Todos los campos son de diligenciamiento obligatorio.');
        }else if(credittaxaccountinterest===""){
            setCredittaxaccountinterestValid(false);
            msjError('Todos los campos son de diligenciamiento obligatorio.')
        }else if(debittaxaccountinterest===""){
            setDebittaxaccountinterestValid(false);
            msjError('Todos los campos son de diligenciamiento obligatorio.')
        }else if(producttypedescription===""){
            setProducttypedescriptionError(true)
            msjError('Todos los campos son de diligenciamiento obligatorio.');
        }else if(producttypemaestrosunicos===""){
            setProducttypemaestrosunicosValid(false);
            msjError('Todos los campos son de diligenciamiento obligatorio.');
        }else if(credittaxaccountemission===""){
            setCredittaxaccountemissionValid(false);
            msjError('Todos los campos son de diligenciamiento obligatorio.');
        }else if(debittaxaccountemission ===""){
            setDebittaxaccountemissionValid(false);
            msjError('Todos los campos son de diligenciamiento obligatorio.');
        }else if(credittaxaccountinterestpaymet ===""){
            setCredittaxaccountinterestpaymetValid(false);
            msjError('Todos los campos son de diligenciamiento obligatorio.');
        }else if(debittaxaccountinterestpaymet ===""){
            setDebittaxaccountinterestpaymetValid(false);
            msjError('Todos los campos son de diligenciamiento obligatorio.');
        }else if(credittaxaccountcapitalpaymet ===""){
            setCredittaxaccountcapitalpaymetValid(false);
            msjError('Todos los campos son de diligenciamiento obligatorio.');
        }else if(debittaxaccountcapitalpaymet ===""){
            setDebittaxaccountcapitalpaymetValid(false);
            msjError('Todos los campos son de diligenciamiento obligatorio.');
        }else if(credittaxaccountgmf ===""){
            setCredittaxaccountgmfValid(false);
            msjError('Todos los campos son de diligenciamiento obligatorio.');
        }else if(debittaxaccountgmf ===""){
            setDebittaxaccountgmfValid(false);
            msjError('Todos los campos son de diligenciamiento obligatorio.');
        }else if(producttype ===""){
            msjError('Todos los campos son de diligenciamiento obligatorio.');
        }else {
            const isReloadTable = true;
            const dataSubmit ={
                "producttypemaestrosunicos": producttypemaestrosunicos,
                "credittaxaccountinterest": credittaxaccountinterest,
                "credittaxaccount": credittaxaccount,
                "debittaxaccountinterest": debittaxaccountinterest,
                "debittaxaccount": debittaxaccount,
                "producttypedescription": producttypedescription,
                "credittaxaccountemission":credittaxaccountemission,
                "debittaxaccountemission":debittaxaccountemission,
                "credittaxaccountinterestpaymet":credittaxaccountinterestpaymet,
                "debittaxaccountinterestpaymet":debittaxaccountinterestpaymet,
                "credittaxaccountcapitalpaymet":credittaxaccountcapitalpaymet,
                "debittaxaccountcapitalpaymet":debittaxaccountcapitalpaymet,
                "credittaxaccountgmf":credittaxaccountgmf,
                "debittaxaccountgmf":debittaxaccountgmf,
                "producttype":producttype,
                "user":props.user
            }
            if(tipoProceso==='Nuevo'){
                const responseCreate = await service.createItemConfiguracionGeneral(dataSubmit).then(response => {
                    return response;
                    });
                    if(responseCreate.status=== HTTP_OK && responseCreate.data){
                        if(responseCreate.data.message==='emision-exist'){
                            msjError('El tipo de emisión ya se encuentra registrado.');
                        isReloadTable=false;
                    }else{
                        toast.success("Configuración registrada correctamente.");
                    }
                }else{
                    toast.error("Error al registrar configuración.");
                }
            }else if(tipoProceso==='Editar'){
                const mensajeRespuesta =  await service.updateItemConfiguracionGeneral(dataSubmit,props.info.taxaccountid,producttypedescriptionEdit).then(response => {
                    return response;
                    }
                );
                if (mensajeRespuesta.status === HTTP_OK && mensajeRespuesta.data){
                    if(mensajeRespuesta.data.message==='emision-exist'){
                        msjError('El tipo de emisión ya se encuentra registrado.');
                        isReloadTable=false;
                    }else{
                        toast.success("Configuración actualizada correctamente.");
                    }
                }else{
                    toast.error("Error al actualizar configuración.");
                }
            }
            if(isReloadTable){
                props.reloadTableMain(props.cantPaginas,"", "")
                goToConfiguracionGeneral()
            }
        }
    }

    async function goToConfiguracionGeneral () {
        props.setOpenModal(false)
    };

    const handleClose = (_event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false);
        setOpenModalNotificacion(false);
      };     


    useEffect(() => {
        setTipoProceso(props.tipoProceso)
        setEmisiones(props.emisiones)

        //Valores
        if (typeof props.info.producttypedescription != 'undefined'){
            setProducttypedescriptionEdit(props.info.producttypedescription);
            setProducttypedescription(props.info.producttypedescription)
        }
        
        if (typeof props.info.credittaxaccount != 'undefined'){
            setCredittaxaccount(props.info.credittaxaccount)
        }

        if (typeof props.info.debittaxaccount != 'undefined'){
            setDebittaxaccount(props.info.debittaxaccount)
        }

        if (typeof props.info.credittaxaccountinterest != 'undefined'){
            setCredittaxaccountinterest(props.info.credittaxaccountinterest)
        }
        
        if (typeof props.info.debittaxaccountinterest != 'undefined'){
            setDebittaxaccountinterest(props.info.debittaxaccountinterest)
        }
        
        if (typeof props.info.credittaxaccountemission != 'undefined'){
            setCredittaxaccountemission(props.info.credittaxaccountemission)
        }

        if (typeof props.info.debittaxaccountemission != 'undefined'){
            setDebittaxaccountemission(props.info.debittaxaccountemission)
        }
       
        if (typeof props.info.credittaxaccountinterestpaymet != 'undefined'){
            setCredittaxaccountinterestpaymet(props.info.credittaxaccountinterestpaymet)
        }
        
        if (typeof props.info.debittaxaccountinterestpaymet != 'undefined'){
            setDebittaxaccountinterestpaymet(props.info.debittaxaccountinterestpaymet)
        }
        
        if (typeof props.info.credittaxaccountcapitalpaymet != 'undefined'){
            setCredittaxaccountcapitalpaymet(props.info.credittaxaccountcapitalpaymet)
        }
        
        if (typeof props.info.debittaxaccountcapitalpaymet != 'undefined'){
            setDebittaxaccountcapitalpaymet(props.info.debittaxaccountcapitalpaymet)
        }
        
        if (typeof props.info.credittaxaccountgmf != 'undefined'){
            setCredittaxaccountgmf(props.info.credittaxaccountgmf)    
        }

        if (typeof props.info.debittaxaccountgmf != 'undefined'){
            setDebittaxaccountgmf(props.info.debittaxaccountgmf)
        }
        
        if (typeof props.info.producttypemaestrosunicos != 'undefined'){
            setProducttypemaestrosunicos(props.info.producttypemaestrosunicos)
        }
        
        if (typeof props.info.producttype != 'undefined'){
            setProducttype(props.info.producttype)
        }

    }, [props]);

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
                <Row>
                    <Col s={6}>
                        <div className="input-field-2">
                            <label className={`${credittaxaccountValid? '':'txt-red'}`}>Cuenta crédito retención</label>
                            <input className={`${credittaxaccountValid? 'valid':'invalid'}`} 
                            onChange={handleChangeCredittaxaccount}
                            type="text"
                            pattern="[0-9]*"
                            value = {credittaxaccount}
                            />
                        </div> 
                    </Col>
                    <Col s={6}>
                        <div className="input-field-2">
                            <label className={`${debittaxaccountValid? '':'txt-red'}`}>Cuenta débito retención</label>
                            <input className={`${debittaxaccountValid? 'valid':'invalid'}`} 
                            onChange={handleChangeDebittaxaccount}
                            type="text"
                            pattern="[0-9]*"
                            value = {debittaxaccount}
                            />
                        </div>
                    </Col>
                    <Col s={6}>
                        <div className="input-field-2">
                            <label className={`${credittaxaccountinterestValid? '':'txt-red'}`}>Cuenta crédito interés</label>
                            <input className={`${credittaxaccountinterestValid? 'valid':'invalid'}`} 
                            onChange={handleChangeCredittaxaccountinterest}
                            type="text"
                            pattern="[0-9]*"
                            value = {credittaxaccountinterest}
                            />
                        </div>   
                    </Col>
                    <Col s={6}>
                        <div className="input-field-2">
                            <label  className={`${debittaxaccountinterestValid? '':'txt-red'}`}>Cuenta débito interés</label>
                            <input className={`${debittaxaccountinterestValid? 'valid':'invalid'}`} 
                            onChange={handleChangeDebittaxaccountinterest}
                            type="text"
                            pattern="[0-9]*"
                            value = {debittaxaccountinterest}
                            />
                        </div>
                    </Col>
                    <Col s={6}>
                        <div className="input-field-2">
                            <label  className={`${credittaxaccountemissionValid? '':'txt-red'}`}>Cuenta crédito emisión</label>
                            <input  className={`${credittaxaccountemissionValid? 'valid':'invalid'}`} 
                            onChange={handleChangeCredittaxaccountemission}
                            type="text"
                            pattern="[0-9]*"
                            value = {credittaxaccountemission}
                            />
                        </div>
                    </Col>
                    <Col s={6}>
                        <div className="input-field-2">
                            <label  className={`${debittaxaccountemissionValid? '':'txt-red'}`}>Cuenta débito emisión</label>
                            <input  className={`${debittaxaccountemissionValid? 'valid':'invalid'}`} 
                            onChange={handleChangeDebittaxaccountemission}
                            type="text"
                            pattern="[0-9]*"
                            value = {debittaxaccountemission}
                            />
                        </div>
                    </Col>
                    <Col s={6}>
                        <div className="input-field-2">
                            <label  className={`${credittaxaccountinterestpaymetValid? '':'txt-red'}`}>Cuenta crédito pago interés</label>
                            <input  className={`${credittaxaccountinterestpaymetValid? 'valid':'invalid'}`} 
                            onChange={handleChangeCredittaxaccountinterestpaymet}
                            type="text"
                            pattern="[0-9]*"
                            value = {credittaxaccountinterestpaymet}
                            />
                        </div>
                    </Col>
                    <Col s={6}>
                        <div className="input-field-2">
                            <label  className={`${debittaxaccountinterestpaymetValid? '':'txt-red'}`}>Cuenta débito pago interés</label>
                            <input  className={`${debittaxaccountinterestpaymetValid? 'valid':'invalid'}`} 
                            onChange={handleChangeDebittaxaccountinterestpaymet}
                            type="text"
                            pattern="[0-9]*"
                            value = {debittaxaccountinterestpaymet}
                            />
                        </div>
                    </Col>
                    <Col s={6}>
                        <div className="input-field-2">
                            <label  className={`${credittaxaccountcapitalpaymetValid? '':'txt-red'}`}>Cuenta crédito pago capital</label>
                            <input  className={`${credittaxaccountcapitalpaymetValid? 'valid':'invalid'}`} 
                            onChange={handleChangeCredittaxaccountcapitalpaymet}
                            type="text"
                            pattern="[0-9]*"
                            value = {credittaxaccountcapitalpaymet}
                            />
                        </div>
                    </Col>
                    <Col s={6}>
                        <div className="input-field-2">
                            <label  className={`${debittaxaccountcapitalpaymetValid? '':'txt-red'}`}>Cuenta débito pago capital</label>
                            <input  className={`${debittaxaccountcapitalpaymetValid? 'valid':'invalid'}`} 
                            onChange={handleChangeDebittaxaccountcapitalpaymet}
                            type="text"
                            pattern="[0-9]*"
                            value = {debittaxaccountcapitalpaymet}
                            />
                        </div>
                    </Col>
                    <Col s={6}>
                        <div className="input-field-2">
                            <label  className={`${credittaxaccountgmfValid? '':'txt-red'}`}>Cuenta crédito GMF</label>
                            <input  className={`${credittaxaccountgmfValid? 'valid':'invalid'}`} 
                            onChange={handleChangeCredittaxaccountgmf}
                            type="text"
                            pattern="[0-9]*"
                            value = {credittaxaccountgmf}
                            />
                        </div>
                    </Col>
                    <Col s={6}>
                        <div className="input-field-2">
                            <label  className={`${debittaxaccountgmfValid? '':'txt-red'}`}>Cuenta débito GMF</label>
                            <input  className={`${debittaxaccountgmfValid? 'valid':'invalid'}`} 
                            onChange={handleChangeDebittaxaccountgmf}
                            type="text"
                            pattern="[0-9]*"
                            value = {debittaxaccountgmf}
                            />
                        </div>
                    </Col>
                    <Col s={6}>
                        <label  className={`${producttypedescriptionError? 'txt-red':''}`} >Tipo de emisión</label>
                        <FormControl variant="standard" error={producttypedescriptionError} sx={{ marginTop: 2}} fullWidth>
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
                    <Col s={6}>
                        <div className="input-field-2">
                            <label  className={`${producttypemaestrosunicosValid? '':'txt-red'}`}>Código tipo emisión Maestros Únicos</label>
                            <input  className={`${producttypemaestrosunicosValid? 'valid':'invalid'}`} 
                            onChange={handleChangeProducttypemaestrosunicos}
                            type="text"
                            pattern="[0-9]*"
                            value = {producttypemaestrosunicos}
                            disabled="disabled"
                            />
                        </div>
                    </Col>
                </Row>
            </Stack>
            <div style={{margin:"12px"}}>
                <Stack direction="row" spacing={0.5} >
                    <Button node="button" small className="indigo darken-4" onClick={handleSubmit}>
                Guardar
                    </Button>
                    <br />
                    <Button node="button" small  className="indigo darken-4" onClick={goToConfiguracionGeneral} >
                        Cancelar
                    </Button>
                </Stack>
            </div>
            

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