import React, {useState,useEffect } from "react";
import { Button,Row, Col, Divider } from 'react-materialize'
import { ServerAPI } from "../../services/server";
import { toast } from 'react-toastify';
import { Box, Modal, Snackbar, Alert, Stack, LinearProgress, Fade } from "@mui/material";

export default function ModalTipoEmision(props) {

  const service = new ServerAPI();

  const [open, setOpen] = useState(false);
  const [mensajeWarning, setMensajeWarning] = useState('');
  const [severity, setSeverity] = useState('info');
  const [openModalNotificacion, setOpenModalNotificacion] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  
  const [validation, setValidation] = useState({
    producttypedescription: true,
    producttypemaestrosunicos: true
  });
  const [values, setValues] = useState({
    producttypedescription: "",
    producttypemaestrosunicos: "",
    user: ""
  });

  useEffect(() => {
    setValues(props.info)
  }, [props]); 


  const handleChange = function (event) {
    var valueEvent = event.target.value;
    if(event.target.validity.valid){
      setValues((prevValues) => ({
        ...prevValues,
        [event.target.id]: valueEvent.toUpperCase()
      }));
      setValidation((prevValues) => ({
        ...prevValues,
        [event.target.id]: valueEvent!==''
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
    if (values.producttypedescription===""){
      setValidation((prevValues)=>({
        ...prevValues,
        producttypedescription: false 
      }));
      msjError();
    }else if(values.producttypemaestrosunicos===""){
      setValidation((prevValues)=>({
        ...prevValues,
        producttypemaestrosunicos: false 
      }));
      msjError();
    }else {
      setisLoading(true)
      const dataSubmit ={
        "producttypedescription": values.producttypedescription,
        "producttypemaestrosunicos": values.producttypemaestrosunicos,
        "user": values.user
      }
      if(props.tipoProceso==='Nuevo'){
        const responseCreate = await service.createTypeProduct(dataSubmit).then(response => {
          return response;
          });
        if (responseCreate.status===200) {
          if(responseCreate.data.message == 'typeproduct-exist'){
            setOpenModalNotificacion(true);
            setMensajeWarning('El tipo de emisión ya se encuentra registrado')
            setSeverity('error')
            setOpen(true)
            setisLoading(false)
          }else{
            toast.success("Configuración registrada correctamente.");
            props.setEdits((count) => count+1);
            goToConfiguracionGeneral()
          }
        } else {
          toast.error("Error al registrar configuración.");
          goToConfiguracionGeneral()
        }
      } else if (props.tipoProceso==='Editar') {
        const responseUpdate = await service.updateTypeProduct(dataSubmit,props.info.id, props.info.producttypedescription).then(response => {
          return response;
          });
        if (responseUpdate.status===200) {
          if(responseUpdate.data.message == 'typeproduct-exist'){
            setOpenModalNotificacion(true);
            setMensajeWarning('El tipo de emisión ya se encuentra registrado')
            setSeverity('error')
            setOpen(true)
            setisLoading(false)
          }else{
            toast.success("Configuración actualizada correctamente.");
            props.setEdits((count) => count+1);
            goToConfiguracionGeneral()
          }
        } else {
          toast.error("Error al actualizar configuración.");
          goToConfiguracionGeneral()
        }
      }
        
    }
  }

  async function goToConfiguracionGeneral () {
      props.setOpen(false)
      setisLoading(false)
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
              <Col s={12} m={6} l={8}>
                <div className="input-field-2">
                  <label className={`${validation.producttypedescription? '':'txt-red'}`}>Tipo emisión</label>
                  <input className={`${validation.producttypedescription? 'valid':'invalid'}`} 
                  onChange={handleChange}
                  type="text"
                  value = {values.producttypedescription}
                  id="producttypedescription"
                  />
                </div>
              </Col>
              <Col s={12} m={6} l={4}>
                <div className="input-field-2">
                  <label className={`${validation.producttypemaestrosunicos? '':'txt-red'}`}>Código tipo emisión</label>
                  <input className={`${validation.producttypemaestrosunicos? 'valid':'invalid'}`} 
                  onChange={handleChange}
                  type="text"
                  pattern="[0-9]*"
                  value = {values.producttypemaestrosunicos}
                  id="producttypemaestrosunicos"
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col s={6} className="loading">
                <Fade in={isLoading}>
                  <LinearProgress color="inherit" />
                </Fade>
              </Col>
            </Row>
            <Stack direction="row" spacing={0.5} >
                <Button node="button" small className="indigo darken-4" 
                  onClick={handleSubmit} disabled={isLoading}>
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