import { Fragment, useEffect, useState } from "react"
import { Button, Col, Collapsible, CollapsibleItem, Icon, Row, TextInput } from "react-materialize";
import ServerAPI from "../../services/server";
import { CardHeader } from "../components";
import MyTable from "../components/HoTable";
import ConfiguracionContable from "./configuracion-contable";

const HomoloView = function ({goBack, dbData}) {
  
  const [filterHeader, setFilterHeader] = useState(<p>Filtros</p>);
  const [filters, setFilters] = useState({numeroCuenta: "", numeroCosif: ""});
  const [tableData, setTableData] = useState(rawData);
  const [table, setTable] = useState(<></>);
  let rawData = dbData ? dbData : [];
  
  function applyFilters(record, filters) {
    let isValid = true
    if (filters.numeroCuenta) {
      isValid = (record.accounting_account === filters.numeroCuenta)
    };
    if (filters.numeroCosif) {
      isValid = (record.cosif === filters.numeroCosif)
    };

    return isValid
  };

  const handleApplyFilters = function (event) {
    setFilterHeader(<p><strong><u>Filtros</u></strong></p>);
    setTableData(
      tableData.filter((value) => applyFilters(value, filters))
    );
  };

  const handleDeleteFilters = function (event) {
    setFilterHeader(<p>Filtros</p>);
    setFilters({numeroCuenta: "", numeroCosif: ""});
    setTableData(rawData)
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
    setTable(<MyTable tableData={tableData} />)
  }, [tableData])

  function renderTable() {
    return table
  }

  return (
  <Fragment>
      <Row>
        <Col s={2} m={2}>
          <Button node="button" small className="indigo darken-4" onClick={goBack}>
            Retroceder
          </Button>
        </Col>
        <Col s={2} m={2}>
          <Button node="button" small className="indigo darken-4" onClick={createNew} >
            Nuevo
          </Button>
        </Col>
      </Row>
      <CardHeader title={"Configuración Homologaciones"} 
        description={"En esta sección podrá realizar la configuración general asociada a los moviminetos de CDTs desde Dominus"}/>
      <Row>
        <Collapsible accordion={false}>
          <CollapsibleItem
          expanded={false}
          header={filterHeader}
          icon={<Icon>filter_list</Icon>}
          node="div"
          >
            <Row>
              <Col s={12} m={3} >
                <TextInput id="numeroCuenta" label="Número de Cuenta" 
                  onChange={onTextChange} value={filters.numeroCuenta} />
              </Col>
              <Col s={12} m={3}>
                <TextInput id="numeroCosif" label="Número de Cuenta cosif" 
                  onChange={onTextChange} value={filters.numeroCosif}/>
              </Col>
              <Col s={12} m={2} className="input-field" style={{ float: 'right' }} >
                <Button node="button" small className="indigo darken-4" onClick={handleApplyFilters} >
                  Aplicar filtros
                </Button>
              </Col>
              <Col s={12} m={2} className="input-field" style={{ float: 'right' }} >
                <Button node="button"  small className="indigo darken-4" onClick={handleDeleteFilters}>
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

const getRawData = function () {
  let resp = [];
  const service = new ServerAPI();
  try {
    resp = service.getAllCosif().then((resp) => {return resp});
    console.log(resp)
  } catch (error) {
    console.error(error);
    console.log(resp)
    return resp;
  }
}

function ConfiguracionHomologacion (params) {
  
  const dbData = getRawData()
  const [view, setView] = useState(<></>);

  const goBack = function (event) {
    setView(<ConfiguracionContable />);
  };
  


  useEffect(() => {
    setView(<HomoloView  goBack={goBack} dbData={dbData}/>)
    console.log("loading table")
  }, []);

  return view

}

export default ConfiguracionHomologacion