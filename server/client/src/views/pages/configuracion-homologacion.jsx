import { TextField } from "@mui/material";
import { Fragment, useEffect, useState } from "react"
import { Button, Col, Collapsible, CollapsibleItem, Icon, Row, TextInput } from "react-materialize";
import ServerAPI from "../../services/server";
import { CardHeader } from "../components";
import MyTable from "../components/HoTable";
import ConfiguracionContable from "./configuracion-contable";

const HomoloView = function ({goBack, dbData}) {
  const [filterHeader, setFilterHeader] = useState(<p>Filtros</p>);
  const [filters, setFilters] = useState({numeroCuenta: "", numeroCosif: ""});
  const [tableData, setTableData] = useState(dbData);
  const [table, setTable] = useState(<></>);
  const [filtenable, setfiltEnable] = useState(false)

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
    setTableData(
      tableData.filter((value) => applyFilters(value, filters))
    );
    setfiltEnable(true);
  };

  const handleDeleteFilters = function (event) {
    setFilterHeader(<p>Filtros</p>);
    setFilters({numeroCuenta: "", numeroCosif: ""});
    setTableData(dbData);
    setfiltEnable(false);
  };


  const createNew = function (event) {
    console.log("Crear nuevo registro");
    console.log(tableData)
  };
  const onTextChange = function (event) {
    setFilters((prevData)=>(
      {
        ...prevData,
        [event.target.id]: event.target.value
      }
    ));
  };

  useEffect(function () {
    setTableData(dbData)
  }, [dbData])

  useEffect(function () {
    setTable(<MyTable tableData={tableData} />)
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
              <Col s={12} m={6} l={4} xl={3}>
                <div className="input-field">
                  <input type="text" className="valid" onChange={onTextChange}
                    id="numeroCuenta" value={filters.numeroCuenta}/>
                  <label htmlFor="numeroCuenta">N° de Cuenta</label>
                </div>
              </Col>
              <Col s={12} m={6} l={4} xl={3}  >
                <div className="input-field">
                  <input type="text" className="valid" onChange={onTextChange}
                    id="numeroCosif" value={filters.numeroCosif}/>
                  <label htmlFor="numeroCosif" >N° de Cuenta cosif</label>
                </div>
              </Col>
              <Col s={12} m={6} l={4} xl={3} 
                 style={{ float: 'right', marginTop: 30}} >
                <Button node="button" small className="indigo darken-4" 
                  onClick={handleApplyFilters} disabled={filtenable} >
                  Aplicar filtros
                </Button>
              </Col>
              <Col s={12} m={6} l={4} xl={3}
                style={{ float: 'right', marginTop: 30, }} >
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
  )
};



function ConfiguracionHomologacion (params) {
  
  const [dbData, setdbData] = useState([]);
  const [view, setView] = useState(<></>);

  
  const getdbData = async function () {
    let resp = [];
    const service = new ServerAPI();
    try {
      resp = await service.getAllCosif().then((resp) => {return resp});
      if (resp.status === 200) {
        setdbData(resp.data);
      }
    } catch (error) {
      console.error(error);
      
      return resp;
    }
  }

  const goBack = function (event) {
    setView(<ConfiguracionContable />);
  };
  


  useEffect(() => {
    const resp = getdbData();
    console.log(resp)
    if (resp.status === 200) {
      setdbData(resp.data);
    }
    
  }, []);

  useEffect(() => {
    console.log(dbData)
    setView(<HomoloView  goBack={goBack} dbData={dbData}/>);
    console.log("loading table")
  }, [dbData])

  return view

}

export default ConfiguracionHomologacion