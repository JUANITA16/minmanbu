import React, {useState,useEffect } from "react";
import { Button,Row, Col, Divider } from 'react-materialize'
import { ServerAPI } from "../../services/server";
import { toast } from 'react-toastify';
import { Box, Modal, Snackbar, Alert, Stack } from "@mui/material";


const service = new ServerAPI();

export default function ModalConfiguracionHomologacion(props) {

  const [open, setOpen] = useState(false);
  const [mensajeWarning, setMensajeWarning] = useState('');
  const [severity, setSeverity] = useState('info');
  const [openModalNotificacion, setOpenModalNotificacion] = useState(false);
  
  const [validation, setValidation] = useState({
    accountNumber: true,
    cosifNumber: true,
    costCenter: true
  });
  const [values, setValues] = useState({
    accounting_account: "",
    cosif: "",
    costcenteraccounting: ""
  });

  useEffect(() => {
    setValues(props.info)
  }, [props]); 


  const handleChange = function (event) {
    if(event.target.validity.valid){
      setValues((prevValues) => ({
        ...prevValues,
        [event.target.id]: event.target.value
      }));
      setValidation((prevValues) => ({
        ...prevValues,
        [event.target.id]: event.target.value!==''
      }))
    }
  }



  function msjError(){
    setOpenModalNotificacion(true);
    setMensajeWarning('Todos los campos son de diligenciamiento obligatorio.')
    setSeverity('error')
    setOpen(true)
  }

  async function handleSubmit() {
    if (values.accounting_account===""){
      setValidation((prevValues)=>({
        ...prevValues,
        accountNumber: false 
      }));
      msjError();
    }else if(values.cosif===""){
      setValidation((prevValues)=>({
        ...prevValues,
        cosifNumber: false 
      }));
      msjError();
    }else if(values.costcenteraccounting===""){
      setValidation((prevValues)=>({
        ...prevValues,
        costCenter: false 
      }));
      msjError();
    }else {
      const dataSubmit ={
        "accounting_account": values.accounting_account,
        "cosif": values.cosif,
        "costcenteraccounting": values.costcenteraccounting
      }
      if(props.tipoProceso==='Nuevo'){
        const responseCreate = await service.createItemConfiguracionHomologacion(dataSubmit).then(response => {
          return response;
          });
        if (responseCreate.status===200) {
          toast.success("Configuración registrada correctamente.");
          props.setEdits((count) => count+1);
        } else {
          toast.error("Error al registrar configuración.");
        }
      } else if (props.tipoProceso==='Editar') {
        const mensajeRespuesta =  await service.updateItemConfiguracionHomologacion(dataSubmit,props.info.accountid).then(response => {
          return response;
          }
          );
        if (mensajeRespuesta.status === 200){
          toast.success("Configuración actualizada correctamente.");
          props.setEdits((count) => count+1);
        } else{
          toast.error("Error al actualizar configuración.");
        }
      }
        goToConfiguracionGeneral()
    }
  }

  async function goToConfiguracionGeneral () {
      props.setOpen(false)
  };

  const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpen(false);
      setOpenModalNotificacion(false)
    };


  

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
            <Row>
              <Col s={12} m={6} l={4}>
                <div className="input-field-2">
                  <label className={`${validation.accountNumber? '':'txt-red'}`}>Número de Cuenta</label>
                  <input className={`${validation.accountNumber? 'valid':'invalid'}`} 
                  onChange={handleChange}
                  type="text"
                  pattern="[0-9]*"
                  value = {values.accounting_account}
                  id="accounting_account"
                  />
                </div>
              </Col>
              <Col s={12} m={6} l={4}>
                <div className="input-field-2">
                  <label className={`${validation.cosifNumber? '':'txt-red'}`}>Número de Cuenta Cosif</label>
                  <input className={`${validation.cosifNumber? 'valid':'invalid'}`} 
                  onChange={handleChange}
                  type="text"
                  pattern="[0-9]*"
                  value = {values.cosif}
                  id="cosif"
                  />
                </div>
              </Col>
              <Col s={12} m={6} l={4}>
                <div className="input-field-2">
                  <label className={`${validation.costCenter? '':'txt-red'}`}>Centro de Costos</label>
                  <input className={`${validation.costCenter? 'valid':'invalid'}`} 
                  onChange={handleChange}
                  type="text"
                  pattern="[0-9]*"
                  value = {values.costcenteraccounting}
                  id="costcenteraccounting" />
                </div>
              </Col>
            </Row>
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