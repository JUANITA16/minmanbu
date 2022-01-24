import React, { useState, useEffect, useRef } from "react";
import { InputDate, CardHeader,Loading } from '../components/index'
import { Row, Col, Button, Collapsible, CollapsibleItem, Icon, Table } from 'react-materialize'
import { TablaCuentaService } from "../../services/tabla-cuenta-service";
import { MasivoService } from "../../services/masivo-service";
import { toast } from 'react-toastify';
import Select from 'react-select'
import ReactPaginate from 'react-paginate';

import { convertTZ, addDays } from "../../helpers/utils";

import ExportExcel from 'react-export-excel'


export const tableService = new TablaCuentaService();
export const masivoService = new MasivoService();

const ExcelFile = ExportExcel.ExcelFile;
const ExcelSheet = ExportExcel.ExcelSheet;
const ExcelColumn = ExportExcel.ExcelColumn;



export default function CreacionCuenta() {

  const title = 'Creacion de cuentas masiva';
  const description = 'En esta sección podrá cargar archivos para la creación de cuenta en forma masiva.';
  const [selectedFile, setSelectedFile] = useState();
  const [isSelected, setIsSelected] = useState(false);
  const [nameFileSelected, setNameFileSelected] = useState("Ningún archivo seleccionado.");
  const [exporta, setExporta] = useState();
  const [exportaResultado, setExportaResultado] = useState();
  const [isDisabledButton, setIsDisabledButton] = useState(true);
  const [isDisabledButtonFilter, setIsDisabledButtonFilter] = useState(true);
  const [isPantallaPrincipal, setIsPantallaPrincipal] = useState(true);

  //Principal
  const [tableRender, setTableRender] = useState();
  const [paginationFooter, setPaginationFooter] = useState();
  const [tableHeader, setTableHeader] = useState();
  const [startDate, setStartDate] = useState(convertTZ(addDays(new Date(),-7)))
  const [endDate, setEndDate] = useState(convertTZ(new Date()));
  const [consecutivoCargue, setConsecutivoCargue] = useState('');
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
  var isWeek=true;
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
          <th data-field="Consecutivo" style={{ textAlign: "center" }}>Consecutivo</th>
          <th data-field="nameOriginal" style={{ textAlign: "center", minWidth: 50, maxWidth: 100 }} > Nombre original</th>
          <th data-field="nameModified" style={{ textAlign: "center" }} > Nombre modificado</th>
          <th data-field="fechaCarga" style={{ textAlign: "center" }}> Fecha de carga</th>
          <th data-field="userModified" style={{ textAlign: "center"}}> Usuario</th>
          <th data-field="action" style={{ textAlign: "center" }}> Resultados  </th>
        </tr>
      </thead>
    )
  };

  const TableBody = (props) => {
    return (
      <tr style={{ fontSize: "small" }} >
        <td style={{ textAlign: "center" }}>
          {props.consecutive}
        </td>
        <td style={{ minWidth: 10, maxWidth: 200, wordBreak:"break-all"}}>
          {props.name_original}
        </td>
        <td style={{ minWidth: 10, maxWidth: 200, wordBreak:"break-all"}}>
          {props.name_modified}
        </td>
        <td style={{ textAlign: "center" }}>
          {props.fecha}
        </td>
        <td style={{ minWidth: 10, maxWidth: 200, wordBreak:"break-all"}}>
          {props.user}
        </td>
        <td style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Button value={props.consecutive} node="button" onClick={changePantallaResultado} small className="indigo darken-4">
            Detalle
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
  
  // function sleep(ms) {
  //   return new Promise(resolve => setTimeout(resolve, ms));
  // }

  async function reloadTableMain(nroPage, cantReg) {
    setTableRender(
      <Loading text={loaderText} aditional={aditional} />
    );

    setExporta(null)

    
    // await sleep(5000)
    const dataTable = await tableService.getDataTable(startDate, endDate, consecutivoCargue, isWeek)
    // console.log('terminó sleep')
    console.log('dataTable: '+dataTable)
    if (dataTable && dataTable.length!==0){
      contentTable = dataTable; 
      contentTable.sort((a, b) => new Date(a.date_upload).getTime() - new Date(b.date_upload).getTime())
      
      if(isWeek){
        toast.info("Se muestra registros de los últimos 7 días.");
        }
        console.log('cantPaginasSelect:' + cantReg);
    
        const endOffset = itemOffset +  parseInt(cantReg);
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
              return <TableBody consecutive={contenido.file_id}
                name_original={contenido.original_filename}
                name_modified={contenido.filename}
                fecha={contenido.date_upload}
                user={contenido.user_upload} />
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
                    <ExcelColumn label="Consecutivo" value="file_id" />
                    <ExcelColumn label="Nombre original" value="original_filename" />
                    <ExcelColumn label="Nombre modificado" value="filename" />
                    <ExcelColumn label="Fecha" value="date_upload" />
                    <ExcelColumn label="Usuario" value="user_upload" />
                  </ExcelSheet>
    
                </ExcelFile>
    
              </Col>
            </Row>
          )
        }
    }else{
      toast.error("Falló al cargar registros.");
      setTableRender(null);
    }
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

          isWeek = true;
          setConsecutivoCargue('');
          console.log('cantPaginasSelect:' + cantPaginasSelect)
          cantPaginasSelect2 = cantPaginasSelect;
          setStartDate(convertTZ(addDays(new Date(),-7)))
          setEndDate(convertTZ(new Date()));
          setIsDisabledButtonFilter(true);
          await reloadTableMain(1, cantPaginasSelect);
          console.log('cantPaginasSelect2: ' + cantPaginasSelect2)
        } else {
          toast.error("Error al subir archivo.");
        }
      }
    } else {
      toast.error("No se ha seleccionado ningun archivo.");
    }

  }

  async function applyFilters() {
    console.log("Se aplican filtros")
    console.log("startDate: " + startDate)
    console.log("endDate: " + endDate)
    isWeek=false;
    cantPaginasSelect2 =cantPaginasSelect;
    await reloadTableMain(paginaActual, cantPaginasSelect);
    console.log('cantPaginasSelect2: ' + cantPaginasSelect2)
    setIsDisabledButtonFilter(false);
  }

  async function deleteFilters() {
    setStartDate(convertTZ(addDays(new Date(),-7)))
    setEndDate(convertTZ(new Date()));
    isWeek = true;
    setConsecutivoCargue('');
    cantPaginasSelect2 =cantPaginasSelect;
    await reloadTableMain(paginaActual, cantPaginasSelect);
    console.log('cantPaginasSelect2: ' + cantPaginasSelect2)
    setIsDisabledButtonFilter(true);
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

  



  // Invoke when user click to request another page.
  async function handlePageClick(event){
    console.log('cantPaginasSelect: ' + cantPaginasSelect2)
    const newOffset = (event.selected * cantPaginasSelect2) % contentTable.length;
    
    itemOffset = newOffset;
    console.log('itemOffset: ' + itemOffset)
    const endOffset = parseInt(itemOffset) + parseInt(cantPaginasSelect2);
    console.log('endOffset: ' + endOffset)
    currentItems = contentTable.slice(itemOffset, endOffset);
    console.log('currentItems: ' + currentItems)

    setTableRender(<tbody>
      {currentItems.map((contenido, index) => {
        return <TableBody consecutive={contenido.file_id}
          name_original={contenido.original_filename}
          name_modified={contenido.filename}
          fecha={contenido.date_upload}
          user={contenido.user_upload} />
      })}
    </tbody>);
  };


  useEffect(() => {
    isWeek=true;
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
    isWeek=false;
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

  async function reloadTableResultado(nroPage, cantReg, id) {
    setTableResultadoRender(
      <Loading text={loaderText} aditional={aditional} />
    );
    
    isWeek=false;

    
    setCantPaginasSelect('10')
    setStartDate(convertTZ(addDays(new Date(),-7)))
    setEndDate(convertTZ(new Date()));
    setIsDisabledButtonFilter(true);

    const dataResultado = await tableService.getDataTable(startDate, endDate, id, isWeek)
    console.log('dataResultado: '+dataResultado)
    if(dataResultado && dataResultado[0].results_per_row && dataResultado[0].results_per_row.length !==0){
      contentTableResultado = dataResultado[0].results_per_row;
      console.log('ontentTableResultado.length: ' + contentTableResultado.length)
  
      const endOffsetResultado = itemOffsetResultado + parseInt(cantReg);
      console.log('endOffsetResultado: '+endOffsetResultado);
      console.log('itemOffsetResultado: '+itemOffsetResultado);
      currentItemsResultado = contentTableResultado.slice(itemOffsetResultado, endOffsetResultado);
      console.log('currentItemsResultado: '+currentItemsResultado);
  
      totalPaginasResultado = Math.ceil(contentTableResultado.length / cantReg);
      setTableHeaderResultado(<thead>
        <tr>
          <th data-field="rowID " style={{ textAlign: "center" }}>Id</th>
          <th data-field="codeStatus" style={{ textAlign: "center" }}>  Cod. Estado </th>
          <th data-field="status" style={{ textAlign: "center" }}> Estado </th>
          <th data-field="errorDetail" style={{ textAlign: "center" }}> Detalle </th>
        </tr>
      </thead>);
      setTableResultadoRender(<tbody>
        {currentItemsResultado.map((contenido, index) => {
          return <TableBodyResultado rowID={contenido.rowID}
          codeStatus={contenido.codeStatus} status={contenido.status} errorDetail={contenido.errorDetail}  />
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
                <ExcelColumn label="Id" value="rowID" />
                <ExcelColumn label="Cod.Estado" value="codeStatus" />
                <ExcelColumn label="Estado" value="status" />
                <ExcelColumn label="Detalle" value="errorDetail" />
              </ExcelSheet>
  
            </ExcelFile>
  
          </Col>
        </Row>
      )
    }else {
      toast.error("No se encuentra en proceso ningún registro.");
      setTableResultadoRender(null);
    }
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
    isWeek=true;
    setConsecutivoCargue('');
    reloadTableMain(1, 10);

  };

  const TableBodyResultado = (props) => {
    return (
      <tr>
        <td  style={{minWidth: 20, maxWidth: 100 , textAlign: "center" }}>
          {props.rowID}
        </td >
        <td style={{minWidth: 10, maxWidth: 50 ,  textAlign: "center" }}>
          {props.codeStatus}
        </td>
        <td style={{ minWidth: 10, maxWidth: 150 , textAlign: "center" , wordBreak:"break-all" }}>
          {props.status}
        </td>
        <td style={{ minWidth: 10, maxWidth: 250, wordBreak:"break-all"}}>
          {props.errorDetail}
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
    // await reloadTableResultado(pagina, cantPaginasSelectResultado2, idRegistro);
    console.log('Se cambia de pagina resultado: ' + pagina)
    console.log('cantPaginasSelectResultado2: ' + cantPaginasSelectResultado2)
    const newOffsetResultado = (event.selected * cantPaginasSelectResultado2) % contentTableResultado.length;

    itemOffsetResultado = newOffsetResultado;
    console.log('itemOffsetResultado: ' + itemOffsetResultado)
    const endOffsetResultado = parseInt(itemOffsetResultado) + parseInt(cantPaginasSelectResultado2);
    console.log('endOffsetResultado: ' + endOffsetResultado)
    currentItemsResultado = contentTableResultado.slice(itemOffsetResultado, endOffsetResultado);
    console.log('currentItemsResultado: ' + currentItemsResultado)
    
    setTableResultadoRender(<tbody>
      {currentItemsResultado.map((contenido, index) => {
        return <TableBodyResultado rowID={contenido.rowID}
        codeStatus={contenido.codeStatus} status={contenido.status} errorDetail={contenido.errorDetail}  />
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
                  <InputDate labelName="Fecha inicial" maxValue={endDate} setDate={setStartDate} dateInput={startDate} />
                </Col>

                <Col s={12} m={3} className="text-left">
                  <InputDate labelName="Fecha final" minValue={startDate} setDate={setEndDate}  dateInput={endDate} />
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
                  <Button node="button" disabled={isDisabledButtonFilter} small className="indigo darken-4" onClick={deleteFilters}>
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
          <Table >
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