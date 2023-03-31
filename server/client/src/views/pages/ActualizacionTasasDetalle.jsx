import React, { useState, useEffect, useRef } from "react";
import { Loading } from '../components/index'
import { Row, Col, Button,Icon, Table } from 'react-materialize'
import { toast } from 'react-toastify';
import Select from 'react-select'
import ReactPaginate from 'react-paginate';
import { convertMessageError } from "../../helpers/utils";

import ExportExcel from 'react-export-excel'

export default function ActualizacionTasasDetalle(props) {
    //Detalles
    const [tableHeaderDetalle, setTableHeaderDetalle] = useState();
    const [tableDetalleRender, setTableDetalleRender] = useState();
    const [paginationFooterDetalle, setPaginationFooterDetalle] = useState();    
    const [cantPaginasSelectDetalle, setCantPaginasSelectDetalle] = useState('10');
    const [paginaActualDetalle, setPaginaActualDetalle] = useState(1);
    const [loaderText] = useState('');
    const [aditional] = useState('');
    const [exportaDetalle, setExportaDetalle] = useState();


    let contentTableDetalle = props.details
    var currentItemsDetalle = [];
    var itemOffsetDetalle;
    var totalPaginasDetalle = 0;

    
    const ExcelFile = ExportExcel.ExcelFile;
    const ExcelSheet = ExportExcel.ExcelSheet;
    const ExcelColumn = ExportExcel.ExcelColumn;

    const TableBodyDetalle = ({details}) => {
        return (
          <tr>
            <td  style={{minWidth: 20, maxWidth: 100 , textAlign: "center" }}>
              {props.isCuentaCorriente? details.account_number:details.consecutive}
            </td >
            <td style={{minWidth: 10, maxWidth: 50 ,  textAlign: "center" }}>
              {details.status_code}
            </td>
            {
                props.isCuentaCorriente? null:
                <td style={{ minWidth: 10, maxWidth: 150 , textAlign: "center" , wordBreak:"break-all" }}>
                    {details.status}
                </td>
            }
            <td style={{ minWidth: 10, maxWidth: 250, wordBreak:"break-all"}}>
              {props.isCuentaCorriente? convertMessageError(details.message).map((m)=>(
                  <p>{m}</p>
              )):details.detail}
            </td>
          </tr>
        )
    };


    const TableFooterPaginationDetalle = (props) => {
        return (
        <div>
            <ReactPaginate
            previousLabel={<Icon>chevron_left</Icon>}
            nextLabel={<Icon>chevron_right</Icon>}
            breakLabel="..."
            onPageChange={handlePageClickDetalle}
            pageRangeDisplayed={5}
            pageCount={totalPaginasDetalle}
            renderOnZeroPageCount={null}
            containerClassName={"pagination"}
            />
        </div>
        )
    };
  
    // Invoke when user click to request another page.
    async function handlePageClickDetalle (event) {
        const newOffsetDetalle = (event.selected * cantPaginasSelectDetalle) % contentTableDetalle.length;
        itemOffsetDetalle = newOffsetDetalle;
        addData();
    };

    function addData(){
        const endOffsetDetalle = itemOffsetDetalle + parseInt(cantPaginasSelectDetalle);
                
        currentItemsDetalle = contentTableDetalle.slice(itemOffsetDetalle, endOffsetDetalle);
        
        setTableDetalleRender(<tbody>
            {currentItemsDetalle.map((details, index) => {
            return <TableBodyDetalle details={details}  />
            })}
        </tbody>);
    }


    async function reloadTableDetalle() {
        setTableDetalleRender(
            <Loading text={loaderText} aditional={aditional} />
        );
        
        //const dataDetalle = await service.getDataTable(startDate, endDate, id, isWeek);
        
        /*if(dataDetalle.status===200 ){
            contentTableDetalle = dataDetalle.data[0].results_per_row;
            if(contentTableDetalle && contentTableDetalle.length !==0){
                contentTableDetalle.sort((a, b) => a.rowId - b.rowId)
                */
                setTableHeaderDetalle(<thead>
                    <tr>
                    {
                        props.isCuentaCorriente?
                        <th data-field="nroCuenta " style={{ textAlign: "center" }}>Nro. Cuenta</th>
                        :<th data-field="id " style={{ textAlign: "center" }}>Id</th>
                    }
                    <th data-field="statusCode" style={{ textAlign: "center" }}>  Cod. Estado </th>
                    {
                        props.isCuentaCorriente?
                        null:
                        <th data-field="status" style={{ textAlign: "center" }}> Estado </th>
                    }
                    <th data-field="detail" style={{ textAlign: "center" }}> Detalle </th>
                    </tr>
                </thead>);
                
                addData();
                totalPaginasDetalle = Math.ceil(contentTableDetalle.length / cantPaginasSelectDetalle);
                
                setPaginationFooterDetalle(
                    <TableFooterPaginationDetalle />
                );
                if (props.isCuentaCorriente){
                    setExportaDetalle(
                        <Row>
                            <Col s={12} m={12} className="input-field m0">
                                <ExcelFile
                                    element={<Button node="button" style={{ float: 'right' }} small className="indigo darken-4">Exportar en Excel</Button>}
                                    filename="Detalle-Actualizacion_Tasas">
                                    <ExcelSheet data={contentTableDetalle} name="Detalles">
                                        <ExcelColumn label="Nro. Cuenta" value="account_number" />
                                        <ExcelColumn label="Cod.Estado" value="status_code" />
                                        <ExcelColumn label="Detalle" value="message" />
                                    </ExcelSheet>
                                </ExcelFile>
                            </Col>
                        </Row>
                    )
                }else{
                    setExportaDetalle(null);
                }
                /*
            }else {
            toast.error("No se encuentra en proceso ningún registro.");
            setTableDetalleRender(null);
            }
        }else{
            //toast.error(dataDetalle.detail);
            setTableDetalleRender(null);
        }*/
    }

    
    async function changeActualizacionTasas (event) {
        props.setdetails([])
        props.setIsPantallaPrincipal(true)
    };

    const cantPaginasDetalle = [
        { value: 10, label: '10' },
        { value: 20, label: '20' },
        { value: 30, label: '30' }
    ]

    const onChangeCantPaginasDetalle = (event) => {
        setCantPaginasSelectDetalle(event.value)
        setPaginaActualDetalle(1);
    }
    
    
    useEffect(() => {
        itemOffsetDetalle=0;
        reloadTableDetalle();
    }, [paginaActualDetalle, cantPaginasSelectDetalle]);


    return (
        <React.Fragment>
          <Row>
            <Col s={2} m={2}>
              <Button node="button" small className="indigo darken-4" onClick={changeActualizacionTasas}>
                Retroceder
              </Button>
            </Col>
            <Col s={2} m={2} style={{ float: 'right' }} >
                <form data-testid="cantRegForm">
                    <label htmlFor="cantRegSelect"   className="active">Cantidad de registros</label>
                    <Select className="basic-single" name="cantRegSelect"   inputId="cantRegSelect" defaultValue={cantPaginasDetalle[0]}  options={cantPaginasDetalle} onChange={onChangeCantPaginasDetalle} />
                </form>
              </Col>
          </Row>
          <Row>
            <Table>
              {tableHeaderDetalle}
              {tableDetalleRender}
            </Table>
            {paginationFooterDetalle}
          </Row>
          {exportaDetalle}
        </React.Fragment>
      );
}