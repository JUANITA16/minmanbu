import { Box, Modal } from "@mui/material";
import { Fragment, useEffect, useState } from "react"
import { Button, Col, Collapsible, CollapsibleItem, Icon, Row } from "react-materialize";
import { ServerAPI } from "../../services/server";
import { CardHeader } from "../components";
import MyTable from "../components/EmisionTable";
import ConfiguracionContable from "./configuracion-contable";
import ModalTipoEmision from "./ModalTipoEmision";
import ReactExport from 'react-export-excel';
import { useMsal } from "@azure/msal-react";

const TipoEmisionView = function ({goBack, dbData, edits, setEdits,getdbData}) {
  
  const { instance } = useMsal();
  const { name } = instance.getActiveAccount().idTokenClaims;
  const ExcelFile = ReactExport.ExcelFile;
  const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
  const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

  const [filterHeader, setFilterHeader] = useState(<p>Filtros</p>);
  const [filters, setFilters] = useState({tipoEmision: "", codigoTipoEmision: ""});
  const [tableData, setTableData] = useState(dbData);
  const [table, setTable] = useState(<></>);
  const [open, setOpen] = useState(false);
  const [filtenable, setfiltEnable] = useState(false)
  const modalTitle = "Nuevo - Configuración tipo emisión"
  const modalDescription = "En esta sección podrá realizar la creación de los tipos de emisión asociados a los productos administrados por el banco"
  const tipoProceso = "Nuevo"

  function applyFilters(record, filters) {
    let isValid = true
    if (filters.tipoEmision) {
      isValid = (record.producttypedescription === filters.tipoEmision)
    };
    if (filters.codigoTipoEmision && isValid) {
      isValid = (record.producttypemaestrosunicos === filters.codigoTipoEmision)
    };

    return isValid
  };

  const handleApplyFilters = function (event) {
    setFilterHeader(<p><strong><u>Filtros</u></strong></p>);
    setfiltEnable(true);
    getdbData(filters.codigoTipoEmision,filters.tipoEmision)
  };

  const handleDeleteFilters = function (event) {
    setFilterHeader(<p>Filtros</p>);
    setFilters({tipoEmision: "", codigoTipoEmision: ""});
    setfiltEnable(false);
    getdbData("","")
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
    setTable(<MyTable tableData={tableData} setEdits={setEdits} userName={name}/>)
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
      <CardHeader title={"Configuración Tipo Emisión"} 
        description={"En esta sección podrá realizar la configuración de los tipos de emisión asociados a los productos administrados por el banco"}/>
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
                    id="tipoEmision" value={filters.tipoEmision} pattern="[a-zA-Z0-9\s]*"/>
                  <label htmlFor="tipoEmision">Tipo emisión</label>
                </div>
              </Col>  
              <Col s={12} m={6} l={6} xl={6}  >
                <div className="input-field">
                  <input type="text" className="valid" onChange={onTextChange}
                    id="codigoTipoEmision" value={filters.codigoTipoEmision} pattern="[0-9]*"/>
                  <label htmlFor="codigoTipoEmision" >Código tipo emisión</label>
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
          <ModalTipoEmision
            title={modalTitle} 
            description={modalDescription} 
            setEdits={setEdits}
            setOpen={setOpen} 
            info={{
              id: "",
              producttypedescription: "", 
              producttypemaestrosunicos: "",
              user: name
            }}
            tipoProceso={tipoProceso}
            />
        </Box>
      </Modal>
      {renderTable()}
      <Row>
        <Col s={12} m={12} className="input-field m0">
          <ExcelFile
            element={<Button node="button" style={{ float: 'right' }} small className="indigo darken-4">Exportar en Excel</Button>}
            filename="TipoEmisión">
            <ExcelSheet data={tableData} name="Resultados">
              <ExcelColumn label="Id" value="id" />
              <ExcelColumn label="Tipo producto" value="producttypedescription" />
              <ExcelColumn label="Código tipo producto" value="producttypemaestrosunicos" />
              <ExcelColumn label="Fecha creacion" value="creationdate" />
              <ExcelColumn label="Fecha actualizacion" value="updatedate" />
              <ExcelColumn label="Usuario" value="user" />
            </ExcelSheet>
          </ExcelFile>
        </Col>
      </Row>
    </Fragment>
  )
};



function ConfiguracionTipoEmision (params) {
  
  const [dbData, setdbData] = useState([]);
  const [view, setView] = useState(<></>);
  const [edits, setEdits] = useState(0);
  const service = new ServerAPI();

  const getdbData = async function (producttypemaestrosunicos, producttypedescription) {
      const resp = await service.getAllAndFiltersTypeProduct(producttypemaestrosunicos,producttypedescription);
      setdbData(resp);
  }

  const goBack = function (event) {
    setView(<ConfiguracionContable />);
  };
  


  useEffect(() => {
    getdbData("","");
  }, [edits]);

  useEffect(() => {
    setView(<TipoEmisionView  goBack={goBack} dbData={dbData} edits={edits} setEdits={setEdits} getdbData={getdbData}/> );
  }, [dbData])

  return view

}

export default ConfiguracionTipoEmision