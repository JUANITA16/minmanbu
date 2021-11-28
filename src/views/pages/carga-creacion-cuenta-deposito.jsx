import React, { useState, useEffect, useRef } from "react";
import { InputDate, CardHeader/*, Loading*/ } from '../components/index'
import { Table } from 'react-materialize'
import { Row, Col, Button, Collapsible, CollapsibleItem, Icon } from 'react-materialize'
import { TablaCuentaService } from "../../services/tabla-cuenta-service";
import { TablaResultadoService } from "../../services/tabla-resultado-service";
import { toast } from 'react-toastify';
import Select from 'react-select'
import ReactPaginate from 'react-paginate';

import { setFormatDate, showToast, convertTZ } from "../../helpers/utils";


//import { setFormatDate, convertTZ } from "../../helpers/utils";
//import "bootstrap/dist/css/bootstrap.min.css";

export const tableService = new TablaCuentaService();
export const tableResultadoService = new TablaResultadoService();



export default function CreacionCuenta() {

  const base = process.env.PUBLIC_URL;

  const title = 'Creacion de cuentas depósito';
  const description = 'En esta sección podrá cargar archivos para creación de cuenta depósito.';
  const [selectedFile, setSelectedFile] = useState();
  const [isSelected, setIsSelected] = useState(false);
  const [nameFileSelected, setNameFileSelected] = useState("Ningún archivo seleccionado.");
  const [exporta, setExporta] = useState();
  const [exportaResultado, setExportaResultado] = useState();
  const [isDisabledButton, setIsDisabledButton] = useState(true);
  const [isPantallaPrincipal, setIsPantallaPrincipal] = useState(true);

  //Principal
  const [tableRender, setTableRender] = useState();
  const [paginationFooter, setPaginationFooter] = useState();
  const [tableHeader, setTableHeader] = useState();
  // const [currentItems, setCurrentItems] = useState(null);
  // const [pageCount, setPageCount] = useState(0);
  // const [itemOffset, setItemOffset] = useState(0);
  const [startDate, setStartDate] = useState(convertTZ(new Date()));
  const [endDate, setEndDate] = useState(convertTZ(new Date()));
  //Principal

  //Resultados
  const [tableResultadoRender, setTableResultadoRender] = useState();
  const [paginationFooterResultado, setPaginationFooterResultado] = useState();
  //resultados

  const fileInputRef = useRef(null);
  var id_prueba = '3';
  var contentTable = []
  var contentTableResultado = []
  var currentItems = [];
  var currentItemsResultado = [];
  var itemOffset = 0;
  var itemOffsetResultado = 0;
  var totalPaginas = 0;
  var paginaActual = 1;
  var totalPaginasResultado = 0, paginaActualResultado = 1;
  var codeRespArchivo = false;



  const TableHeader = (props) => {
    return (
      <thead>
        <tr>
          <th data-field="id" width="40" >N°</th>
          <th data-field="name"> Nombre de archivo </th>
          <th data-field="action" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}> Acción  </th>
        </tr>
      </thead>
    )
  };


  const changePantallaResultado = (event) => {
    setIsPantallaPrincipal(false);

    //recargarTablaResultado();
    contentTableResultado = [
      { id: '1', name: 'carguecuentasdepositocdt_V2 (1).xlsx' },
      { id: '2', name: 'carguecuentasdepositocdt_V2 (2).xlsx' },
      { id: '3', name: 'carguecuentasdepositocdt_V2 (3).xlsx' },
      { id: '4', name: 'carguecuentasdepositocdt_V2 (4).xlsx' },
      { id: '5', name: 'carguecuentasdepositocdt_V2 (4).xlsx' },
      { id: '6', name: 'carguecuentasdepositocdt_V2 (4).xlsx' },
      { id: '7', name: 'carguecuentasdepositocdt_V2 (4).xlsx' },
      { id: '8', name: 'carguecuentasdepositocdt_V2 (4).xlsx' },
      { id: '9', name: 'carguecuentasdepositocdt_V2 (4).xlsx' }
    ];

    const endOffsetResultado = itemOffsetResultado + 7;
    console.log(`Loading items from ${itemOffsetResultado} to ${endOffsetResultado}`);
    // setCurrentItems(contentTable.slice(itemOffset, endOffset));
    currentItemsResultado = contentTableResultado.slice(itemOffsetResultado, endOffsetResultado);
    // setPageCount(Math.ceil(contentTable.length / 7));
    totalPaginasResultado = Math.ceil(contentTableResultado.length / 7);
    console.log('PageConut:' + Math.ceil(contentTableResultado.length / 7));
    console.log('totalPaginas:' + totalPaginasResultado);
    console.log('currentItems:' + currentItemsResultado);
    setTableResultadoRender(<tbody>
      {currentItemsResultado.map((contenido, index) => {
        return <TableBodyResultado id={contenido.id}
          name={contenido.name} />
      })}
    </tbody>);
    setPaginationFooterResultado(
      <TableFooterPaginationResultado />
    );
    setExportaResultado(
      <Row>
        <Col s={12} m={12} className="input-field m0">
          <Button node="button" style={{ float: 'right' }} small className="indigo darken-4">
            Exportar en Excel
        </Button>
        </Col>
      </Row>
    )

  };
  const changePantallaCargar = (event) => {
    setIsPantallaPrincipal(true);

  };

  const TableBody = (props) => {
    return (
      <tr>
        <td>
          {props.id}
        </td>
        <td>
          {props.name}
        </td>
        <td style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Button node="button" onClick={changePantallaResultado} small className="indigo darken-4">
            Ver Resultado
          </Button>
        </td>
      </tr>
    )
  };

  const TableBodyResultado = (props) => {
    return (
      <tr>
        <td >
          {props.id}
        </td>
        <td>
          {props.name}
        </td>
        <td style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          Estado
        </td>
      </tr>
    )
  };

  const TableFooterPagination = (props) => {
    return (
      <div>
        <ReactPaginate
          previousLabel={<Icon>chevron_left</Icon>}
          nextLabel={<Icon>chevron_right</Icon>}
          breakLabel="..."
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={totalPaginas}
          renderOnZeroPageCount={null}
          containerClassName={"pagination"}
        />
      </div>
    )
  };

  const TableFooterPaginationResultado = (props) => {
    return (
      <div>
        <ReactPaginate
          previousLabel={<Icon>chevron_left</Icon>}
          nextLabel={<Icon>chevron_right</Icon>}
          breakLabel="..."
          onPageChange={handlePageClickResultado}
          pageRangeDisplayed={5}
          pageCount={totalPaginasResultado}
          renderOnZeroPageCount={null}
          containerClassName={"pagination"}
        />
      </div>
    )
  };

  async function obtenerDataTable() {
    await tableService.getDataTable(paginaActual)
      .then((response) => {
        if (response) {
          contentTable = response.contentTable;
          // setPageCount(response.totalPaginas);
        }
      });

  }

  async function recargarTablaResultado() {
    await tableService.getDataTable(paginaActual)
      .then((response) => {
        if (response) {
          contentTableResultado = response.contentTable;
          totalPaginasResultado = response.totalPaginas;
        }
      });

  }


  const changeHandler = (event) => {
    if (event) {
      setSelectedFile(event.target.files[0]);
      console.log("Modificado" + event.target.files[0].name)
      setNameFileSelected(event.target.files[0].name);
      // nameFileSelected=  event.target.files[0].name;
      setIsSelected(true);
      setIsDisabledButton(false);
      console.log("nameFile:" + nameFileSelected)
      console.log("selectedFile:" + selectedFile)
    }
  };

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * 7) % contentTable.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    itemOffset = newOffset;
    const endOffset = itemOffset + 7;
    console.log(`Loading items from ${itemOffset} to ${endOffset}`);

    currentItems = contentTable.slice(itemOffset, endOffset);
    setTableRender(<tbody>
      {currentItems.map((contenido, index) => {
        return <TableBody id={contenido.id}
          name={contenido.name} />
      })}
    </tbody>);
  };

  // Invoke when user click to request another page.
  const handlePageClickResultado = (event) => {
    const newOffsetResultado = (event.selected * 7) % contentTableResultado.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffsetResultado}`
    );
    itemOffsetResultado = newOffsetResultado;
    const endOffsetResultado = itemOffsetResultado + 7;
    console.log(`Loading items from ${itemOffsetResultado} to ${endOffsetResultado}`);

    currentItemsResultado = contentTableResultado.slice(itemOffsetResultado, endOffsetResultado);
    setTableResultadoRender(<tbody>
      {currentItemsResultado.map((contenido, index) => {
        return <TableBodyResultado id={contenido.id}
          name={contenido.name} />
      })}
    </tbody>);
  };


  const handleSubmission = () => {
    const formData = new FormData();

    formData.append('File', selectedFile);
    // Details of the uploaded file 
    console.log(selectedFile);
    console.log(formData);
    console.log(isSelected);

    if (isSelected) {
      //Se invoca al servicio S3
      codeRespArchivo = true;

      if (codeRespArchivo == true) {
        //Ok -> aparece mensaje de "Subido correctamente" y se llama al servicio para recargar la tabla
        toast.success("Archivo subido corrrectamente.");
        setNameFileSelected("Ningún archivo seleccionado.");
        setSelectedFile(null);
        setIsSelected(false);
        setIsDisabledButton(true);
        //Recargar tabla

        //obtenerDataTable();
        contentTable = [
          { id: '1', name: 'carguecuentasdepositocdt_V2 (1).xlsx' },
          { id: '2', name: 'carguecuentasdepositocdt_V2 (2).xlsx' },
          { id: '3', name: 'carguecuentasdepositocdt_V2 (3).xlsx' },
          { id: '4', name: 'carguecuentasdepositocdt_V2 (4).xlsx' },
          { id: '5', name: 'carguecuentasdepositocdt_V2 (4).xlsx' },
          { id: '6', name: 'carguecuentasdepositocdt_V2 (4).xlsx' },
          { id: '7', name: 'carguecuentasdepositocdt_V2 (4).xlsx' },
          { id: '8', name: 'carguecuentasdepositocdt_V2 (4).xlsx' },
          { id: '9', name: 'carguecuentasdepositocdt_V2 (4).xlsx' },
          { id: '10', name: 'carguecuentasdepositocdt_V2 (4).xlsx' },
          { id: '11', name: 'carguecuentasdepositocdt_V2 (4).xlsx' },
          { id: '12', name: 'carguecuentasdepositocdt_V2 (4).xlsx' },
          { id: '13', name: 'carguecuentasdepositocdt_V2 (4).xlsx' },
          { id: '14', name: 'carguecuentasdepositocdt_V2 (4).xlsx' },
          { id: '15', name: 'carguecuentasdepositocdt_V2 (4).xlsx' },
          { id: '16', name: 'carguecuentasdepositocdt_V2 (4).xlsx' }
        ];


        const endOffset = itemOffset + 7;
        console.log(`Loading items from ${itemOffset} to ${endOffset}`);
        // setCurrentItems(contentTable.slice(itemOffset, endOffset));
        currentItems = contentTable.slice(itemOffset, endOffset);
        // setPageCount(Math.ceil(contentTable.length / 7));
        totalPaginas = Math.ceil(contentTable.length / 7);
        console.log('PageConut:' + Math.ceil(contentTable.length / 7));
        console.log('totalPaginas:' + totalPaginas);
        console.log('currentItems:' + currentItems);
        setTableHeader(
          <TableHeader />
        );


        setTableRender(<tbody>
          {currentItems.map((contenido, index) => {
            return <TableBody id={contenido.id}
              name={contenido.name} />
          })}
        </tbody>);
        setPaginationFooter(
          <TableFooterPagination />
        );
        setExporta(
          <Row>
            <Col s={12} m={12} className="input-field m0">
              <Button node="button" style={{ float: 'right' }} small className="indigo darken-4">
                Exportar en Excel
            </Button>
            </Col>
          </Row>
        )
      } else {
        toast.error("Error al subir archivo.");
      }
    } else {
      toast.error("No se ha seleccionado ningun archivo.");
    }

  };


  useEffect(() => {
    obtenerDataTable();

    if (totalPaginas != 0) {
      setTableHeader(
        <TableHeader />
      );
      // console.log("totalPaginas: " + pageCount);
      setTableRender(<tbody>
        {contentTable.map((contenido, index) => {
          return <TableBody id={contenido.id}
            name={contenido.name} />
        })}
      </tbody>);
      setPaginationFooter(
        <TableFooterPagination />
      );
      setExporta(null);
    }

    document.title = title
  }, []);


  const options = [
    { value: '1', label: 'CDT' },
    { value: '2', label: 'Cuentas Corrientes' },
    { value: '3', label: 'Bonos' }
  ]

  const renderElement = () => {
    return isPantallaPrincipal ? (
      <React.Fragment>
        <CardHeader title={title} description={description} />
        <Row>
          <Col s={8} m={3}>
            <label className="active">Tipo de Cargue</label>
            <Select className="basic-single" defaultValue={options[0]} options={options} />
          </Col>
        </Row>
        <Row>
          <Col s={12} m={3} >
            <input
              id="file-upload"
              name="file"
              type="file"
              onChange={changeHandler}
              style={{ display: 'none' }}
              ref={fileInputRef}
            />
            <Button node="button" small className="indigo darken-4" onClick={() => fileInputRef.current.click()}>
              Seleccionar archivo
          </Button>
          </Col>

          <Col s={12} m={6}>
            <p>
              {nameFileSelected}
            </p>
          </Col>
          <Col s={12} m={3} className="input-field m0" >
            <Button node="button" disabled={isDisabledButton} style={{ float: 'right' }} onClick={handleSubmission} small className="indigo darken-4">
              Cargar
            </Button>
          </Col>
        </Row>
        <Row>
          <Collapsible accordion={false}>
            <CollapsibleItem
              expanded={false}
              header="Filtros"
              icon={<Icon>filter_list</Icon>}
              node="div"
            >
              <Row>
                <Col s={12} m={3} className="text-left">
                  <InputDate labelName="Fecha inicial" maxValue={endDate} setDate={setStartDate} />
                </Col>
                <Col s={12} m={3} className="text-left">
                  <InputDate labelName="Fecha final" minValue={startDate} setDate={setEndDate} />
                </Col>
                
                <Col s={12} m={3} >
                  <div>
                  <label>Consecutivo del cargue</label>
                  </div>
                  <input type="text" />
                  

                </Col>
                <Col s={12} m={3} className="input-field ">
                  <Button node="button" style={{ float: 'right' }} small className="indigo darken-4">
                    Aplicar filtros
              </Button>
                </Col>
              </Row>
            </CollapsibleItem>
          </Collapsible>
        </Row>

        <Row>
          <Table>
            {tableHeader}
            {tableRender}
          </Table>
          {paginationFooter}
        </Row>
        {exporta}

      </React.Fragment>
    ) : (
        <React.Fragment>
          <Row>
            <Button node="button" small className="indigo darken-4" onClick={changePantallaCargar}>
              Retroceder
        </Button>
          </Row>
          <Row>
            <Table>
              <thead>
                <tr>
                  <th data-field="id">N°</th>
                  <th data-field="registro"> Registro </th>
                  <th data-field="estado" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}> Estado  </th>
                </tr>
              </thead>
              {tableResultadoRender}
            </Table>
            {paginationFooterResultado}
          </Row>
          {exportaResultado}
        </React.Fragment>
      );
  }

  return renderElement()
}