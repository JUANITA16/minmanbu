import React, { useState, useEffect } from "react";
import { CardHeader , Loading} from "../components/index";
import EditarTabla from "../pages/editar-tabla";
import { Row, Col, Button, Collapsible, CollapsibleItem, Icon, Table } from 'react-materialize'
import Select from 'react-select'
import ReactPaginate from 'react-paginate';
import ConfiguracionContable from "./configuracion-contable";
import { toast } from 'react-toastify';
import { ServerAPI } from "../../services/server";
import ModalConfiguracionContableGeneral from './modal-configuracion-contable-general'


const service = new ServerAPI();

export default function ConfiguracionContableGeneral() {
  
    const title = "Configuración general"
    const description = "En esta sección podrá realizar la configuración general asociada a los movimientos de CDTs desde Dominus"
    
    const [isDisabledButtonFilter, setIsDisabledButtonFilter] = useState(true);
    const [tableHeader, setTableHeader] = useState();
    const [tableRender, setTableRender] = useState();
    const [paginationFooter, setPaginationFooter] = useState();
    const [cantPaginasSelect, setCantPaginasSelect] = useState('10');
    const [isGeneral, setIsGeneral] = useState(true);
    const [emision, setEmision] = useState('0');
    const [loaderText] = useState('');
    const [aditional] = useState('');
    const [selecTipoEmisiones, setSelecTipoEmisiones] = useState();
    const [showEditComponent,setShowEditComponent]=useState(false)

    const [infoModal,setInfoModal]=useState()
    const [emisionEditComponent,setEmisionEditComponent]=useState()

    const [botonNuevo,setBotonNuevo]=useState()
    const [saveModal,setSaveModal]=useState()



    var contentTable = []
    var currentItems = [];
    var itemOffset = 0;
    var totalPaginas = 0;
    var cantPaginasSelect2 = 10;
    var emisiones = [{ value: 0, label: 'Seleccione una emisión' }]

    const SelecTipoEmisiones = (props) => {
        return(
            <Col s={12} m={3}>
                <label className="active">Tipo de emisión</label>
                <Select className="basic-single" defaultValue={emisiones[0]} options={emisiones} onChange={onChangeEmision} />
            </Col>
        )
    }

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
            setInfoModal(props)
            setEmisionEditComponent(emisiones)
            setShowEditComponent(true)
        };

        return (
          <tr style={{ fontSize: "small" }} >
            <td style={{ textAlign: "center" }} hidden={true}>
              {props.taxaccountid}
            </td>
            <td style={{ minWidth: 10, maxWidth: 190, wordBreak:"break-all", textAlign: "center" }}>
              {props.credittaxaccount}
            </td>
            <td style={{ minWidth: 10, maxWidth: 190, wordBreak:"break-all", textAlign: "center" }}>
              {props.debittaxaccount}
            </td>
            <td style={{ minWidth: 10, maxWidth: 190, wordBreak:"break-all", textAlign: "center" }}>
              {props.credittaxaccountinterest}
            </td>
            <td style={{ minWidth: 10, maxWidth: 190, wordBreak:"break-all", textAlign: "center" }}>
              {props.debittaxaccountinterest}
            </td>
            <td style={{ minWidth: 10, maxWidth: 230, wordBreak:"break-all"}}>
              {props.producttypedescription}
            </td>
            <td style={{ minWidth: 10, maxWidth: 190, wordBreak:"break-all", textAlign: "center" }}>
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
        setIsGeneral(false);
    };


    const onChangeEmision = (event) => {
        setEmision(event.value);
    }

    async function applyFilters() {
        cantPaginasSelect2 =cantPaginasSelect;
        await reloadTableMain(cantPaginasSelect,emision);
        setIsDisabledButtonFilter(false);
    }

    async function deleteFilters() {
        setEmision('0')
        cantPaginasSelect2 =cantPaginasSelect;
        await reloadTableMain(cantPaginasSelect,'0');
        setIsDisabledButtonFilter(true);
    }

    const cantPaginas = [
        { value: 10, label: '10' },
        { value: 20, label: '20' },
        { value: 30, label: '30' }
    ]

    
    const onChangeCantPaginasGeneral = (event) => {
        const selectValue = event.value;
    
        setCantPaginasSelect(selectValue)
        cantPaginasSelect2 = selectValue;
    }

    async function actualizarBotonNuevo(){
        setBotonNuevo(
            <ModalConfiguracionContableGeneral
                tipoBoton={"Registrar"}
                emisiones={emisiones} 
                title = {"Nuevo - Configuración general"}
                taxaccountid={""}
                credittaxaccount={""}
                debittaxaccount = {""}
                credittaxaccountinterest = {""}
                setDebittaxaccountinterest = {""}
                producttypedescription = {"0"}
                producttypemaestrosunicos = {""}
                setSave={setSaveModal}
            />);
    
    }
    async function reloadTableMain(cantReg, emisionReg) {
        actualizarBotonNuevo();
        setTableRender(
            <Loading text={loaderText} aditional={aditional} />
        );
        if(emisionReg ==='0'){
            setSelecTipoEmisiones(<SelecTipoEmisiones/>)
        }
        const dataTable =  await service.getAllTaxAProdT().then(response => {
            return response;
            }
          );

        if (dataTable.status === 200){
            var contentAll =dataTable.data;
            if (contentAll.length > 0) {

                contentAll.forEach(element =>{
                    if (!emisiones.filter(function(e) { return e.label === element.producttypedescription; }).length > 0) {
                        const item ={ value: element.producttypedescription, label: element.producttypedescription}
                        emisiones.push(item)
                    }
                } );
                
                if(emisionReg ==='0'){
                    contentTable = contentAll;
                }else{
                    contentTable = contentAll.filter(function (el) {
                        return el.producttypedescription === emisionReg 
                    });
                }
                
                const endOffset = itemOffset +  parseInt(cantReg);
                currentItems = contentTable.slice(itemOffset, endOffset);
                totalPaginas = Math.ceil(contentTable.length / cantReg);


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
                
                if(emisionReg ==='0'){
                    setSelecTipoEmisiones(<SelecTipoEmisiones/>)
                }
                actualizarBotonNuevo();
                
                
            }else{
                toast.error('No se encontraron registros.');
                setTableRender(null);
            }
        }else{
            toast.error(dataTable.detail);
            setTableRender(null);
        }
    }

    
    useEffect(() => {
        reloadTableMain(cantPaginasSelect,emision);
        document.title = title
    }, [saveModal,cantPaginasSelect]);


    const renderElement = () => {
        return isGeneral ? (
            <React.Fragment>
                {showEditComponent ? 
                <EditarTabla emisiones ={emisionEditComponent} info = {infoModal} show={setShowEditComponent}/>:
                <div>
                    <Row>
                        <Col s={6} m={2}>
                            <Button node="button" small className="indigo darken-4" onClick={goToBack}>
                                Retroceder
                            </Button>
                        </Col>
                        <Col s={6} m={2}>
                            {botonNuevo}
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
                                    {selecTipoEmisiones}
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
                            <Select className="basic-single" defaultValue={cantPaginas[0]} options={cantPaginas} onChange={onChangeCantPaginasGeneral} />
                        </Col>
                        <Col s={6} m={12}>
                            <Table>
                                {tableHeader}
                                {tableRender}
                            </Table>
                            {paginationFooter}
                        </Col>
                        
                    </Row>
                </div>
                }
            </React.Fragment>
        ):(<ConfiguracionContable/>);
    }

    return renderElement();
}