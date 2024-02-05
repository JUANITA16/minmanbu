import React, { useState, useEffect } from "react";
import { CardHeader , Loading} from "../components/index";
import ModalConfiguracionContableGeneral from "./modal-configuracion-contable-general";
import { Row, Col, Button, Collapsible, CollapsibleItem, Icon, Table } from 'react-materialize'
import Select from 'react-select'
import ReactPaginate from 'react-paginate';
import ConfiguracionContable from "./configuracion-contable";
import { toast } from 'react-toastify';
import { ServerAPI } from "../../services/server";
import Dialog from '@mui/material/Dialog';
import ReactExport from 'react-export-excel';
import { useMsal } from "@azure/msal-react";
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import MuiSelect from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import ProductTypeFilter from '../components/ProductTypeFilter';

export default function ConfiguracionContableGeneral() {
  
    const service = new ServerAPI();

    
    const { instance } = useMsal();
    const { name }  = instance.getActiveAccount().idTokenClaims;

    const ExcelFile = ReactExport.ExcelFile;
    const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
    const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
  
    const title = "Configuración general"
    const description = "En esta sección podrá realizar la configuración general asociada a los movimientos de los productos administrados desde Dominus"
    
    const [isDisabledButtonFilter, setIsDisabledButtonFilter] = useState(true);
    const [tableHeader, setTableHeader] = useState();
    const [tableRender, setTableRender] = useState();
    const [paginationFooter, setPaginationFooter] = useState();
    const [cantPaginasSelect, setCantPaginasSelect] = useState('10');
    const [isGeneral, setIsGeneral] = useState(true);
    const [emisiones, setEmisiones] = useState([])
    const [loaderText] = useState('');
    const [aditional] = useState('');

    const [infoModal,setInfoModal]=useState()
    const [productsType,setProductsType]=useState([])
    const [productTypeFilter, setProductTypeFilter]=useState("")
    const [emisionTypeFilter, setEmisionTypeFilter]=useState("")

    const [openModal, setOpenModal] = React.useState(false);

    const [titleModal, setTitleModal]=useState('')
    const [descriptionModal, setDescriptionModal] = useState('')
    const [tipoProceso, setTipoProceso] = useState('')
    const [contentExcel, setContentExcel] = useState([])

    var contentTable = []
    var currentItems = [];
    var itemOffset = 0;
    var totalPaginas = 0;
    var cantPaginasSelect2 = 10;

    const TableHeader = () => {
        return (
          <thead>
            <tr>
              <th data-field="id" style={{ textAlign: "center" }} hidden={true}>id</th>
              <th data-field="tipoEmision" style={{ textAlign: "center"}}> Tipo emision</th>
              <th data-field="codTipoEmision" style={{ textAlign: "center" }}> Código tipo emisión</th>
              <th data-field="tipoProducto" style={{ textAlign: "center" }}> Tipo de producto</th>
            </tr>
          </thead>
        )
    };

    async function goToNuevo() {
        const infoModal = {
            taxaccountid : '',
            credittaxaccount : '',
            debittaxaccount : '',
            credittaxaccountinterest : '',
            debittaxaccountinterest : '',
            producttypedescription : '',
            producttypemaestrosunicos : ''
        }
        setTitleModal('Nuevo - Configuración general')
        setDescriptionModal('En esta sección podrá realizar la creación de un nuevo registro Configuración general')
        setInfoModal(infoModal)
        setOpenModal(true)
        setTipoProceso("Nuevo")
    };

    const TableBody = (props) => {

        async function goToEditarAux() {
            setTitleModal('Editar - Configuración general')
            setDescriptionModal('En esta sección podrá realizar la edición de los registros Configuración general')
            setInfoModal(props)
            setOpenModal(true)
            setTipoProceso("Editar")
        };

        return (
          <tr style={{ fontSize: "small" }} >
            <td style={{ textAlign: "center" }} hidden={true}>
              {props.taxaccountid}
            </td>
            <td style={{ minWidth: 10, maxWidth: 230, wordBreak:"break-all"}}>
              {props.producttypedescription}
            </td>
            <td style={{ minWidth: 10, maxWidth: 190, wordBreak:"break-all", textAlign: "center" }}>
              {props.producttypemaestrosunicos}
            </td>
            <td style={{ minWidth: 10, maxWidth: 190, wordBreak:"break-all", textAlign: "center" }}>
              {props.producttype}
            </td>
            <td style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Button value={props.taxaccountid} node="button" onClick={goToEditarAux} small className="indigo darken-4">
                Editar
              </Button>
            </td>
          </tr>
        )
    };

    const TableFooterPagination = () => {
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
            {currentItems.map((contenido) => {
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


    async function goToBack () {
        setIsGeneral(false);
    };


    const onChangeEmision = (event) => {
        setEmisionTypeFilter(event.target.value)
    }

    const onProductTypeFilterChange = (event) => {
        setProductTypeFilter(event.target.value)
    }

    async function applyFilters() {
        cantPaginasSelect2 =cantPaginasSelect;
        await reloadTableMain(cantPaginasSelect,emisionTypeFilter, productTypeFilter);
        setIsDisabledButtonFilter(false);
    }

    async function deleteFilters() {
        setEmisionTypeFilter('')
        setProductTypeFilter('')
        cantPaginasSelect2 =cantPaginasSelect;
        await reloadTableMain(cantPaginasSelect,'', '');
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


    async function reloadTableMain(cantReg, emisionReg, productTypeFilter) {
        setTableRender(
            <Loading text={loaderText} aditional={aditional} />
        );
        const dataTable =  await service.getAllTaxAProdT();

        if (dataTable.status === 200){
            var contentAll = await dataTable.data;
            if (contentAll.length > 0) {

                contentAll.forEach(element =>{
                    if (!emisiones.filter(function(e) { return e.label === element.producttypedescription; }).length > 0) {
                        const item ={ value: element.producttypedescription, label: element.producttypedescription}
                        setEmisiones((prev) => [
                            ...prev,
                            item
                        ])
                    }
                } );

                if(emisionReg ==='' & productTypeFilter===""){
                    contentTable = contentAll;
                }else{
                    contentTable = contentAll.filter(function (el) {
                        const conditionEmision = emisionReg === '' || el.producttypedescription === emisionReg;
                        const conditionProductType = productTypeFilter === '' || el.producttype === productTypeFilter;

                        return conditionEmision & conditionProductType;
                    });
                }
                
                const endOffset = itemOffset +  parseInt(cantReg);
                currentItems = contentTable.slice(itemOffset, endOffset);
                totalPaginas = Math.ceil(contentTable.length / cantReg);


                setTableHeader(
                    <TableHeader />
                );
                setContentExcel(currentItems);
                setTableRender(<tbody>
                    {currentItems.map((contenido) => {
                        return <TableBody 
                        taxaccountid={contenido.taxaccountid}
                        credittaxaccount={contenido.credittaxaccount}
                        debittaxaccount={contenido.debittaxaccount}
                        credittaxaccountinterest={contenido.credittaxaccountinterest}
                        debittaxaccountinterest={contenido.debittaxaccountinterest} 
                        producttypedescription={contenido.producttypedescription} 
                        producttypemaestrosunicos={contenido.producttypemaestrosunicos} 
                        producttype={contenido.producttype} 
                        
                        credittaxaccountemission={contenido.credittaxaccountemission} 
                        debittaxaccountemission={contenido.debittaxaccountemission} 
                        credittaxaccountinterestpaymet={contenido.credittaxaccountinterestpaymet} 
                        debittaxaccountinterestpaymet={contenido.debittaxaccountinterestpaymet} 
                        credittaxaccountcapitalpaymet={contenido.credittaxaccountcapitalpaymet} 
                        debittaxaccountcapitalpaymet={contenido.debittaxaccountcapitalpaymet} 
                        credittaxaccountgmf={contenido.credittaxaccountgmf} 
                        debittaxaccountgmf={contenido.debittaxaccountgmf} 
                        />
                        
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
    }

    const getProducts = async function () {
        try {
            var productAux =[]
            let resp = await service.getAllAndFiltersTypeProduct("", "")
            resp.forEach(element =>{
                const item ={ value: element.producttypedescription, label: element.producttypedescription, product_number:element.producttypemaestrosunicos, product_type:element.producttype}
                productAux.push(item)
            } );
            setProductsType(productAux)
        } catch (error) {
            alert("Error Cargando Productos")
        }
    }
    
    useEffect(() => {
        getProducts()
        reloadTableMain(cantPaginasSelect,emisionTypeFilter, productTypeFilter);
        document.title = title
    }, [cantPaginasSelect]);

    const renderElement = () => {
        return isGeneral ? (
            <React.Fragment>
                <Dialog
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                >
                    <ModalConfiguracionContableGeneral
                        title={titleModal} 
                        description={descriptionModal} 
                        reloadTableMain={reloadTableMain}
                        setOpenModal ={setOpenModal} 
                        emisiones ={productsType} 
                        info = {infoModal}
                        tipoProceso={tipoProceso}
                        cantPaginas ={cantPaginasSelect}
                        user ={name}
                        />
                </Dialog>
                <div>
                    <Row>
                        <Col s={6} m={2}>
                            <Button node="button" small className="indigo darken-4" onClick={goToBack}>
                                Retroceder
                            </Button>
                        </Col>
                        <Col s={6} m={2}>
                        <Button node="button" onClick={goToNuevo} small className="indigo darken-4">
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
                                    <Col s={12} m={4} l={4} xl={4}>
                                        <FormControl variant="standard" sx={{ marginTop: 2}} fullWidth>
                                            <InputLabel id="tipoEmisionSelectLabel">Tipo de emisión</InputLabel>
                                            <MuiSelect
                                                className="valid"
                                                labelId="tipoEmisionSelectLabel"
                                                name="producttypedescription"
                                                value={emisionTypeFilter}
                                                onChange={onChangeEmision}
                                                sx={{fontSize: 16, border: 'red 5px none'}}
                                                fullWidth
                                            >
                                                {
                                                    emisiones.map((item, index) => (
                                                        <MenuItem key={index} value={item.value}>
                                                            {item.value}
                                                        </MenuItem>
                                                    ))
                                                }
                                            </MuiSelect>
                                        </FormControl>
                                    </Col>
                                    <Col s={12} m={4} l={4} xl={4}>
                                        <ProductTypeFilter
                                            value={productTypeFilter}
                                            onChange={onProductTypeFilterChange}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                <Col s={12} m={3} className="input-field ">
                                    <Button node="button" small className="indigo darken-4" onClick={applyFilters}>
                                        Aplicar filtros
                                    </Button>
                                </Col>
                                <Col s={12} m={3} className="input-field ">
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
                            <form data-testid="cantRegForm">
                                <label htmlFor="cantRegSelect"  className="active">Cantidad de registros</label>
                                <Select name="cantRegSelect" inputId="cantRegSelect" className="basic-single" defaultValue={cantPaginas[0]} options={cantPaginas} onChange={onChangeCantPaginasGeneral} />
                            </form>
                        </Col>
                        <Col s={6} m={12}>
                            <Table>
                                {tableHeader}
                                {tableRender}
                            </Table>
                            {paginationFooter}
                        </Col>
                        
                    </Row>                    
                    <Row>
                        <Col s={12} m={12} className="input-field m0">
                        <ExcelFile
                            element={<Button node="button" style={{ float: 'right' }} small className="indigo darken-4">Exportar en Excel</Button>}
                            filename="ConfiguracionGeneral-SAP">
                            <ExcelSheet data={contentExcel} name="Resultados">
                                <ExcelColumn label="Id" value="taxaccountid" />
                                <ExcelColumn label="Cuenta débito interes" value="debittaxaccountinterest" />
                                <ExcelColumn label="Cuenta credito interes" value="credittaxaccountinterest" />
                                <ExcelColumn label="Cuenta débito retención" value="debittaxaccount" />
                                <ExcelColumn label="Cuenta crédito retención" value="credittaxaccount" />
                                <ExcelColumn label="Cuenta débito emisión" value="debittaxaccountemission" />
                                <ExcelColumn label="Cuenta crédito emisión" value="credittaxaccountemission" />
                                <ExcelColumn label="Cuenta débito pago interés " value="debittaxaccountinterestpaymet" />
                                <ExcelColumn label="Cuenta crédito pago interés" value="credittaxaccountinterestpaymet" />
                                <ExcelColumn label="Cuenta débito pago capital" value="debittaxaccountcapitalpaymet" />
                                <ExcelColumn label="Cuenta crédito pago capital" value="credittaxaccountcapitalpaymet" />
                                <ExcelColumn label="Cuenta débito GMF" value="debittaxaccountgmf" />
                                <ExcelColumn label="Cuenta crédito GMF" value="credittaxaccountgmf" />
                                <ExcelColumn label="Tipo emisión" value="producttypedescription" />
                                <ExcelColumn label="Codigo tipo emisión" value="producttypemaestrosunicos"/>
                                <ExcelColumn label="Tipo de producto" value="producttype"/>
                                <ExcelColumn label="Fecha de creación" value="creationdate" />
                                <ExcelColumn label="Fecha de actualización" value="updatedate" />
                            </ExcelSheet>
                        </ExcelFile>
                        </Col>
                    </Row>
                </div>
            </React.Fragment>
        ):(<ConfiguracionContable/>);
    }

    return renderElement();
}