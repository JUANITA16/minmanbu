import { CircularProgress } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { ServerAPI } from "../../services/server";
import { Button, Col, Icon, Row, Table } from "react-materialize";
import ReactPaginate from "react-paginate";
import Select from 'react-select'
import { showToast } from "../../helpers/utils";

function SapTable({tableData}) {

  const service = new ServerAPI()
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
  
  const handleDownload = async function(event){
    event.preventDefault();
    let sapFileUrl = ""

    try {
      sapFileUrl = await service.getSapURL(
        JSON.parse(event.target.value).filename
        )
      if (sapFileUrl.url == "") {
        showToast(sapFileUrl.message)
      } else {
        showToast("Descargando el archivo.")
        window.open(sapFileUrl.url)
      }
    } catch (error) {
      console.error(error);
      
      return resp;
    }
    console.log("Descargando el Archivo...");
  }
  function download(fileName, contentFile) {
    console.log('fileName download:' + fileName);
    const element = document.createElement("a");
    const file = new Blob([contentFile], { type: 'text/plain;charset-utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

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
      settotalPages(Math.ceil(tableData.length/maxResults));
      setVisibleData(tableData.slice(0, maxResults));
      if (tableData.length >0 ) {
        setIsloading(false);
      } else {
        setIsloading(true)
      }
    } catch (error) {
      console.error(error);
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
            <td>{data.dateProcess}</td>
            <td>{data.filename}</td>
            <td>{data.from_date}</td>
            <td>{data.file_status}</td>
            <td>{data.user_name}</td>
            <td><Button value={JSON.stringify({
                  filename: data.filename
                })}
                  small onClick={handleDownload} className="indigo darken-4">
              Descargar</Button>
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
            <th>Fecha generación</th>
            <th>Nombre del Archivo</th>
            <th>Periodo Generación</th>
            <th>Estado Generación</th>
            <th>Usuario</th>
            <th>Descarga</th>
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

export default SapTable