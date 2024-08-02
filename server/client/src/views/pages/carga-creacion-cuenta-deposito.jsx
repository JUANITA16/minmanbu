import React, { useState, useEffect, useRef } from "react";
import { InputDate, CardHeader,Loading } from '../components/index'
import { Row, Col, Button, Collapsible, CollapsibleItem, Icon, Table } from 'react-materialize'
import { ServerAPI } from "../../services/server";
import { toast } from 'react-toastify';
import Select from 'react-select'
import ReactPaginate from 'react-paginate';

import { convertTZ, addDays,toBase64 } from "../../helpers/utils";

import ExportExcel from 'react-export-excel'

import { useMsal } from "@azure/msal-react";

const ExcelFile = ExportExcel.ExcelFile;
const ExcelSheet = ExportExcel.ExcelSheet;
const ExcelColumn = ExportExcel.ExcelColumn;
const INITIAL_DATE_OFFSET_DAYS = -7;
const INITIAL_PAGE_SIZE = '10';

export default function CreacionCuenta() {

  const service = new ServerAPI();

  const { instance } = useMsal();
  const { name } = instance.getActiveAccount().idTokenClaims;
  const title = 'Creacion de cuentas masiva';
  const description = 'En esta sección podrá cargar archivos para la creación de cuentas en forma masiva.';
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
  const [startDate, setStartDate] = useState(convertTZ(addDays(new Date(), INITIAL_DATE_OFFSET_DAYS)));
  const [endDate, setEndDate] = useState(convertTZ(new Date()));
  const [consecutivoCargue, setConsecutivoCargue] = useState('');
  const [product, setProduct] = useState('CDT');
  const [idRegistro, setIdRegistro] = useState('');
  const [cantPaginasSelect, setCantPaginasSelect] = useState(INITIAL_PAGE_SIZE);

  const [paginaActual, setPaginaActual] = useState(1);

  const [loaderText] = useState('');
  const [aditional] = useState('');
  //Principal

  //Resultados
  const [tableHeaderResultado, setTableHeaderResultado] = useState();
  const [tableResultadoRender, setTableResultadoRender] = useState();
  const [paginationFooterResultado, setPaginationFooterResultado] = useState();


  //resultados

  const fileInputRef = useRef(null);
  const isWeek = true;
  const contentTable = [];
  const contentTableResultado = [];
  const currentItems = [];
  const currentItemsResultado = [];
  const itemOffset = 0;
  const itemOffsetResultado = 0;
  const totalPaginas = 0;
  const cantPaginasSelect2 = 10;
  const cantPaginasSelectResultado2 = 10;
  const totalPaginasResultado = 0;


  /*
  *   
  *
  *   M  É  T  O  D  O  S         D  E        L  A        P  A  G  I  N  A        P  R  I  N  C  I  P  A  L
  * 
  * */

  const TableHeader = (_props) => {
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
    );
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

  const TableFooterPagination = (_props) => {
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
    );
  };


  async function reloadTableMain(cantReg) {
    setTableRender(
      <Loading text={loaderText} aditional={aditional} />
    );

    setExporta(null);

    const HTTP_OK_STATUS = 200;
    const dataTable = await service.getDataTable(startDate, endDate, consecutivoCargue, isWeek);
    if (dataTable.status === HTTP_OK_STATUS) {
      contentTable = dataTable.data;
      contentTable.sort((a, b) => a.file_id - b.file_id);
      contentTable.reverse();
      const endOffset = itemOffset +  parseInt(cantReg, 10);
      currentItems = contentTable.slice(itemOffset, endOffset);
      totalPaginas = Math.ceil(contentTable.length / cantReg);

      if (totalPaginas !== 0) {
        if(isWeek){
          toast.info("Se muestra registros de los últimos 7 días.");
        }
        setTableHeader(
          <TableHeader />
        );

        setTableRender(<tbody>
          {currentItems.map((contenido) => (
            <TableBody key={contenido.file_id} consecutive={contenido.file_id}
              name_original={contenido.original_filename}
              name_modified={contenido.filename}
              fecha={contenido.date_upload.replace('T',' ').replace('Z','')}
              user={contenido.user_upload} />
          ))}
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
        );
      }else{
        toast.error("No se encuentra ningún registro cargado.");
        setTableRender(null);
      }
    }else{
      toast.error(dataTable.detail);
      setTableRender(null);
    }
  }


  async function handleSubmission(_event) {

    if (isSelected) {
      toast.info("Cargando archivo...");
      setIsDisabledButton(true);
      const base64File = await toBase64(selectedFile).catch(e => Error(e));

      if (base64File instanceof Error) {
        toast.error("Error al subir archivo.");
      } else {

        const bodyUpload = {
          product,
          file_name: nameFileSelected,
          file_content: base64File,
          user_upload: name
        };

        //Se invoca al servicio S3
        const ONE_WEEK = 7;
        const responseMasivoService = await service.uploadFile(bodyUpload);

        if (responseMasivoService && responseMasivoService.description === "ok") {
          toast.success("Archivo cargado correctamente, ver detalle.");

          isWeek = true;
          setConsecutivoCargue('');
          cantPaginasSelect2 = cantPaginasSelect;
          setStartDate(convertTZ(addDays(new Date(), -ONE_WEEK)));
          setEndDate(convertTZ(new Date()));
          setIsDisabledButtonFilter(true);
          await reloadTableMain(1, cantPaginasSelect);

        } else {
          toast.error(responseMasivoService.detail);
        }

        setNameFileSelected("Ningún archivo seleccionado.");
        setSelectedFile(null);
        setIsSelected(false);
      }
    } else {
      toast.error("No se ha seleccionado ningun archivo.");
    }

  }

  async function applyFilters() {
    isWeek=false;
    cantPaginasSelect2 =cantPaginasSelect;
    await reloadTableMain(paginaActual, cantPaginasSelect);
    setIsDisabledButtonFilter(false);
  }

  const DEFAULT_DATE_OFFSET_DAYS = -7;
  async function deleteFilters() {
    setStartDate(convertTZ(addDays(new Date(), DEFAULT_DATE_OFFSET_DAYS)));
    setEndDate(convertTZ(new Date()));
    isWeek = true;
    setConsecutivoCargue('');
    cantPaginasSelect2 =cantPaginasSelect;
    await reloadTableMain(paginaActual, cantPaginasSelect);
    setIsDisabledButtonFilter(true);
  }

  const valideFileType = function (fileType, fileName) {
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv"
    ];
    const validExtensions = ["xlsx", "xls", "csv"];
    const nameArray = fileName.split(".");
    return validExtensions.includes(nameArray[nameArray.length -1]) &&
      validTypes.includes(fileType) &&
      !fileName.startsWith("=");
  };

  const changeHandler = (event) => {
    event.preventDefault()
    if (valideFileType(event.target.files[0].type, event.target.files[0].name)) {
      setSelectedFile(event.target.files[0]);
      setNameFileSelected(event.target.files[0].name);
      setIsSelected(true);
      setIsDisabledButton(false);
    } else {
      setSelectedFile("");
      setNameFileSelected("El archivo es inválido. Por favor subir un archivo .xlsx, .xls o .csv");
      setIsSelected(false);
      setIsDisabledButton(true);
    }

  };


  // Invoke when user click to request another page.
  async function handlePageClick(event){
    const newOffset = (event.selected * cantPaginasSelect2) % contentTable.length;

    itemOffset = newOffset;

    const endOffset = parseInt(itemOffset, 10) + parseInt(cantPaginasSelect2, 10);

    currentItems = contentTable.slice(itemOffset, endOffset);

    setTableRender(<tbody>
      {currentItems.map((contenido) => {
        return <TableBody key={contenido.file_id} consecutive={contenido.file_id}
          name_original={contenido.original_filename}
          name_modified={contenido.filename}
          fecha={contenido.date_upload.replace('T',' ').replace('Z','')}
          user={contenido.user_upload} />
      })}
    </tbody>);
  };


  useEffect(() => {
    reloadTableMain(paginaActual, cantPaginasSelect);

    document.title = title
  }, [paginaActual, cantPaginasSelect]);


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

    setCantPaginasSelect(selectValue)
    cantPaginasSelect2 = selectValue;
    setPaginaActual(1);

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

    setCantPaginasSelectResultado(selectValue)
    cantPaginasSelectResultado2 = selectValue;
    setPaginaActualResultado(1);

    reloadTableResultado(1, selectValue,idRegistro);
  }

  const DAYS_IN_A_WEEK = 7;
  const HTTP_STATUS_OK = 200;
  async function reloadTableResultado(cantReg, id) {
    setTableResultadoRender(
      <Loading text={loaderText} aditional={aditional} />
    );

    isWeek=false;


    setCantPaginasSelect('10')
    setStartDate(convertTZ(addDays(new Date(), -DAYS_IN_A_WEEK)));
    setEndDate(convertTZ(new Date()));
    setIsDisabledButtonFilter(true);

    const dataResultado = await service.getDataDetails(id); //tableService.getDataTable(startDate, endDate, id, isWeek)

    if(dataResultado.status=== HTTP_STATUS_OK) {
      contentTableResultado = dataResultado.data[0].results_per_row;
      if(contentTableResultado && contentTableResultado.length !==0){
        contentTableResultado.sort((a, b) => a.rowId - b.rowId)

        const endOffsetResultado = itemOffsetResultado + parseInt(cantReg, 10);

        currentItemsResultado = contentTableResultado.slice(itemOffsetResultado, endOffsetResultado);

        totalPaginasResultado = Math.ceil(contentTableResultado.length / cantReg);
        setTableHeaderResultado(<thead>
          <tr>
            <th data-field="rowId " style={{ textAlign: "center" }}>Id</th>
            <th data-field="codeStatus" style={{ textAlign: "center" }}>  Cod. Estado </th>
            <th data-field="status" style={{ textAlign: "center" }}> Estado </th>
            <th data-field="detail" style={{ textAlign: "center" }}> Detalle </th>
          </tr>
        </thead>);
        setTableResultadoRender(<tbody>
          {currentItemsResultado.map((contenido) => {
            return <TableBodyResultado key={contenido.rowId} rowId={contenido.rowId}
              codeStatus={contenido.codeStatus} status={contenido.status} detail={contenido.detail}  />
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
                  <ExcelColumn label="Id" value="rowId" />
                  <ExcelColumn label="Cod.Estado" value="codeStatus" />
                  <ExcelColumn label="Estado" value="status" />
                  <ExcelColumn label="Detalle" value="detail" />
                </ExcelSheet>

              </ExcelFile>

            </Col>
          </Row>
        )
      }else {
        toast.error("No se encuentra en proceso ningún registro.");
        setTableResultadoRender(null);
      }
    }else{
      toast.error(dataResultado.detail);
      setTableResultadoRender(null);
    }
  }


  async function changePantallaResultado(event) {
    setIsPantallaPrincipal(false);
    itemOffsetResultado=0;
    const id = event.target.value;
    setIdRegistro(id);
    reloadTableResultado(1,'10',id);


  };


  async function changePantallaCargar(_event) {
    setIsPantallaPrincipal(true);
    isWeek=true;
    setConsecutivoCargue('');
    reloadTableMain(1, 10);

  };

  const TableBodyResultado = (props) => {
    return (
      <tr>
        <td  style={{minWidth: 20, maxWidth: 100 , textAlign: "center" }}>
          {props.rowId}
        </td >
        <td style={{minWidth: 10, maxWidth: 50 ,  textAlign: "center" }}>
          {props.codeStatus}
        </td>
        <td style={{ minWidth: 10, maxWidth: 150 , textAlign: "center" , wordBreak:"break-all" }}>
          {props.status}
        </td>
        <td style={{ minWidth: 10, maxWidth: 250, wordBreak:"break-all"}}>
          {props.detail}
        </td>
      </tr>
    )
  };

  const TableFooterPaginationResultado = (_props) => {
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
    const newOffsetResultado = (event.selected * cantPaginasSelectResultado2) % contentTableResultado.length;

    itemOffsetResultado = newOffsetResultado;
    const endOffsetResultado = parseInt(itemOffsetResultado, 10) + parseInt(cantPaginasSelectResultado2, 10);
    currentItemsResultado = contentTableResultado.slice(itemOffsetResultado, endOffsetResultado);

    setTableResultadoRender(<tbody>
      {currentItemsResultado.map((contenido) => {
        return <TableBodyResultado key={contenido.rowId} rowId={contenido.rowId}
          codeStatus={contenido.codeStatus} status={contenido.status} detail={contenido.detail}  />
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
          <Col s={12} m={2}>
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