import { Fragment, useEffect, useState } from "react"
import { Button, Col, Collapsible, CollapsibleItem, Icon, Row, Select, TextInput } from "react-materialize";
import { CardHeader } from "../components";
import MyTable from "../components/HoTable";
import ConfiguracionContable from "./configuracion-contable";
import testData from "./testData.json"

function ConfiguracionHomologacion (params) {
  
  const [isConfig, setIsConfig] = useState(true);
  const [view, setView] = useState(<></>);
  let rawData = testData.Items;
  const [tableData, setTableData] = useState(rawData);
  const [filters, setFilters] = useState({numeroCuenta: "", numeroCosif: ""});

  const goBack = function (event) {
    setView(<ConfiguracionContable />);
  };

  const createNew = function (event) {
    console.log("Crear nuevo registro")
    console.log(rawData)
  };
  
  
  useEffect(() => {

    setView(
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
            header="Filtros"
            icon={<Icon>filter_list</Icon>}
            node="div"
            >
              <Row>
                <Col s={12} m={3}>
                  <TextInput id="txt-numero-cuenta" label="Número de Cuenta" />
                  
                </Col>
                <Col s={12} m={3} pull={"m1"} >
                  <TextInput id="txt-numero-cosif" label="Número de Cuenta cosif" />
                </Col>
                <Col s={12} m={3} className="input-field " style={{ float: 'right' }} >
                  <Button node="button" small className="indigo darken-4" >
                    Aplicar filtros
                  </Button>
                </Col>
                <Col s={12} m={3} className="input-field " style={{ float: 'right' }} >
                  <Button node="button"  small className="indigo darken-4" >
                    Borrar filtros
                  </Button>
                </Col>
              </Row>
          </CollapsibleItem>
          </Collapsible>
        </Row>
        <MyTable tableData={tableData} />
      </Fragment>
      )
      console.log("loading table")
  }, [tableData]);
  


  return view

}

export default ConfiguracionHomologacion