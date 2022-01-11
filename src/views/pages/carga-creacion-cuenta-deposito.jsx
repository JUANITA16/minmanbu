import React, { useState, useEffect, useRef } from "react";
import { InputDate, CardHeader,Loading } from '../components/index'
import { Table } from 'react-materialize'
import { Row, Col, Button, Collapsible, CollapsibleItem, Icon } from 'react-materialize'
import { TablaCuentaService } from "../../services/tabla-cuenta-service";
import { MasivoService } from "../../services/masivo-service";
import { toast } from 'react-toastify';
import Select from 'react-select'
import ReactPaginate from 'react-paginate';

import { convertTZ } from "../../helpers/utils";

import ExportExcel from 'react-export-excel'


export const tableService = new TablaCuentaService();
export const masivoService = new MasivoService();

const ExcelFile = ExportExcel.ExcelFile;
const ExcelSheet = ExportExcel.ExcelSheet;
const ExcelColumn = ExportExcel.ExcelColumn;



export default function CreacionCuenta() {

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
  const [startDate, setStartDate] = useState(convertTZ(new Date()));
  const [endDate, setEndDate] = useState(convertTZ(new Date()));
  const [consecutivoCargue, setConsecutivoCargue] = useState('');
  // const [tipoConsulta, setTipoConsulta] = useState('');
  const [product, setProduct] = useState('CDT');
  const [idRegistro, setIdRegistro] = useState('');
  const [cantPaginasSelect, setCantPaginasSelect] = useState('10');

  const [paginaActual, setPaginaActual] = useState(1);

  const [loaderText] = useState('');
  const [aditional, setAditional] = useState('');
  //Principal

  //Resultados
  const [tableHeaderResultado, setTableHeaderResultado] = useState();
  const [tableResultadoRender, setTableResultadoRender] = useState();
  const [paginationFooterResultado, setPaginationFooterResultado] = useState();
  const [cantPaginasSelectResultado, setCantPaginasSelectResultado] = useState('10');
  const [paginaActualResultado, setPaginaActualResultado] = useState(1);


  //resultados

  const fileInputRef = useRef(null);
  var tipoConsulta = '';
  var contentTable = []
  var contentTableResultado = []
  var currentItems = [];
  var currentItemsResultado = [];
  var itemOffset = 0;
  var itemOffsetResultado = 0;
  var totalPaginas = 0;
  // var paginaActual = 3;
  var cantPaginasSelect2 = 10;
  var cantPaginasSelectResultado2 = 10;
  var totalPaginasResultado = 0;//, paginaActualResultado = 1;


  /*
  *   
  *
  *   M  É  T  O  D  O  S         D  E        L  A        P  A  G  I  N  A        P  R  I  N  C  I  P  A  L
  * 
  * */

  const TableHeader = (props) => {
    return (
      <thead>
        <tr>
          <th data-field="Consecutivo" >Consecutivo</th>
          <th data-field="nameOriginal"> Nombre original</th>
          <th data-field="nameModified"> Nombre modificado</th>
          <th data-field="fechaCarga"> Fecha de carga</th>
          <th data-field="userModified"> Usuario</th>
          <th data-field="action" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}> Acción  </th>
        </tr>
      </thead>
    )
  };

  const TableBody = (props) => {
    return (
      <tr>
        <td>
          {props.consecutive}
        </td>
        <td>
          {props.name_original}
        </td>
        <td>
          {props.name_modified}
        </td>
        <td>
          {props.fecha}
        </td>
        <td>
          {props.user}
        </td>
        <td style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Button value={props.consecutive} node="button" onClick={changePantallaResultado} small className="indigo darken-4">
            Ver Resultado
          </Button>
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


  async function obtenerDataTable(nroPage, cantReg) {
    await tableService.getDataTable(nroPage, cantReg, startDate, endDate, consecutivoCargue, tipoConsulta, true, "")
      .then((response) => {
        if (response) {
          contentTable = response.contentTable;
          // setPageCount(response.totalPaginas);
        }
      });

  }

  const changeHandler = (event) => {
    if (event) {

      if (event.target.files[0] !== undefined) {
        console.log('archivo seleccionado')
        setSelectedFile(event.target.files[0]);

        console.log("Modificado" + event.target.files[0].name)
        setNameFileSelected(event.target.files[0].name);
        setIsSelected(true);
        setIsDisabledButton(false);
      }

    }
  };


  // Invoke when user click to request another page.
  async function handlePageClick(event){
    const pagina = event.selected + 1;
    await reloadTableMain(pagina, cantPaginasSelect2);
    console.log('Se cambia de pagina principal: ' + pagina)
    console.log('cantPaginasSelect: ' + cantPaginasSelect2)
    const newOffset = (event.selected * cantPaginasSelect2) % contentTable.length;
    

    itemOffset = newOffset;
    console.log('itemOffset: ' + itemOffset)
    const endOffset = itemOffset + cantPaginasSelect2;
    console.log('endOffset: ' + endOffset)
    currentItems = contentTable.slice(itemOffset, endOffset);
    console.log('currentItems: ' + currentItems)
    setTableRender(<tbody>
      {currentItems.map((contenido, index) => {
        return <TableBody consecutive={contenido.consecutive}
        name_original={contenido.name_original}
        name_modified={contenido.name_modified}
        fecha={contenido.fecha}
        user={contenido.user} />
      })}
    </tbody>);
  };

  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      let encoded = reader.result.toString().replace(/^data:(.*,)?/, '');
      if ((encoded.length % 4) > 0) {
        encoded += '='.repeat(4 - (encoded.length % 4));
      }
      resolve(encoded);
    };
    reader.onerror = error => reject(error);
  });

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function reloadTableMain(nroPage, cantReg) {
    setTableRender(
      <Loading text={loaderText} aditional={aditional} />
    );

    // setPaginationFooter(null);
    setExporta(null)

    
    await sleep(5000)
    // const dataTable = await obtenerDataTable(nroPage, cantReg);
    console.log('terminó sleep')

    contentTable = [
      { consecutive: '1', name_original: 'carguecuentasdepositocdt_V2 (1).xlsx', name_modified: 'name_modificado_.xlsx', fecha: '2022-04-05', user: '' },
      { consecutive: '2', name_original: 'carguecuentasdepositocdt_V2 (2).xlsx', name_modified: 'name_modificado_.xlsx', fecha: '2022-04-05', user: '' },
      { consecutive: '3', name_original: 'carguecuentasdepositocdt_V2 (3).xlsx', name_modified: 'name_modificado_.xlsx', fecha: '2022-04-05', user: '' },
      { consecutive: '4', name_original: 'carguecuentasdepositocdt_V2 (4).xlsx', name_modified: 'name_modificado_.xlsx', fecha: '2022-04-05', user: '' },
      { consecutive: '5', name_original: 'carguecuentasdepositocdt_V2 (4).xlsx', name_modified: 'name_modificado_.xlsx', fecha: '2022-04-05', user: '' },
      { consecutive: '6', name_original: 'carguecuentasdepositocdt_V2 (4).xlsx', name_modified: 'name_modificado_.xlsx', fecha: '2022-04-05', user: '' },
      { consecutive: '7', name_original: 'carguecuentasdepositocdt_V2 (4).xlsx', name_modified: 'name_modificado_.xlsx', fecha: '2022-04-05', user: '' },
      { consecutive: '8', name_original: 'carguecuentasdepositocdt_V2 (4).xlsx', name_modified: 'name_modificado_.xlsx', fecha: '2022-04-05', user: '' },
      { consecutive: '9', name_original: 'carguecuentasdepositocdt_V2 (4).xlsx', name_modified: 'name_modificado_.xlsx', fecha: '2022-04-05', user: '' },
      { consecutive: '10', name_original: 'carguecuentasdepositocdt_V2 (4).xlsx', name_modified: 'name_modificado_.xlsx', fecha: '2022-04-05', user: '' },
      { consecutive: '11', name_original: 'carguecuentasdepositocdt_V2 (4).xlsx', name_modified: 'name_modificado_.xlsx', fecha: '2022-04-05', user: '' },
      { consecutive: '12', name_original: 'carguecuentasdepositocdt_V2 (4).xlsx', name_modified: 'name_modificado_.xlsx', fecha: '2022-04-05', user: '' },
      { consecutive: '13', name_original: 'carguecuentasdepositocdt_V2 (4).xlsx', name_modified: 'name_modificado_.xlsx', fecha: '2022-04-05', user: '' },
      { consecutive: '14', name_original: 'carguecuentasdepositocdt_V2 (4).xlsx', name_modified: 'name_modificado_.xlsx', fecha: '2022-04-05', user: '' },
      { consecutive: '15', name_original: 'carguecuentasdepositocdt_V2 (4).xlsx', name_modified: 'name_modificado_.xlsx', fecha: '2022-04-05', user: '' },
      { consecutive: '16', name_original: 'carguecuentasdepositocdt_V2 (4).xlsx', name_modified: 'name_modificado_.xlsx', fecha: '2022-04-05', user: '' },
      { consecutive: '17', name_original: 'carguecuentasdepositocdt_V2 (1).xlsx', name_modified: 'name_modificado_.xlsx', fecha: '2022-04-05', user: '' },
      { consecutive: '18', name_original: 'carguecuentasdepositocdt_V2 (2).xlsx', name_modified: 'name_modificado_.xlsx', fecha: '2022-04-05', user: '' },
      { consecutive: '19', name_original: 'carguecuentasdepositocdt_V2 (3).xlsx', name_modified: 'name_modificado_.xlsx', fecha: '2022-04-05', user: '' },
      { consecutive: '20', name_original: 'carguecuentasdepositocdt_V2 (4).xlsx', name_modified: 'name_modificado_.xlsx', fecha: '2022-04-05', user: '' },
      { consecutive: '21', name_original: 'carguecuentasdepositocdt_V2 (4).xlsx', name_modified: 'name_modificado_.xlsx', fecha: '2022-04-05', user: '' },
      { consecutive: '22', name_original: 'carguecuentasdepositocdt_V2 (4).xlsx', name_modified: 'name_modificado_.xlsx', fecha: '2022-04-05', user: '' }
    ];


    console.log('cantPaginasSelect:' + cantReg);

    const endOffset = itemOffset + cantReg;
    // console.log(`Loading items from ${itemOffset} to ${endOffset}`);

    currentItems = contentTable.slice(itemOffset, endOffset);
    // console.log('currentItems:' + currentItems);

    totalPaginas = Math.ceil(contentTable.length / cantReg);
    // console.log('totalPaginas:' + totalPaginas);
    if (totalPaginas !== 0) {
      setTableHeader(
        <TableHeader />
      );

      setTableRender(<tbody>
        {currentItems.map((contenido, index) => {
          return <TableBody consecutive={contenido.consecutive}
            name_original={contenido.name_original}
            name_modified={contenido.name_modified}
            fecha={contenido.fecha}
            user={contenido.user} />
        })}
      </tbody>);


      setPaginationFooter(
        <TableFooterPagination />
      );

      setExporta(
        <Row>
          <Col s={12} m={12} className="input-field m0">
            <ExcelFile
              element={<Button node="button" style={{ float: 'right' }} small className="indigo darken-4">Exportar en Excel</Button>}
              filename="Carga masiva de Cuentas Deposito">
              <ExcelSheet data={contentTable} name="Archivos cargados">
                <ExcelColumn label="Consecutivo" value="id" />
                <ExcelColumn label="Nombre" value="name" />
              </ExcelSheet>

            </ExcelFile>

          </Col>
        </Row>
      )
    }

  }

  async function applyFilters() {
    console.log("Se aplican filtros")
    console.log("startDate: " + startDate)
    console.log("endDate: " + endDate)
    tipoConsulta = 'filtro';
    await reloadTableMain(paginaActual, cantPaginasSelect);
  }

  async function deleteFilters() {
    //Pendiente resetear fechas
    tipoConsulta = '';
    setConsecutivoCargue('');
    await reloadTableMain(paginaActual, cantPaginasSelect);
  }

  async function handleSubmission(event) {
    // console.log('selectedFile: ' + selectedFile);
    // console.log('isSelected: ' + isSelected);
    // console.log('nameFileSelected: ' + nameFileSelected);


    if (isSelected) {

      const base64File = await toBase64(selectedFile).catch(e => Error(e));

      if (base64File instanceof Error) {

        //console.log('Error: ', base64File.message);
        toast.error("Error al subir archivo.");

      } else {

        console.log('base64File: ' + base64File);
        //console.log('product-handleSubmission: ' + product);
        var bodyUpload = {
          "product": product,
          "file_name": nameFileSelected,
          "file_content": base64File
        }
        //Se invoca al servicio S3
        const responseMasivoService = await masivoService.uploadFile(bodyUpload);
        console.log('async masivoService.uploadFile terminado ');

        if (responseMasivoService && responseMasivoService.description === "ok") {
        // if (true) {

          toast.success("Archivo subido corrrectamente.");
          setNameFileSelected("Ningún archivo seleccionado.");
          setSelectedFile(null);
          setIsSelected(false);
          setIsDisabledButton(true);

          tipoConsulta = ''
          setConsecutivoCargue('');
          console.log('cantPaginasSelect:' + cantPaginasSelect)
          //Pendiente reiniciar fecha
          await reloadTableMain(1, cantPaginasSelect);

        } else {
          toast.error("Error al subir archivo.");
        }
      }
    } else {
      toast.error("No se ha seleccionado ningun archivo.");
    }

  };


  useEffect(() => {
    reloadTableMain(paginaActual, cantPaginasSelect);
    document.title = title
  }, []);


  const options = [
    { value: '1', label: 'CDT' },
    { value: '2', label: 'Cuentas Corrientes' },
    { value: '3', label: 'Bonos' }
  ]

  const cantPaginas = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 30, label: '30' }
  ]

  const onChangeOptions = (event) => {
    const selectValue = event.value;
    if (selectValue === '1') {
      setProduct('CDT');

    } else if (selectValue === '2') {
      setProduct('Cuentas Corrientes');

    } else if (selectValue === '3') {
      setProduct('Bonos')

    }

  }

  const onChangeCantPaginas = (event) => {
    const selectValue = event.value;
    console.log('selectValue: ' + selectValue)
    setCantPaginasSelect(selectValue)
    cantPaginasSelect2 = selectValue;
    setPaginaActual(1);
    console.log('cantPaginasSelect: ' + cantPaginasSelect)
    console.log('cantPaginasSelect2: ' + cantPaginasSelect2)
    reloadTableMain(1, selectValue);
  }

  const onChangeInputConsecutivo = (event) => {
    const inputConsecutivo = event.target.value;
    setConsecutivoCargue(inputConsecutivo);
  }


  /*
  *   
  *
  *   M  É  T  O  D  O  S         D  E        L  A        P  A  G  I  N  A        R  E  S  U  L  T  A  D  O  S
  * 
  *
  *  */

  const cantPaginasResultado = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 30, label: '30' }
  ]

  const onChangeCantPaginasResultado = (event) => {
    const selectValue = event.value;
    itemOffsetResultado=0;
    console.log('selectValue-resultado' + selectValue)
    console.log('itemOffsetResultado-resultado' + itemOffsetResultado)
    setCantPaginasSelectResultado(selectValue)
    cantPaginasSelectResultado2 = selectValue;
    setPaginaActualResultado(1);
    console.log('cantPaginasSelectResultado' + cantPaginasSelectResultado)
    console.log('cantPaginasSelectResultado2' + cantPaginasSelectResultado2)
    console.log('idRegistro' + idRegistro)
    reloadTableResultado(1, selectValue,idRegistro);
  }

  async function obtenerDataTableResultado(nroPage, cantReg, id) {
    await tableService.getDataTable(nroPage, cantReg, startDate, endDate, consecutivoCargue, tipoConsulta, false, id)
      .then((response) => {
        if (response) {
          contentTableResultado = response.contentTable;
          // setPageCount(response.totalPaginas);
        }
      });

  }

  async function reloadTableResultado(nroPage, cantReg, id) {
    setTableResultadoRender(
      <Loading text={loaderText} aditional={aditional} />
    );

    await sleep(5000);
    // const dataResultado = await obtenerDataTableResultado(nroPage, cantReg, id);
    console.log('terminado sleeip resutlado')
    contentTableResultado = [
      { consecutivo: '1', resultado: 'ok', detalle: 'detalle' },
      { consecutivo: '2', resultado: 'ok', detalle: 'detalle' },
      { consecutivo: '3', resultado: 'ok', detalle: 'detalle' },
      { consecutivo: '4', resultado: 'ok', detalle: 'detalle' },
      { consecutivo: '5', resultado: 'ok', detalle: 'detalle' },
      { consecutivo: '6', resultado: 'ok', detalle: 'detalle' },
      { consecutivo: '7', resultado: 'ok', detalle: 'detalle' },
      { consecutivo: '8', resultado: 'ok', detalle: 'detalle' },
      { consecutivo: '9', resultado: 'ok', detalle: 'detalle' },
      { consecutivo: '10', resultado: 'ok', detalle: 'detalle' },
      { consecutivo: '11', resultado: 'ok', detalle: 'detalle' },
      { consecutivo: '12', resultado: 'ok', detalle: 'detalle' },
      { consecutivo: '13', resultado: 'ok', detalle: 'detalle' },
      { consecutivo: '14', resultado: 'ok', detalle: 'detalle' },
      { consecutivo: '15', resultado: 'ok', detalle: 'detalle' },
      { consecutivo: '16', resultado: 'ok', detalle: 'detalle' },
      { consecutivo: '17', resultado: 'ok', detalle: 'detalle' },
      { consecutivo: '18', resultado: 'ok', detalle: 'detalle' },
      { consecutivo: '19', resultado: 'ok', detalle: 'detalle' },
      { consecutivo: '20', resultado: 'ok', detalle: 'detalle' },
      { consecutivo: '21', resultado: 'ok', detalle: 'detalle' },
      { consecutivo: '22', resultado: 'ok', detalle: 'detalle' },
      { consecutivo: '23', resultado: 'ok', detalle: 'detalle' },
      { consecutivo: '24', resultado: 'ok', detalle: 'detalle' },
      { consecutivo: '25', resultado: 'ok', detalle: 'detalle' },
      { consecutivo: '26', resultado: 'ok', detalle: 'detalle' },
      { consecutivo: '27', resultado: 'ok', detalle: 'detalle' },
      { consecutivo: '28', resultado: 'ok', detalle: 'detalle' },
      { consecutivo: '29', resultado: 'ok', detalle: 'detalle' },
      { consecutivo: '30', resultado: 'ok', detalle: 'detalle' },
      { consecutivo: '31', resultado: 'ok', detalle: 'detalle' },
      { consecutivo: '32', resultado: 'ok', detalle: 'detalle' },
      { consecutivo: '33', resultado: 'ok', detalle: 'detalle' },
      { consecutivo: '34', resultado: 'ok', detalle: 'detalle' }
    ];

    const endOffsetResultado = itemOffsetResultado + parseInt(cantReg);
    console.log('endOffsetResultado: '+endOffsetResultado);
    console.log('itemOffsetResultado: '+itemOffsetResultado);
    currentItemsResultado = contentTableResultado.slice(itemOffsetResultado, endOffsetResultado);
    console.log('currentItemsResultado: '+currentItemsResultado);

    totalPaginasResultado = Math.ceil(contentTableResultado.length / cantReg);
    setTableHeaderResultado(<thead>
      <tr>
        <th data-field="consecutivo " style={{ width: "120px" }}>Consecutivo</th>
        <th data-field="estado" style={{ width: "130px" }}>  Estado </th>
        <th data-field="detalle"> Detalle </th>
      </tr>
    </thead>);
    setTableResultadoRender(<tbody>
      {currentItemsResultado.map((contenido, index) => {
        return <TableBodyResultado consecutivo={contenido.consecutivo}
          resultado={contenido.resultado} detalle={contenido.detalle} />
      })}
    </tbody>);
    setPaginationFooterResultado(
      <TableFooterPaginationResultado />
    );
    setExportaResultado(
      <Row>
        <Col s={12} m={12} className="input-field m0">
          <ExcelFile
            element={<Button node="button" style={{ float: 'right' }} small className="indigo darken-4">Exportar en Excel</Button>}
            filename="Resultado de carga masiva">
            <ExcelSheet data={contentTableResultado} name="Resultados">
              <ExcelColumn label="Consecutivo" value="consecutivo" />
              <ExcelColumn label="Resultado" value="resultado" />
              <ExcelColumn label="Detalle" value="detalle" />
            </ExcelSheet>

          </ExcelFile>

        </Col>
      </Row>
    )
  }


  async function changePantallaResultado(event) {
    setIsPantallaPrincipal(false);
    itemOffsetResultado=0;
    var id = event.target.value;
    setIdRegistro(id);
    console.log('id: ' + id)
    reloadTableResultado(1,'10',id);
    

  };


  async function changePantallaCargar (event) {
    console.log('cambia a principal')
    setIsPantallaPrincipal(true);

    reloadTableMain(1, 10);

  };



  const TableBodyResultado = (props) => {
    return (
      <tr>
        <td>
          {props.consecutivo}
        </td>
        <td>
          {props.resultado}
        </td>
        <td >
          {props.detalle}
        </td>
      </tr>
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


  // Invoke when user click to request another page.
  async function handlePageClickResultado (event) {
    const pagina = event.selected + 1;
    await reloadTableResultado(pagina, cantPaginasSelectResultado2, idRegistro);
    console.log('Se cambia de pagina resultado: ' + pagina)
    console.log('cantPaginasSelectResultado2: ' + cantPaginasSelectResultado2)
    const newOffsetResultado = (event.selected * cantPaginasSelectResultado2) % contentTableResultado.length;

    itemOffsetResultado = newOffsetResultado;
    console.log('itemOffsetResultado: ' + itemOffsetResultado)
    const endOffsetResultado = itemOffsetResultado + cantPaginasSelectResultado2;
    console.log('endOffsetResultado: ' + endOffsetResultado)
    currentItemsResultado = contentTableResultado.slice(itemOffsetResultado, endOffsetResultado);
    console.log('currentItemsResultado: ' + currentItemsResultado)
    setTableHeaderResultado(<thead>
      <tr>
        <th data-field="consecutivo " style={{ width: "120px" }}>Consecutivo</th>
        <th data-field="estado" style={{ width: "130px" }}>  Estado </th>
        <th data-field="detalle"> Detalle </th>
      </tr>
    </thead>);
    setTableResultadoRender(<tbody>
      {currentItemsResultado.map((contenido, index) => {
        return <TableBodyResultado consecutivo={contenido.consecutivo}
          resultado={contenido.resultado} detalle={contenido.detalle} />
      })}
    </tbody>);
  };



  /*
  *   
  *
  *   R  E  N  D  E  R      D  E        L  A        P  A  G  I  N  A
  * 
  * 
  * */


  const renderElement = () => {
    return isPantallaPrincipal ? (
      <React.Fragment>
        <CardHeader title={title} description={description} />
        <Row>
          <Col s={8} m={3}>
            <label className="active">Tipo de Cargue</label>
            <Select className="basic-single" defaultValue={options[0]} options={options} onChange={onChangeOptions} />
          </Col>
        </Row>
        <Row>
          <Col s={12} m={2} >
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

          <Col s={12} m={7}>
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
                  <input type="text" onChange={onChangeInputConsecutivo} value={consecutivoCargue} />
                </Col>
                <Col s={12} m={3} className="input-field " style={{ float: 'right' }} >
                  <Button node="button" small className="indigo darken-4" onClick={applyFilters}>
                    Aplicar filtros
                  </Button>
                </Col>
                <Col s={12} m={3} className="input-field " style={{ float: 'right' }} >
                  <Button node="button" small className="indigo darken-4" onClick={deleteFilters}>
                    Borrar filtros
                  </Button>
                </Col>
              </Row>
            </CollapsibleItem>
          </Collapsible>
        </Row>

        <Row>
          <Col s={2} m={2}>
            <label className="active">Cantidad de registros</label>
            <Select className="basic-single" defaultValue={cantPaginas[0]} options={cantPaginas} onChange={onChangeCantPaginas} />
          </Col>
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
            <Col s={2} m={2}>
              <Button node="button" small className="indigo darken-4" onClick={changePantallaCargar}>
                Retroceder
              </Button>
            </Col>
            <Col s={2} m={2} style={{ float: 'right' }} >
              <label className="active">Cantidad de registros</label>
              <Select className="basic-single" defaultValue={cantPaginasResultado[0]}  options={cantPaginasResultado} onChange={onChangeCantPaginasResultado} />
            </Col>
          </Row>
          <Row>
            <Table>
              {tableHeaderResultado}
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