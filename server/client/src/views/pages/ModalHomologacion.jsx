import React, {useState,useEffect } from "react";
import { Button,Row, Col, Divider } from 'react-materialize'
import { ServerAPI } from "../../services/server";
import { toast } from 'react-toastify';
import { Box, Modal, Snackbar, Alert, Stack, LinearProgress, Fade } from "@mui/material";
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

export default function ModalConfiguracionHomologacion(props) {

  const service = new ServerAPI();

  const [open, setOpen] = useState(false);
  const [mensajeWarning, setMensajeWarning] = useState('');
  const [severity, setSeverity] = useState('info');
  const [openModalNotificacion, setOpenModalNotificacion] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  const [validation, setValidation] = useState({
    accountNumber: true,
    cosifNumber: true,
    costCenter: true,
    productType: true
  });
  const [values, setValues] = useState({
    accounting_account: "",
    cosif: "",
    costcenteraccounting: "",
    producttype: ""
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

  const handleChangeProductType = function (event) {
    const { name, value } = event.target;

    setValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
    setValidation((prevValues) => ({
      ...prevValues,
      [name]: value !== ""
    }))
  }

  function msjError(){
    setOpenModalNotificacion(true);
    setMensajeWarning('Todos los campos son de diligenciamiento obligatorio.')
    setSeverity('error')
    setOpen(true)
  }

  const HTTP_OK = 200;
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
    }else if(values.producttype===""){
      setValidation((prevValues)=>({
        ...prevValues,
        productType: false
      }));
      msjError();
    }else {
      setisLoading(true)
      const dataSubmit ={
        "accounting_account": values.accounting_account,
        "cosif": values.cosif,
        "costcenteraccounting": values.costcenteraccounting,
        "producttype": values.producttype
      }
      if(props.tipoProceso==='Nuevo'){
        const responseCreate = await service.createItemConfiguracionHomologacion(dataSubmit);
        if (responseCreate.status=== HTTP_OK) {
          toast.success("Configuración registrada correctamente.");
          props.setEdits((count) => count+1);
        } else {
          toast.error("Error al registrar configuración.");
        }
      } else if (props.tipoProceso==='Editar') {
        const mensajeRespuesta =  await service.updateItemConfiguracionHomologacion(dataSubmit,props.info.accountid);
        if (mensajeRespuesta.status === HTTP_OK){
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
    setisLoading(false)
  };

  const handleClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    setOpenModalNotificacion(false);
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
        <Col s={12} m={6} l={3}>
          <div className="input-field-2">
            <label className={validation.accountNumber? '':'txt-red'}>Número de Cuenta</label>
            <input className={validation.accountNumber? 'valid':'invalid'}
              onChange={handleChange}
              type="text"
              pattern="[0-9]*"
              value = {values.accounting_account}
              id="accounting_account"
            />
          </div>
        </Col>
        <Col s={12} m={6} l={3}>
          <div className="input-field-2">
            <label className={validation.cosifNumber? '':'txt-red'}>Número de Cuenta Cosif</label>
            <input className={validation.cosifNumber? 'valid':'invalid'}
              onChange={handleChange}
              type="text"
              pattern="[0-9]*"
              value = {values.cosif}
              id="cosif"
            />
          </div>
        </Col>
        <Col s={12} m={6} l={3}>
          <div className="input-field-2">
            <label className={validation.costCenter? '':'txt-red'}>Centro de Costos</label>
            <input className={validation.costCenter? 'valid':'invalid'}
              onChange={handleChange}
              type="text"
              pattern="[0-9]*"
              value = {values.costcenteraccounting}
              id="costcenteraccounting" />
          </div>
        </Col>
        <Col s={12} m={6} l={3}>
          <label className={`validation.productType? '':'txt-red'}`}>Tipo de producto</label>
          <FormControl variant="standard" sx={{ marginTop: 2}} fullWidth required>
            <Select
              name="producttype"
              className={`validation.productType? '':'txt-red'}`}
              value={values.producttype}
              onChange={handleChangeProductType}
              disabled={props.tipoProceso==='Editar'}
              sx={{fontSize: 16, border: 'red 5px none'}}
            >
              <MenuItem key='0' value='CDT'>
                CDT
              </MenuItem>
              <MenuItem key='1' value='BONO'>
                BONO
              </MenuItem>
            </Select>
          </FormControl>
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