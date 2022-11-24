import React, { useState, useEffect, Fragment,useRef } from "react";
import { Col, Row, CollapsibleItem, Icon, Collapsible, Button } from "react-materialize";
import { CardHeader, InputDate } from "../components";
import Select from 'react-select'
import { convertTZ, setFormatDate, showToast } from "../../helpers/utils";
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
  
  const service = new ServerAPI();

  const { instance } = useMsal();
  const { name } = "user-test"//instance.getActiveAccount().idTokenClaims;

  const fileInputRef = useRef(null);
  function applyFilters(record, filters) {
    let isValid = true
    return isValid
  };
  const handleApplyFilters = async function (event) {
    setFilterHeader(<p><strong><u>Filtros</u></strong></p>);
    setfiltEnable(true);
    setTableData([])
    let resp = await getdbData(setFormatDate(initDate), setFormatDate(finalDate))
    setDbData(resp)
  };

  const handleDeleteFilters = function (event) {
    setFilterHeader(<p>Filtros</p>);
    setInitDate(currDate);
    setFinalDate(currDate);
    setConsecutivo("");
    setfiltEnable(false);
  };
  const onTextChange = function (event) {
    setConsecutivo(event.target.value)
  };
  
  const onChangeTipoProducto = function (event) {
    setTipoProducto(event.value)
    if(event.value=='3'){
      setSelDate(convertTZ(new Date()))
    }else{
      setSelectedFile('');
      setNameFileSelected('Ningún archivo seleccionado.');
      setIsSelected(false);
    }
    
  };

  
  const getdbData = async function (from_date, to_date) {
    let resp = [];
    try {
      resp = await service.getRatesData(from_date, to_date);
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

useEffect(async () => {
    let resp = await getdbData(setFormatDate(initDate), setFormatDate(finalDate))
    setDbData(resp)
  }, [])

  useEffect(() => {
    setTableData(dbData)
  }, [dbData])

  const updateRates = async function (event) {
    event.preventDefault()
    showToast('Estamos generando la solicitud, por favor consulte el resultado del proceso')
    let resp = await service.sendUpdateRate(setFormatDate(selDate),name)
    if (resp && resp.message){
      showToast(resp.message)
    } else {
      showToast("Error en la solicitud.")
    }
  }

  
  const valideFileType = function (fileType, fileName) {
    let validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv"
    ];
    let validExtensions = ["xlsx", "xls", "csv"];
    let nameArray = fileName.split(".")
    
    if (validExtensions.includes(nameArray[nameArray.length -1]) & 
        validTypes.includes(fileType) & !(fileName.startsWith("="))) {
      return true
    } else {
      return false
    }

  };

  
  const changeFileSelected = (event) => {
    event.preventDefault()
    if (valideFileType(event.target.files[0].type, event.target.files[0].name)) {
      setSelectedFile(event.target.files[0]);
      setNameFileSelected(event.target.files[0].name);
      setIsSelected(true);
    } else {
      setSelectedFile("");
      setNameFileSelected("El archivo es inválido. Por favor subir un archivo .xlsx, .xls o .csv");
      setIsSelected(false);
    }

  };

  function renderTable() {
    return table
  }
  useEffect( function () {
    setTable(<ActTable tableData={tableData} setdetails={setdetails}
                setIsPantallaPrincipal={setIsPantallaPrincipal} isCuentaCorriente={tipoProducto=='3'}/>)
  } ,[isPantallaPrincipal, tableData, tipoProducto])

  return isPantallaPrincipal ? (
    <Fragment>
      <CardHeader title={"Actualización Masiva de Tasas"}
        description={"En esta sección podrá realizar el proceso de actualización de tasas de forma masiva."} />
      <Row>
        <Col s={"6"} m={"3"}>
          <label className="active">Tipo Producto</label>
          <Select className="basic-single" defaultValue={{value: 1, label: 'CDT'}}
            options={[{value: 1, label: 'CDT'}, {value: 2, label: 'Bonos'},{value: 3, label: 'Cuenta Corriente'}]}
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
            className="indigo darken-4" onClick={updateRates}>
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
                  <input type="text" className="valid" onChange={onTextChange}
                    id="numConsecutivo" value={consecutivo} pattern="[0-9]*"/>
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
        details={details} setdetails={setdetails} />)
  }

export default ActualizacionTasas;