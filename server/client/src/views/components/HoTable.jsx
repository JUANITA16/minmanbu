import { CircularProgress } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { Button, Col, Icon, Row, Table } from "react-materialize";
import ReactPaginate from "react-paginate";
import Select from 'react-select'

function MyTable({tableData}) {
  
  const [maxResults, setmaxResults] = useState(10);
  const [visibleData, setVisibleData] = useState([]);
  const [totalPages, settotalPages] = useState(1);
  const [isloading, setIsloading] = useState(true);
  const [tableBody, setTableBody] = useState([])

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
    console.log("Edit element")
  };

  const renderLoading = function (isloading){
    if (isloading) {
      return <div className="center-div"><CircularProgress /></div>
    } else {
      return <p></p>
    }
  }

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
    setTableBody(visibleData.map( (data) => {
      return (
        <tr key={data.accounting_account}>
          <td>{data.accounting_account}</td>
          <td>{data.cosif}</td>
          <td>{data.costcenteraccounting}</td>
          <td><Button small onClick={handleEdit} className="indigo darken-4">
            Editar</Button>
          </td>
      </tr>)})
    );

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
            <th>Número de Cuenta</th>
            <th>Número de Cuenta cosif</th>
            <th>Centro de Costos</th>
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