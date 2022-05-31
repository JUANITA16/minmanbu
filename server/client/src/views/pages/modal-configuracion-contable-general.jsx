import React, { useState, useEffect } from "react";
import { Row, Col, Button,  Modal } from 'react-materialize'
import Select from 'react-select'
import { ServerAPI } from "../../services/server";
import { toast } from 'react-toastify';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';


const service = new ServerAPI();



export default function ModalConfiguracionContableGeneral(props) {

    const title = "Nuevo - Configuración general"

    const [credittaxaccount, setCredittaxaccount] = useState("");
    const [credittaxaccountValid, setCredittaxaccountValid] = useState(true);
    
    const [debittaxaccount, setDebittaxaccount] = useState("");
    const [debittaxaccountValid, setDebittaxaccountValid] = useState(true);

    const [credittaxaccountinterest, setCredittaxaccountinterest] = useState("");
    const [credittaxaccountinterestValid, setCredittaxaccountinterestValid] = useState(true);

    const [debittaxaccountinterest, setDebittaxaccountinterest] = useState("");
    const [debittaxaccountinterestValid, setDebittaxaccountinterestValid] = useState(true);

    const [producttypedescription, setProducttypedescription] = useState('0');
    const [producttypedescriptionValid, setProducttypedescriptionValid] = useState(true);

    const [producttypemaestrosunicos, setProducttypemaestrosunicos] = useState("");
    const [producttypemaestrosunicosValid, setProducttypemaestrosunicosValid] = useState(true);

    const [mensajeWarning, setMensajeWarning] = React.useState('');
    const [severity, setSeverity] = React.useState('info');
    const [open, setOpen] = React.useState(false);
    const [styleTipoEmision,setStyleTipoEmision] = useState("");
    const [isOpenModal,setIsOpenModal]=useState(false);

    const [selecTipoEmisiones2, setSelecTipoEmisiones2] = useState();
    const [submitSucess, setSubmitSucess] = useState(false);
    
    const styletipoEmisionError = {
        control: (provided, state) => ({
        ...provided,
        border: "1px solid red",
        boxShadow: "0px 0px 6px red",
    
        "&:hover": {
            border: "1px solid red",
            boxShadow: "0px 0px 6px red"
        }
        })
    };

    function validateNumber(e) {
        const pattern = /^[0-9]{1,}$/;
    
        return pattern.test(e)
    }
    
    const handleChangeCredittaxaccount = (event) => {
        setIsOpenModal(true);
        const creditAccount = event.target.value;
        setCredittaxaccount(creditAccount);
        if(!validateNumber(creditAccount)){
            setCredittaxaccountValid(false);
        }else{
            setCredittaxaccountValid(true);
        }
    }

    const handleChangeDebittaxaccount = (event) => {
        const debitAccount = event.target.value; 
        setDebittaxaccount(debitAccount);
        if(!validateNumber(debitAccount)){
            setDebittaxaccountValid(false);
        }else{
            setDebittaxaccountValid(true);
        }
    }
    const handleChangeCredittaxaccountinterest = (event) => {
        const creditInterest = event.target.value;
        setCredittaxaccountinterest(creditInterest);
        if(!validateNumber(creditInterest)){
            setCredittaxaccountinterestValid(false);
        }else{
            setCredittaxaccountinterestValid(true);
        }
    }
    const handleChangeDebittaxaccountinterest = (event) => {
        const debitInterest = event.target.value;
        setDebittaxaccountinterest(debitInterest);
        if(!validateNumber(debitInterest)){
            setDebittaxaccountinterestValid(false);
        }else{
            setDebittaxaccountinterestValid(true);
        }
    }

    const handleChangeProducttypemaestrosunicos = (event) => {
        const productMaestrosUnicos = event.target.value; 
        setProducttypemaestrosunicos(productMaestrosUnicos);
        if(!validateNumber(productMaestrosUnicos)){
            setProducttypemaestrosunicosValid(false);
        }else{
            setProducttypemaestrosunicosValid(true); 
        }
    }
    
    const onChangeEmision = (event) => {
        const productDescription = event.value;
        setProducttypedescription(productDescription);
        if(productDescription=='0'){
            setStyleTipoEmision(styletipoEmisionError);
            setProducttypedescriptionValid(false);
        }else{
            setStyleTipoEmision('');
            setProducttypedescriptionValid(true);
        }
    }
    
    
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false);
      };

    function msjError(){
        setMensajeWarning('Ingresar los datos correctamente.')
        setSeverity('error')
        setOpen(true)
    }
    
    async function handleSubmit (){
        if(producttypedescription == '0'){
            setProducttypedescriptionValid(false);
            setStyleTipoEmision(styletipoEmisionError);
            msjError();
        }else if(!validateNumber(producttypemaestrosunicos)){
            setProducttypemaestrosunicosValid(false);
            msjError();
        }else if(!validateNumber(credittaxaccount)){
            setCredittaxaccountValid(false);
            msjError();
        }else if(!validateNumber(debittaxaccount)){
            setDebittaxaccountValid(false);
            msjError();
        }else if(!validateNumber(credittaxaccountinterest)){
            setCredittaxaccountinterestValid(false);
            msjError();
        }else if(!validateNumber(debittaxaccountinterest)){
            setDebittaxaccountinterestValid(false);
            msjError();
        }else{
            const dataSubmit ={
                "producttypemaestrosunicos": producttypemaestrosunicos,
                "credittaxaccountinterest": credittaxaccountinterest,
                "credittaxaccount": credittaxaccount,
                "debittaxaccountinterest": debittaxaccountinterest,
                "debittaxaccount": debittaxaccount,
                "producttypedescription": producttypedescription,
            }
            const responseCreate = await service.createItemConfiguracionGeneral(dataSubmit).then(response => {
                return response;
                }
            );
            if(responseCreate.status===200){
                toast.success("Configuración registrada correctamente.");
            }else{
                toast.error("Error al registrar configuración.");
            }
            
            setCredittaxaccount("")
            setDebittaxaccount("")
            setCredittaxaccountinterest("")
            setDebittaxaccountinterest("")
            setProducttypemaestrosunicos("")
            setProducttypedescription("0")
            props.setSave(new Date());
           
            setIsOpenModal(false);
        }

    }

    
    useEffect(() => {
        console.log('useEffect-modal-nuevo')
        setSelecTipoEmisiones2(<Select className="basic-single" styles={styleTipoEmision} defaultValue={props.emisiones[0]} options={props.emisiones} onChange={onChangeEmision} />)
        document.title = title
    }, [submitSucess,styleTipoEmision]);

    return(
            <Modal
                actions={[
                    <Button node="button" small className="indigo darken-4" onClick={handleSubmit}>Guardar</Button>,
                    <Button flat modal="close" node="button" waves="red">Cancelar</Button>
                ]}
                bottomSheet={false}
                fixedFooter={false}
                header={title}
                id="Modal-1"
                open={isOpenModal}
                options={{
                    dismissible: true,
                    endingTop: '20%',
                    inDuration: 250,
                    onCloseEnd: function onCloseEnd(){
                        
                        console.log('se cambia styleTipoEmision')
                        setStyleTipoEmision('');
                    },
                    onCloseStart: function onCloseStart(){
                        console.log('funcion on close start')
                        setSelecTipoEmisiones2('');
                        if(submitSucess==true){
                            console.log('submitSucess true cambiado a false')
                            setSubmitSucess(false);
                        }else{
                            console.log('submitSucess false cambiado a true')
                            setSubmitSucess(true);
                        }
                        setStyleTipoEmision('close');
                    },
                    onOpenEnd: null,
                    onOpenStart: null,
                    opacity: 0.5,
                    outDuration: 250,
                    preventScrolling: true,
                    startingTop: '4%'
                }}
                trigger={<Button node="button" small className="indigo darken-4">Nuevo</Button>}
                >
                <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
                    <Alert onClose={handleClose} variant="filled" severity={severity} sx={{ width: '100%' }}>
                        {mensajeWarning}
                    </Alert>
                </Snackbar>
                    <Row></Row>
                    <Row>
                        <Col s={12} m={9} >
                            <div className="input-field-2">
                                <label className={`${producttypedescriptionValid? 'active':'txt-red'}`}>Tipo de emisión</label>
                                {selecTipoEmisiones2}
                            </div>
                        </Col>
                        
                        <Col s={12} m={3} >
                            <div className="input-field-2">
                                <label className={`${producttypemaestrosunicosValid? '':'txt-red'}`}>Número de Cuenta</label>
                                <input type="number" className={`${producttypemaestrosunicosValid? 'valid':'invalid'}`} 
                                onChange={handleChangeProducttypemaestrosunicos}
                                value={producttypemaestrosunicos}/>
                            </div>
                        </Col>
                    </Row>
                    <Row>

                        <Col s={12} m={3} >
                            <div className="input-field-2">
                                <label className={`${credittaxaccountValid? '':'txt-red'}`}>Cuenta crédito</label>
                                <input type="number" className={`${credittaxaccountValid? 'valid':'invalid'}`} 
                                onChange={handleChangeCredittaxaccount}
                                value={credittaxaccount}/>
                            </div>
                        </Col>
                        <Col s={12} m={3} >
                            <div className="input-field-2">
                                <label className={`${debittaxaccountValid? '':'txt-red'}`}>Cuenta débito</label>
                                <input type="number" className={`${debittaxaccountValid? 'valid':'invalid'}`} 
                                onChange={handleChangeDebittaxaccount}
                                value={debittaxaccount}/>
                            </div>
                        </Col>
                        <Col s={12} m={3} >
                            <div className="input-field-2">
                                <label className={`${credittaxaccountinterestValid? '':'txt-red'}`}>Cuenta crédito interés</label>
                                <input type="number" className={`${credittaxaccountinterestValid? 'valid':'invalid'}`} 
                                onChange={handleChangeCredittaxaccountinterest}
                                value={credittaxaccountinterest}/>
                            </div>
                        </Col>
                        <Col s={12} m={3} >
                            <div className="input-field-2">
                                <label className={`${debittaxaccountinterestValid? '':'txt-red'}`}>Cuenta débito interés</label>
                                <input type="number" className={`${debittaxaccountinterestValid? 'valid':'invalid'}`} 
                                onChange={handleChangeDebittaxaccountinterest}
                                value={debittaxaccountinterest}/>
                            </div>
                        </Col>
                    </Row>
                    
                </Modal>
        );
}