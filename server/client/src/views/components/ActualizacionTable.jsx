import { CircularProgress } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { Button, Col, Icon, Row, Table } from "react-materialize";
import ReactPaginate from "react-paginate";
import Select from 'react-select';
import { showToast } from "../../helpers/utils";

const DEFAULT_MAX_RESULTS = 10;
function ActTable({setIsPantallaPrincipal, tableData, setdetails,isCuentaCorriente,getdbDataRatesUpdate}) {
  const [maxResults, setMaxResults] = useState(DEFAULT_MAX_RESULTS);
  const [visibleData, setVisibleData] = useState([]);
  const [totalPages, settotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [tableBody, setTableBody] = useState([]);


  const totalResults = [
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 20, label: '20' }
  ];

  const handlePageClick = (event)=> {
    // Handles the page changes sets the data
    const page = event.selected;
    setVisibleData(tableData.slice(page*maxResults, maxResults*(page + 1)));
  };


  const handleDetails = async (event ) => {
    event.preventDefault();
    const valueJson =JSON.parse(event.target.value);
    if (isCuentaCorriente) {
      const splitDateProcess = valueJson.date_process.split('T');
      const items  = await getdbDataRatesUpdate(splitDateProcess[0], valueJson.type, "", "");
      setdetails(items);
    }else{
      setdetails(prevVal => [...prevVal, valueJson]
      );
    }
    setIsPantallaPrincipal(false);

  };

  const renderLoading = () => {
    if (isLoading) {
      return <div className="center-div"><CircularProgress /></div>;
    } else {
      return <p></p>;
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

  useEffect(() => {
    if (visibleData[0]==='Empty') {
      setTableBody(
        <tr key="Empty">
          <td> No se encontraron registros.</td>
        </tr>);
    } else if (visibleData[0]==='Reload') {
      setTableBody([]);
      setIsLoading(true);
    } else {
      setTableBody(visibleData.map(data => {
        const date_process =  isCuentaCorriente ? data.execution_date : data.date_process;
        const my_id = isCuentaCorriente ? data.id : data.consecutive;


        return (
          <tr key={my_id}>
            <td>{my_id}</td>

            <td>{date_process}</td>

            {
              isCuentaCorriente ? <td>{data.user_name}</td> : <td>{data.user}</td>
            }
            {
              isCuentaCorriente && <td>{data.status}</td>
            }
            <td><Button small onClick={handleDetails}
              className="indigo darken-4"
              value={JSON.stringify({
                id: my_id,
                type: data.type,
                status_code: data.status_code,
                status: data.status,
                detail: data.detailed,
                date_process: date_process
              })} >
              Detalles</Button>
            </td>
          </tr>)}));
    }
  }, [visibleData,isCuentaCorriente]);


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
              {
                isCuentaCorriente && <th>Estado de Ejecución</th>
              }
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

  );

}

export default ActTable;