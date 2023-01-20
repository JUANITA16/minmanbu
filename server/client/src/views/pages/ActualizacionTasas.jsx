import React, { useState, useEffect, Fragment,useRef } from "react";
import { Col, Row, CollapsibleItem, Icon, Collapsible, Button } from "react-materialize";
import { CardHeader, InputDate } from "../components";
import Select from 'react-select'
import { convertTZ, setFormatDate, showToast,toBase64 } from "../../helpers/utils";
import ActTable from "../components/ActualizacionTable";
import ActualizacionTasasDetalle from './ActualizacionTasasDetalle'

import { ServerAPI } from "../../services/server";
import { useMsal } from "@azure/msal-react";

function ActualizacionTasas() {
  const currDate = convertTZ(new Date());
  let minDate = new Date();
  minDate.setDate(minDate.getDate()-6);
  const [filterHeader, setFilterHeader] = useState(<p>Filtros</p>);
  const [selDate, setSelDate] = useState(convertTZ(new Date()));
  const [initDate, setInitDate] = useState(currDate);
  const [finalDate, setFinalDate] = useState(currDate);
  const [consecutivo, setConsecutivo] = useState("");
  const [filtenable, setfiltEnable] = useState(false);
  const [table, setTable] = useState(<></>);
  const [tableData, setTableData] = useState([]);
  const [dbData, setDbData] = useState([]);
  const [details, setdetails] = useState([])
  const [isPantallaPrincipal, setIsPantallaPrincipal] = useState(true);
  const [tipoProducto, setTipoProducto] = useState("1");
  const [nameFileSelected, setNameFileSelected] = useState("Ningún archivo seleccionado.");
  const [selectedFile, setSelectedFile] = useState();
  const [isSelected, setIsSelected] = useState(false);
  const [isDisabledEjecutar, setIsDisabledEjecutar] = useState(false);
  const [defaultValueProd, setDefaultValueProd] = useState({value: 1, label: 'CDT'})
  const service = new ServerAPI();

  const { instance } = useMsal();
  const { name } = instance.getActiveAccount().idTokenClaims;
  const optionsProducts = [{value: 1, label: 'CDT'}, {value: 2, label: 'Bonos'},{value: 3, label: 'Cuenta Corriente'}]
  const fileInputRef = useRef(null);

  const handleApplyFilters = async function (event) {
    setFilterHeader(<p><strong><u>Filtros</u></strong></p>);
    setfiltEnable(true);
    setTableData([])
    getDataByProduct(tipoProducto,initDate, finalDate,consecutivo)
  };

  const handleDeleteFilters = async function (event) {
    setFilterHeader(<p>Filtros</p>);
    setInitDate(currDate);
    setFinalDate(currDate);
    setConsecutivo("");
    setfiltEnable(false);
    getDataByProduct(tipoProducto,currDate,currDate,consecutivo)
  };
  const onTextChange = function (event) {
    setConsecutivo(event.target.value)
    console.log(consecutivo)
  };
  
  const onChangeTipoProducto = async function (event) {
    setTipoProducto(event.value)
    if(event.value=='3'){
      setIsDisabledEjecutar(true)
      setSelDate(convertTZ(new Date()))
    }else{
      setIsDisabledEjecutar(false)
      setSelectedFile('');
      setNameFileSelected("Ningún archivo seleccionado.");
      setIsSelected(false);
    }
    getDataByProduct(event.value,initDate, finalDate,consecutivo)

  };

  
  const getdbData = async function (from_date, to_date, consecutive) {
    let resp = [];
    try {
      resp = await service.getRatesData(from_date, to_date, consecutive);
      if (resp.length===0) {
        return ["Empty"]
      } else {
        return resp
      }
    } catch (error) {
      alert("Error Cargando tabla")
      return resp;
    }
  }

  
  const getdbDataRatesUpdate = async function(process_date,file_id,from_date, to_date) {
    let respData = [];
    try {
      const responseRatesUpdate =  await service.getRatesUpdate(process_date,file_id,from_date, to_date);
      respData = await responseRatesUpdate.data;
      if (responseRatesUpdate.status === 200 && respData.length>0){
        return respData
      }else{
        return ["Empty"]
      }
      
    } catch (error) {
      alert("Error Cargando tabla")
      return respData;
    }
  }

const getDataByProduct = async function (productType,initialDate,finalDateIn,consecutivo) {
  setDbData(["Reload"])
  if (productType==3){
    let resp = await getdbDataRatesUpdate("","",setFormatDate(initialDate), setFormatDate(finalDateIn))
    setDbData(resp)
  }else{
    let resp = await getdbData(setFormatDate(initialDate), setFormatDate(finalDateIn), consecutivo="")
    setDbData(resp)
    console.log(resp)
  }
}

useEffect(async () => {
  getDataByProduct(tipoProducto,initDate, finalDate, consecutivo)
  }, [])

  useEffect(() => {
    setTableData(dbData)
  }, [dbData])

  const updateRates = async function (event) {
    event.preventDefault()
    if(tipoProducto=='3'){
      setIsDisabledEjecutar(true)
      if (isSelected) {
        showToast('Cargando archivo...')
        const base64File = await toBase64(selectedFile).catch(e => Error(e));
        if (base64File instanceof Error) {
          showToast("Error al subir archivo.");
        }else{
          const dataUpdateCC={
            "file_content":base64File,
            "user_upload":name
          }
          let resp = await service.uploadFileUpdateRate(dataUpdateCC)
          if(resp.status === 200){
            showToast(resp.data.message)
          }else{
            showToast("Ocurrió un error al cargar archivo")
          }
        }
      }
      setNameFileSelected("Ningún archivo seleccionado.")
      setSelectedFile("");
      setIsSelected(false);
    }else{
      showToast('Estamos generando la solicitud, por favor consulte el resultado del proceso')
      let resp = await service.sendUpdateRate(setFormatDate(selDate),name)
      if (resp && resp.message){
        showToast(resp.message)
      } else {
        showToast("Error en la solicitud.")
      }
    }
  }

  
  const valideFileType = function (fileType, fileName) {
    let validTypes ="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    let expresionRegularExcel = /^[-\w\s]+\.xlsx$/
    if (validTypes!=fileType){
      return 1;
    }else if ( !fileName.match(expresionRegularExcel)){
     return 2; 
    }else{
      return 0;
    }
  };

  
  const changeFileSelected = (event) => {
    event.preventDefault()
    if(!nameFileSelected){
      setIsDisabledEjecutar(true)
    }
    if(event.target.files[0]){
      let codeValidate = valideFileType(event.target.files[0].type, event.target.files[0].name)
      if (codeValidate==0) {
        setIsDisabledEjecutar(false)
        setSelectedFile(event.target.files[0]);
        setNameFileSelected(event.target.files[0].name);
        setIsSelected(true);
      } else {
        setSelectedFile("");
        setIsSelected(false);
        if (codeValidate==1){
          setNameFileSelected("Tipo de archivo no válido. Por favor subir un archivo .xlsx");
        }else{
          setNameFileSelected("Nombre de archivo no válido. Por favor subir uno correcto");
        }
      }
    }
  };

  function renderTable() {
    return table
  }
  useEffect( 
    function () {
    setDefaultValueProd(optionsProducts[tipoProducto-1])
    setTable(<ActTable tableData={tableData} setdetails={setdetails}
                setIsPantallaPrincipal={setIsPantallaPrincipal} isCuentaCorriente={tipoProducto=='3'} getdbDataRatesUpdate={getdbDataRatesUpdate}/>)
  } ,[isPantallaPrincipal, tableData, tipoProducto])

  return isPantallaPrincipal ? (
    <Fragment>
      <CardHeader title={"Actualización Masiva de Tasas"}
        description={"En esta sección podrá realizar el proceso de actualización de tasas de forma masiva."} />
      <Row>
        <Col s={"6"} m={"3"}>
          <label className="active">Tipo Producto</label>
          <Select className="basic-single" defaultValue={defaultValueProd}
            options={optionsProducts}
            onChange={onChangeTipoProducto}/>
        </Col>
        <Col s={"6"} m={"9"}>
          <InputDate labelName="Fecha" maxValue={currDate} 
            minValue={minDate} setDate={setSelDate} dateInput={selDate} isDisabled ={tipoProducto=='3'} />
        </Col>
      </Row>
      <Row>
        {tipoProducto=='3'?
          <div>
            <Col s={12} m={3} >
              <input
                id="file-upload"
                name="file"
                type="file"
                onChange={changeFileSelected}
                style={{ display: 'none' }}
                ref={fileInputRef}
              />
              <Button node="button"  className="indigo darken-4" onClick={() => fileInputRef.current.click()}>
                Seleccionar archivo
              </Button>
            </Col>

            <Col s={12} m={9}>
              <p>
                {nameFileSelected}
              </p>
            </Col>
          </div>
          :null
        }
        <Col s={12} m={12}>
          <Button node="button" style={{ float: 'right' }} 
            className="indigo darken-4" onClick={updateRates}  disabled={isDisabledEjecutar}>
            Ejecutar
          </Button>
        </Col>
      </Row>
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
                <InputDate labelName="Fecha Inicial" maxValue={finalDate} 
                   setDate={setInitDate} dateInput={initDate}  />
              </Col>
              <Col s={12} m={6} l={6} xl={6}  >
                <InputDate labelName="Fecha Final" maxValue={currDate}
                 minValue={initDate} setDate={setFinalDate} dateInput={finalDate}  />
              </Col>
              <Col s={12} m={6} l={6} xl={6}  >
                <div className="input-field">
                  <input type="text" onChange={onTextChange}
                    id="numConsecutivo" value={consecutivo}/>
                  <label htmlFor="numConsecutivo" >Consecutivo de Ejecución</label>
                </div>
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
      {renderTable()}
    </Fragment>
  ): (<ActualizacionTasasDetalle setIsPantallaPrincipal={setIsPantallaPrincipal}
        details={details} setdetails={setdetails}  isCuentaCorriente={tipoProducto=='3'}/>)
  }

export default ActualizacionTasas;