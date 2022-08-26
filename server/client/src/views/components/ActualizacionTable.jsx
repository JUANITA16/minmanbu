import { CircularProgress, Modal, Box } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { Button, Col, Icon, Row, Table } from "react-materialize";
import ReactPaginate from "react-paginate";
import Select from 'react-select'

function ActTable(props) {
  let tableData = [
    {
      update_id:"",
      consecutive : "",
      exec_date :"",
      user: ""
    }
  ];
  const [maxResults, setmaxResults] = useState(10);
  const [visibleData, setVisibleData] = useState([]);
  const [totalPages, settotalPages] = useState(1);
  const [isloading, setIsloading] = useState(true);
  const [tableBody, setTableBody] = useState([]);
  const [open, setOpen] = useState(false);
  const [infoModal, setInfoModal] = useState({
    consecutive: "",
    accounting_account: "", 
    cosif: "", 
    costcenteraccounting: ""
  })
  const modalTitle = "Editar - Configuración homologación"
  const modalDescription = "En esta sección podrá realizar la edición de los registros Configuración homologación"
  const tipoProceso = "Editar"

  // const modalStyle = {
  //   position: 'absolute',
  //   top: '50%',
  //   left: '50%',
  //   transform: 'translate(-50%, -50%)',
  //   width: '50%',
  //   bgcolor: 'background.paper',
  //   boxShadow: 24,
  //   p: 4,
  // };


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
  
  const handleDetails = function (event){
    props.setIsPantallaPrincipal(false)
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
    settotalPages(Math.ceil(tableData.length/maxResults));
    setVisibleData(tableData.slice(0, maxResults));
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
          <tr key={data.update_id}>
            <td>{data.consecutive}</td>
            <td>{data.exec_date}</td>
            <td>{data.user}</td>
            <td><Button small onClick={handleDetails} className="indigo darken-4">
              Detalles</Button>
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
    {/* Table generation */}
    <div>
  
      <Table>
        <thead>
          <tr>
            <th>Consecutivo </th>
            <th>Fecha ejecución</th>
            <th>Usuario</th>
            <th>Detalles</th>
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

export default ActTable