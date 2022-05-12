import React, { useState, useEffect, useRef } from "react";
import { CardHeader , Loading} from "../components/index";
import EditarTabla from "../pages/editar-tabla";
// import ModalHeader from "../components/Modal";
// import ModalBody from "../components/Modal";
// import ModalFooter from "../components/Modal";
import { Row, Col, Button, Collapsible, CollapsibleItem, Icon, Table } from 'react-materialize'
import Select from 'react-select'
import ReactPaginate from 'react-paginate';
import ConfiguracionContable from "./configuracion-contable";
import { toast } from 'react-toastify';
import { ServerAPI } from "../../services/server";


const service = new ServerAPI();

export default function ConfiguracionContableGeneral() {
  
    const title = "Configuración general"
    const description = "En esta sección podrá realizar la configuración general asociada a los moviminetos de CDTs desde Dominus"
    
    const [emision, setEmision] = useState('CDT');
    const [isDisabledButtonFilter, setIsDisabledButtonFilter] = useState(true);
    const [tableHeader, setTableHeader] = useState();
    const [tableRender, setTableRender] = useState();
    const [paginationFooter, setPaginationFooter] = useState();
    const [cantPaginasSelect, setCantPaginasSelect] = useState('10');
    const [isGeneral, setIsGeneral] = useState(true);
    const [emisiones, setEmisiones] = useState([]);
    
    const [loaderText] = useState('');
    const [aditional] = useState('');

    const [showModal,setShowModal]=useState(false)
    const [infoModal,setInfoModal]=useState()

    var contentTable = []
    var currentItems = [];
    var itemOffset = 0;
    var totalPaginas = 0;
    var cantPaginasSelect2 = 10;


    const TableHeader = (props) => {
        return (
          <thead>
            <tr>
              <th data-field="id" style={{ textAlign: "center" }} hidden={true}>id</th>
              <th data-field="cuentaCredito" style={{ textAlign: "center" }}>Cuenta crédito</th>
              <th data-field="cuentaDebitot" style={{ textAlign: "center"}} >Cuenta débito</th>
              <th data-field="ccInteres" style={{ textAlign: "center" }} >Cuenta crédito Interés</th>
              <th data-field="cdInteres" style={{ textAlign: "center" }}>Cuenta débito Interés</th>
              <th data-field="tipoEmision" style={{ textAlign: "center"}}> Tipo emision</th>
              <th data-field="codTipoEmision" style={{ textAlign: "center" }}> Código tipo emisión  </th>
            </tr>
          </thead>
        )
    };

    const TableBody = (props) => {

        async function goToEditarAux(event) {
            console.log('Se habilita la función de editar')
            console.log(showModal)
            setInfoModal(props)
            console.log(props)
            setShowModal(true)
        };

        return (
          <tr style={{ fontSize: "small" }} >
            <td style={{ textAlign: "center" }} hidden={true}>
              {props.taxaccountid}
            </td>
            <td style={{ minWidth: 10, maxWidth: 200, wordBreak:"break-all", textAlign: "center" }}>
              {props.credittaxaccount}
            </td>
            <td style={{ minWidth: 10, maxWidth: 200, wordBreak:"break-all", textAlign: "center" }}>
              {props.debittaxaccount}
            </td>
            <td style={{ minWidth: 10, maxWidth: 200, wordBreak:"break-all", textAlign: "center" }}>
              {props.credittaxaccountinterest}
            </td>
            <td style={{ minWidth: 10, maxWidth: 200, wordBreak:"break-all", textAlign: "center" }}>
              {props.debittaxaccountinterest}
            </td>
            <td style={{ minWidth: 10, maxWidth: 200, wordBreak:"break-all"}}>
              {props.producttypedescription}
            </td>
            <td style={{ minWidth: 10, maxWidth: 200, wordBreak:"break-all", textAlign: "center" }}>
              {props.producttypemaestrosunicos}
            </td>
            <td style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Button value={props.taxaccountid} node="button" onClick={goToEditarAux} small className="indigo darken-4">
                Editar
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

    // Invoke when user click to request another page.
    async function handlePageClick(event){
        const newOffset = (event.selected * cantPaginasSelect2) % contentTable.length;
        
        itemOffset = newOffset;
        
        const endOffset = parseInt(itemOffset) + parseInt(cantPaginasSelect2);
        
        currentItems = contentTable.slice(itemOffset, endOffset);

        setTableRender(<tbody>
            {currentItems.map((contenido, index) => {
                return <TableBody 
                taxaccountid={contenido.taxaccountid}
                credittaxaccount={contenido.credittaxaccount}
                debittaxaccount={contenido.debittaxaccount}
                credittaxaccountinterest={contenido.credittaxaccountinterest}
                debittaxaccountinterest={contenido.debittaxaccountinterest} 
                producttypedescription={contenido.producttypedescription} 
                producttypemaestrosunicos={contenido.producttypemaestrosunicos} />
            })}
        </tbody>);
    };


    async function goToBack (event) {
        console.log('Regresa a la pantalla inicial');
        setIsGeneral(false);
    };

    async function createConfiguration (event) {
        console.log('Se habilita la función para crear una nueva configuración');
    };


    const onChangeEmision = (event) => {
        const selectValue = event.value;
        if (selectValue === '1') {
            setEmision('Emsion 1');

        } else if (selectValue === '2') {
            setEmision('Emision 2');

        } else if (selectValue === '3') {
            setEmision('Emision 3');
        }
    }

    async function applyFilters() {
        console.log('Aplicando filtros');
        cantPaginasSelect2 =cantPaginasSelect;
        await reloadTableMain(cantPaginasSelect);
        setIsDisabledButtonFilter(false);
    }

    async function deleteFilters() {
        console.log('Borrando filtros');
        setEmision('');
        cantPaginasSelect2 =cantPaginasSelect;
        await reloadTableMain(cantPaginasSelect);
        setIsDisabledButtonFilter(true);
    }

    const cantPaginas = [
        { value: 10, label: '10' },
        { value: 20, label: '20' },
        { value: 30, label: '30' }
    ]

    
    const onChangeCantPaginas = (event) => {
        const selectValue = event.value;
    
        setCantPaginasSelect(selectValue)
        cantPaginasSelect2 = selectValue;
        reloadTableMain(selectValue);
    }

    async function reloadTableMain(cantReg) {
        console.log('Reload Table')
        //Invocará al servicio para que traiga los datos
        setTableRender(
            <Loading text={loaderText} aditional={aditional} />
        );
        
        const dataTable =  await service.getAllDataTableContable().then(response => {
            return response;
            }
          );

        if (dataTable.status === 200){
            // console.log('ingresa 200')
            contentTable = dataTable.data;
            // console.log(contentTable)
            const endOffset = itemOffset +  parseInt(cantReg);
            currentItems = contentTable.slice(itemOffset, endOffset);
            totalPaginas = Math.ceil(contentTable.length / cantReg);
            if (totalPaginas !== 0) {
                setTableHeader(
                    <TableHeader />
                );
                setTableRender(<tbody>
                    {currentItems.map((contenido, index) => {
                        return <TableBody 
                        taxaccountid={contenido.taxaccountid}
                        credittaxaccount={contenido.credittaxaccount}
                        debittaxaccount={contenido.debittaxaccount}
                        credittaxaccountinterest={contenido.credittaxaccountinterest}
                        debittaxaccountinterest={contenido.debittaxaccountinterest} 
                        producttypedescription={contenido.producttypedescription} 
                        producttypemaestrosunicos={contenido.producttypemaestrosunicos} />
                    })}
                </tbody>);

                setPaginationFooter(
                    <TableFooterPagination />
                  );
            }else{
                toast.error('No se encontraron registros.');
                setTableRender(null);
            }
        }else{
            toast.error(dataTable.detail);
            setTableRender(null);
        }
        var emi=[]
        for (var i = 0; i < contentTable.length; i++) {
            console.log(contentTable[i].producttypedescription)
            const item ={ value: i, label: contentTable[i].producttypedescription}
            emi.push(item)
        }
        setEmisiones(emi)
    }

    
    useEffect(() => {
        reloadTableMain(cantPaginasSelect);
        document.title = title
    }, [,cantPaginasSelect]);


    const renderElement = () => {
        return isGeneral ? (
            <React.Fragment>
                {showModal ? 
                <EditarTabla info = {infoModal} show={setShowModal}/>:
                <div>
                    <Row>
                        <Col s={2} m={2}>
                            <Button node="button" small className="indigo darken-4" onClick={goToBack}>
                                Retroceder
                            </Button>
                        </Col>
                        <Col s={2} m={2}>
                            <Button node="button" small className="indigo darken-4" onClick={createConfiguration}>
                                Nuevo
                            </Button>
                        </Col>
                    </Row>
                    <CardHeader title={title} description={description} />
                    <Row>
                        <Collapsible accordion={false}>
                            <CollapsibleItem
                            expanded={false}
                            header="Filtros"
                            icon={<Icon>filter_list</Icon>}
                            node="div"
                            >
                                <Row>
                                    <Col s={8} m={3}>
                                        <label className="active">Tipo de emisión</label>
                                        <Select className="basic-single" defaultValue={emisiones[0]} options={emisiones} onChange={onChangeEmision} />
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
                </div>
                }
            </React.Fragment>
        ):(<ConfiguracionContable/>);
    }

    return renderElement();
}