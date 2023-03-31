import { CircularProgress, Modal, Box } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { Button, Col, Icon, Row, Table } from "react-materialize";
import ReactPaginate from "react-paginate";
import Select from 'react-select'
// import ModalConfiguracionHomologacion from "../pages/ModalHomologacion";

function MyTable({tableData, setEdits}) {
  
  const [maxResults, setmaxResults] = useState(10);
  const [visibleData, setVisibleData] = useState([]);
  const [totalPages, settotalPages] = useState(1);
  const [isloading, setIsloading] = useState(true);
  const [tableBody, setTableBody] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [infoModal, setInfoModal] = useState({
//     id: "",
//     producttypedescription: "", 
//     cosif: "", 
//     user: ""
//   })
//   const modalTitle = "Editar - Configuración homologación"
//   const modalDescription = "En esta sección podrá realizar la edición de los registros Configuración homologación"
//   const tipoProceso = "Editar"


  const totalResults = [
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 20, label: '20' }
  ];

  const handlePageClick = function (event) {
    // Handles the page changes sets the data
    let page = event.selected;
    setVisibleData(tableData.slice(page*maxResults, maxResults*(page + 1)))
  };
  
  const handleEdit = function (event){
    // setInfoModal(JSON.parse(event.target.value))
    // setOpen(true);
  };

  const renderLoading = function (isloading){
    if (isloading) {
      return <div className="center-div"><CircularProgress /></div>
    } else {
      return <p></p>
    }
  };



  useEffect(function () {
    //Calculate the total of pages using ceil method
    if (Array.isArray(tableData)) {
      settotalPages(Math.ceil(tableData.length/maxResults));
      setVisibleData(tableData.slice(0, maxResults));
    } else {
      settotalPages(1)
      setVisibleData(["Empty"])
    }
    if (tableData.length >0 ) {
      setIsloading(false);
    } else {
      setIsloading(true)
    }
  }, [maxResults, tableData]);

  useEffect(function () {
    if (visibleData[0]==='Empty') {
      setTableBody(
        <tr key={"Empty"}>
          <td> No se encontraron registros.</td>
        </tr>);
    } else {
      setTableBody(visibleData.map( (data) => {
        return (
          <tr key={data.id}>
            <td>{data.producttypedescription}</td>
            <td>{data.producttypemaestrosunicos}</td>
            <td><Button value={JSON.stringify({
                id: data.id,
                producttypedescription: data.producttypedescription, 
                producttypemaestrosunicos: data.producttypemaestrosunicos, 
                user: 'user-test'
                })}
              small onClick={handleEdit} className="indigo darken-4">
              Editar</Button>
            </td>
        </tr>)}));
    }
  }, [visibleData]);


  return (
  <Fragment>
     <Row>
       <Col m={3} s={8}>
        <label className="active">Cantidad de registros</label>
        <Select 
          className="basic-single"  options={totalResults} 
          defaultValue={totalResults[1]} onChange={(event)=>{setmaxResults(event.value)}} />
       </Col>
     </Row>
    <div>
    {/* <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      >
        <Box className="modal-style" >
          <ModalConfiguracionHomologacion
            title={modalTitle} 
            description={modalDescription} 
            setEdits={setEdits}
            setOpen={setOpen} 
            info={infoModal}
            tipoProceso={tipoProceso}
            />
        </Box>
      </Modal> */}
      <Table>
        <thead>
          <tr>
            <th>Tipo emisión</th>
            <th>Código tipo emisión</th>
          </tr>
        </thead>
        <tbody>
          {tableBody}     
        </tbody>
      </Table> 
    </div>
      {renderLoading(isloading)}
      <div style={{display: "flex", alignItems: "center", alignContent: "center", justifyContent: "center"}}>
        <ReactPaginate
          previousLabel={<Icon>chevron_left</Icon>}
          nextLabel={<Icon>chevron_right</Icon>}
          breakLabel="..."
          onPageChange={handlePageClick}
          pageRangeDisplayed={2}
          pageCount={totalPages}
          renderOnZeroPageCount={null}
          containerClassName={"pagination"}
        />
      </div>
  </Fragment>
  
  )

}

export default MyTable