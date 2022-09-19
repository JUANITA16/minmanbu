import { CircularProgress, Modal, Box } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { Button, Col, Icon, Row, Table } from "react-materialize";
import ReactPaginate from "react-paginate";
import Select from 'react-select'
import { showToast } from "../../helpers/utils";

function ActTable({setIsPantallaPrincipal, tableData}) {
  const [maxResults, setmaxResults] = useState(10);
  const [visibleData, setVisibleData] = useState([]);
  const [totalPages, settotalPages] = useState(1);
  const [isloading, setIsloading] = useState(true);
  const [tableBody, setTableBody] = useState([]);


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
    setIsPantallaPrincipal(false)
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
    try {
      if (Array.isArray(tableData)) {
        settotalPages(Math.ceil(tableData.length/maxResults));
        setVisibleData(tableData.slice(0, maxResults));
      } else {
        settotalPages(1);
        setVisibleData(["Empty"]);
      }
      setVisibleData(tableData.slice(0, maxResults));
      if (tableData.length >0 ) {
        setIsloading(false);
      } else {
        setIsloading(true)
      }
    } catch (error) {
      showToast("Error cargando la tabla.")
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
            <td>{data.id}</td>
            <td>{data.date_process}</td>
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