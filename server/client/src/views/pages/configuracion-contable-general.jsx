import React, { useState, useEffect, useRef } from "react";
import { CardHeader , Loading} from "../components/index";
import { Row, Col, Button, Collapsible, CollapsibleItem, Icon, Table } from 'react-materialize'
import Select from 'react-select'
import ReactPaginate from 'react-paginate';
import ConfiguracionContable from "./configuracion-contable";
import { toast } from 'react-toastify';



export default function ConfiguracionContableGeneral() {
  
    const title = "Configuración general"
    const description = "En esta sección podrá realizar la configuración general asociada a los moviminetos de CDTs desde Dominus"
    
    const [isDisabledButtonFilter, setIsDisabledButtonFilter] = useState(true);
    const [tableHeader, setTableHeader] = useState();
    const [tableRender, setTableRender] = useState();
    const [paginationFooter, setPaginationFooter] = useState();
    const [cantPaginasSelect, setCantPaginasSelect] = useState('10');
    const [isGeneral, setIsGeneral] = useState(true);
    //const [emisiones, setEmisiones] = useState([{ value: 0, label: 'Seleccione una emisión' }]);
    const [emision, setEmision] = useState('0');
    
    const [loaderText] = useState('');
    const [aditional] = useState('');

    const [selecTipoEmisiones, setSelecTipoEmisiones] = useState();

    
    var contentTable = []
    var currentItems = [];
    var itemOffset = 0;
    var totalPaginas = 0;
    var cantPaginasSelect2 = 10;
    //var emisionVar = '0';
    var emisiones = [{ value: 0, label: 'Seleccione una emisión' }]

    const SelecTipoEmisiones = (props) => {
        return(
            <Col s={8} m={3}>
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
              <Button value={props.taxaccountid} node="button" onClick={goToEditar} small className="indigo darken-4">
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
                //if(emisionVar==contenido.producttypedescription || emisionVar=='0'){
                if(emision==contenido.producttypedescription || emision=='0'){
                    return <TableBody 
                    taxaccountid={contenido.taxaccountid}
                    credittaxaccount={contenido.credittaxaccount}
                    debittaxaccount={contenido.debittaxaccount}
                    credittaxaccountinterest={contenido.credittaxaccountinterest}
                    debittaxaccountinterest={contenido.debittaxaccountinterest} 
                    producttypedescription={contenido.producttypedescription} 
                    producttypemaestrosunicos={contenido.producttypemaestrosunicos} />
                }
            })}
        </tbody>);
    };


    
    async function goToEditar(event) {
        console.log('Se habilita la función de editar')

    };

    async function goToBack (event) {
        console.log('Regresa a la pantalla inicial');
        setIsGeneral(false);
    };

    async function createConfiguration (event) {
        console.log('Se habilita la función para crear una nueva configuración');
    };


    const onChangeEmision = (event) => {
        //emisionVar = event.value;
        setEmision(event.value);
        console.log('Se cambia emision: '+ emision);
    }

    async function applyFilters() {
        cantPaginasSelect2 =cantPaginasSelect;
        console.log('Se applyFilters emision: '+ emision);
        await reloadTableMain(cantPaginasSelect,emision);
        setIsDisabledButtonFilter(false);
    }

    async function deleteFilters() {
        console.log('Borrando filtros');
        //emisionVar = '0';
        setEmision('0')
        cantPaginasSelect2 =cantPaginasSelect;
        await reloadTableMain(cantPaginasSelect,'0');
        setIsDisabledButtonFilter(true);
        setSelecTipoEmisiones(<SelecTipoEmisiones/>)
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
        console.log('emision change cant pag:'+emision)
        reloadTableMain(selectValue,emision);
        console.log('Termina change cant paginas')
    }

    async function reloadTableMain(cantReg, emisionReg) {
        console.log('Reload Table')
        //Invocará al servicio para que traiga los datos
        setTableRender(
            <Loading text={loaderText} aditional={aditional} />
        );
        const dataTable={
            "status":200,
            "data":[
                {
                    "updatedate": "2022-04-19T09:21:05-05",
                    "producttypemaestrosunicos": "2222",
                    "credittaxaccount": "22222211",
                    "credittaxaccountinterest": "2221",
                    "debittaxaccountinterest": "111111",
                    "debittaxaccount": "111111",
                    "producttypedescription": "EMISIONES MENOS DE 7 MESES",
                    "creationdate": "2022-04-19T09:18:19-05",
                    "taxaccountid": "7"
                },
                {
                    "producttypemaestrosunicos": "551",
                    "credittaxaccountinterest": "210710",
                    "credittaxaccount": "210710",
                    "debittaxaccountinterest": "510225",
                    "debittaxaccount": "111595999",
                    "producttypedescription": "EMITIDOS IGUAL A 6 MESES Y MENOR DE 12 MESES",
                    "taxaccountid": "3"
                },
                {
                    "producttypemaestrosunicos": "550",
                    "credittaxaccountinterest": "210705",
                    "credittaxaccount": "210705",
                    "debittaxaccountinterest": "510220",
                    "debittaxaccount": "111595999",
                    "producttypedescription": "EMISIONES MENOS DE 6 MESES",
                    "taxaccountid": "2"
                },
                {
                    "producttypemaestrosunicos": "552",
                    "credittaxaccountinterest": "210715",
                    "credittaxaccount": "210715",
                    "debittaxaccountinterest": "510230",
                    "debittaxaccount": "111595999",
                    "producttypedescription": "EMITIDOS IGUAL A 12 MESES Y MENOR DE 18 MESES",
                    "taxaccountid": "4"
                },
                {
                    "producttypemaestrosunicos": "553",
                    "credittaxaccountinterest": "210720",
                    "credittaxaccount": "251905030",
                    "debittaxaccountinterest": "213013",
                    "debittaxaccount": "210720",
                    "producttypedescription": "EMITIDOS IGUAL O SUPERIOR A 18 MESES",
                    "creationdate": "2022-04-11T19:08:39-05",
                    "taxaccountid": "6"
                },
                {
                    "producttypemaestrosunicos": "549",
                    "credittaxaccountinterest": "210705",
                    "credittaxaccount": "251905030",
                    "debittaxaccountinterest": "213013",
                    "debittaxaccount": "210705",
                    "producttypedescription": "NO APLICA",
                    "taxaccountid": "1"
                },
                {
                    "producttypemaestrosunicos": "553",
                    "credittaxaccountinterest": "210720",
                    "credittaxaccount": "210720",
                    "debittaxaccountinterest": "510230",
                    "debittaxaccount": "111595999",
                    "producttypedescription": "EMITIDOS IGUAL O SUPERIOR A 18 MESES",
                    "taxaccountid": "5"
                },
                {
                    "producttypemaestrosunicos": "553",
                    "credittaxaccountinterest": "210720",
                    "credittaxaccount": "210720",
                    "debittaxaccountinterest": "510231",
                    "debittaxaccount": "111595999",
                    "producttypedescription": "EMITIDOS IGUAL O SUPERIOR A 18 MESES",
                    "taxaccountid": "5"
                },
                {
                    "producttypemaestrosunicos": "553",
                    "credittaxaccountinterest": "210720",
                    "credittaxaccount": "210720",
                    "debittaxaccountinterest": "510232",
                    "debittaxaccount": "111595999",
                    "producttypedescription": "EMITIDOS IGUAL O SUPERIOR A 18 MESES",
                    "taxaccountid": "5"
                },
                {
                    "producttypemaestrosunicos": "553",
                    "credittaxaccountinterest": "210720",
                    "credittaxaccount": "210720",
                    "debittaxaccountinterest": "510233",
                    "debittaxaccount": "111595999",
                    "producttypedescription": "EMITIDOS IGUAL O SUPERIOR A 18 MESES",
                    "taxaccountid": "5"
                },
                {
                    "producttypemaestrosunicos": "553",
                    "credittaxaccountinterest": "210720",
                    "credittaxaccount": "210720",
                    "debittaxaccountinterest": "510234",
                    "debittaxaccount": "111595999",
                    "producttypedescription": "EMITIDOS IGUAL O SUPERIOR A 18 MESES",
                    "taxaccountid": "5"
                }
            ]
        } ;//[]
        // const dataTable = await service.getDataTable(startDate, endDate, consecutivoCargue, isWeek); SE INVOCARÁ A API
        if (dataTable.status === 200){
            console.log('ingresa 200')
            contentTable = dataTable.data;
            const endOffset = itemOffset +  parseInt(cantReg);
            currentItems = contentTable.slice(itemOffset, endOffset);
            totalPaginas = Math.ceil(contentTable.length / cantReg);
            if (totalPaginas !== 0) {
                setTableHeader(
                    <TableHeader />
                );
                var emisionObject;
                var emisionArrayObj = new Array();
                emisionObject = new Object();
                emisionObject.value = 0;
                emisionObject.label = "Seleccione una emisión";
                emisionArrayObj.push(emisionObject);
                console.log('emisionReg-reloadTable:'+emisionReg)
                setTableRender(<tbody>
                    {currentItems.map((contenido, index) => {

                        if (!emisionArrayObj.filter(function(e) { return e.label === contenido.producttypedescription; }).length > 0) {
                            emisionObject = new Object();
                            emisionObject.value = contenido.producttypedescription;
                            emisionObject.label = contenido.producttypedescription;
                            emisionArrayObj.push(emisionObject);
                        }
                        console.log('contenido-reloadTable:'+contenido)
                        
                        //console.log('emisionVar-reloadTable:'+emisionVar)
                        //if(emisionVar==contenido.producttypedescription || emisionVar=='0'){
                        if(emisionReg ==contenido.producttypedescription || emisionReg =='0'){
                            console.log('contenido.producttypedescription-reloadTable:'+contenido.producttypedescription)
                            return <TableBody 
                            taxaccountid={contenido.taxaccountid}
                            credittaxaccount={contenido.credittaxaccount}
                            debittaxaccount={contenido.debittaxaccount}
                            credittaxaccountinterest={contenido.credittaxaccountinterest}
                            debittaxaccountinterest={contenido.debittaxaccountinterest} 
                            producttypedescription={contenido.producttypedescription} 
                            producttypemaestrosunicos={contenido.producttypemaestrosunicos} />
                            
                        }
                    })}
                </tbody>);

                setPaginationFooter(
                    <TableFooterPagination />
                  );
                
                var jsonEmision = JSON.parse(JSON.stringify(emisionArrayObj))
                emisiones =jsonEmision
                //setEmisiones(jsonEmision)
                
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
        reloadTableMain(cantPaginasSelect,'0');
        document.title = title
        setSelecTipoEmisiones(<SelecTipoEmisiones/>)
    }, [,cantPaginasSelect]);


    const renderElement = () => {
        return isGeneral ? (
            <React.Fragment>
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
            </React.Fragment>
        ):(<ConfiguracionContable/>);
    }

    return renderElement();
}