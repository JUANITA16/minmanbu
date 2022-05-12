import { Fragment } from "react";
import { Icon, Table } from "react-materialize";
import ReactPaginate from "react-paginate";


function MyTable({tableData}) {
  
  const handlePageClick = function (event) {
    
  }


  return (
  <Fragment>
    <Table>
      <thead>
        <tr>
          <th>Número de Cuenta</th>
          <th>Número de Cuenta cosif</th>
          <th>Centro de Costos</th>
        </tr>
      </thead>
      <tbody>
        {[
          tableData.map( (data) => {
            return (
              <tr key={data.accountid}>
                <td>{data.accounting_account}</td>
                <td>{data.cosif}</td>
                <td>{data.costcenteraccounting}</td>
             </tr>)
          }
          )]
        }
      </tbody>
    </Table> 
      <div style={{display: "flex", alignItems: "center", alignContent: "center", justifyContent: "center"}}>
        <ReactPaginate
          previousLabel={<Icon>chevron_left</Icon>}
          nextLabel={<Icon>chevron_right</Icon>}
          breakLabel="..."
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={5}
          renderOnZeroPageCount={null}
          containerClassName={"pagination"}
        />
      </div>
  </Fragment>
  
  )

}

export default MyTable