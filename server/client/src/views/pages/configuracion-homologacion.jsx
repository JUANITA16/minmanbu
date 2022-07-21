import { Box, Modal } from "@mui/material";
import { Fragment, useEffect, useState } from "react"
import { Button, Col, Collapsible, CollapsibleItem, Icon, Row } from "react-materialize";
import { ServerAPI } from "../../services/server";
import { CardHeader } from "../components";
import MyTable from "../components/HoTable";
import ConfiguracionContable from "./configuracion-contable";
import ModalConfiguracionHomologacion from "./ModalHomologacion";

const HomoloView = function ({goBack, dbData, edits, setEdits}) {
  const [filterHeader, setFilterHeader] = useState(<p>Filtros</p>);
  const [filters, setFilters] = useState({numeroCuenta: "", numeroCosif: ""});
  const [tableData, setTableData] = useState(dbData);
  const [table, setTable] = useState(<></>);
  const [open, setOpen] = useState(false);
  const [filtenable, setfiltEnable] = useState(false)
  const modalTitle = "Nuevo - Configuración homologación"
  const modalDescription = "En esta sección podrá realizar la creación de un nuevo registro Configuración homologación"
  const tipoProceso = "Nuevo"

  function applyFilters(record, filters) {
    let isValid = true
    if (filters.numeroCuenta) {
      isValid = (record.accounting_account === filters.numeroCuenta)
    };
    if (filters.numeroCosif && isValid) {
      isValid = (record.cosif === filters.numeroCosif)
    };

    return isValid
  };

  const handleApplyFilters = function (event) {
    setFilterHeader(<p><strong><u>Filtros</u></strong></p>);
    let filteredData = tableData.filter((value) => applyFilters(value, filters))
    if (filteredData.length===0) {
      setTableData(["Empty"])
    } else {
      setTableData(tableData.filter((value) => applyFilters(value, filters)));
    }
    setfiltEnable(true);
  };

  const handleDeleteFilters = function (event) {
    setFilterHeader(<p>Filtros</p>);
    setFilters({numeroCuenta: "", numeroCosif: ""});
    setTableData(dbData);
    setfiltEnable(false);
  };


  const createNew = function (event) {
    setOpen(true)
  };

  const onTextChange = function (event) {
    if (event.target.validity.valid) {
      setFilters((prevData)=>(
        {
          ...prevData,
          [event.target.id]: event.target.value
        }
      ));
    }
  };

  useEffect(function () {
    setTableData(dbData)
  }, [dbData])

  useEffect(function () {
    setTable(<MyTable tableData={tableData} setEdits={setEdits}/>)
  }, [tableData])

  function renderTable() {
    return table
  }

  return (
  <Fragment>
      <Row>
        <Col s={12} m={2} >
          <Button node="button" small className="indigo darken-4" onClick={goBack} >
            Retroceder
          </Button>
        </Col>
        <Col s={12} m={2} >
          <Button node="button" small className="indigo darken-4" onClick={createNew} >
            Nuevo
          </Button>
        </Col>
      </Row>
      <CardHeader title={"Configuración Homologaciones"} 
        description={"En esta sección podrá realizar la configuración de Homologaciones asociada a los movimientos de CDTs desde Dominus"}/>
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
                <div className="input-field">
                  <input type="text" className="valid" onChange={onTextChange}
                    id="numeroCuenta" value={filters.numeroCuenta} pattern="[0-9]*"/>
                  <label htmlFor="numeroCuenta">Número de Cuenta</label>
                </div>
              </Col>
              <Col s={12} m={6} l={6} xl={6}  >
                <div className="input-field">
                  <input type="text" className="valid" onChange={onTextChange}
                    id="numeroCosif" value={filters.numeroCosif} pattern="[0-9]*"/>
                  <label htmlFor="numeroCosif" >Número de Cuenta cosif</label>
                </div>
              </Col>
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
      <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      >
        <Box className="modal-style" >
          <ModalConfiguracionHomologacion
            title={modalTitle} 
            description={modalDescription} 
            setEdits={setEdits}
            setOpen={setOpen} 
            info={{
              accounting_account: "", 
              cosif: "", 
              costcenteraccounting: ""
            }}
            tipoProceso={tipoProceso}
            />
        </Box>
      </Modal>
      {renderTable()}
    </Fragment>
  )
};



function ConfiguracionHomologacion (params) {
  
  const [dbData, setdbData] = useState([]);
  const [view, setView] = useState(<></>);
  const [edits, setEdits] = useState(0);
  const service = new ServerAPI();

  const getdbData = async function () {
    let resp = [];
    try {
      resp = await service.getAllCosif().then((resp) => {return resp});
      if (resp.status === 200) {
        setdbData(resp.data);
      }
      return resp
    } catch (error) {
      console.error(error);
      
      return resp;
    }
  }

  const goBack = function (event) {
    setView(<ConfiguracionContable />);
  };
  


  useEffect(() => {
    getdbData();
  }, [edits]);

  useEffect(() => {
    setView(<HomoloView  goBack={goBack} dbData={dbData} edits={edits} setEdits={setEdits}/> );
  }, [dbData])

  return view

}

export default ConfiguracionHomologacion