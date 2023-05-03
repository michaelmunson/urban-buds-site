import { Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import React, {useEffect, useState} from 'react';


export default function DatabaseTable({table,data,checkedRows,setCheckedRows,columns,handlePreUpdate}) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };
    const handleCheckRow = (event) => {
      const rowID = event.target.parentElement.parentElement.parentElement.childNodes[1].innerHTML;
      if (event.target.checked){
        const checked = [...checkedRows, rowID];
        setCheckedRows(checked);
      }
      else {
        const checked = checkedRows.filter(row => row !== rowID);
        setCheckedRows(checked);
      }
    }

  
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden', border:"1px solid black"}}>
        <TableContainer sx={{ maxHeight: '70vh' }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                {columns[table].map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row,i) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={`key${i}`} 
                      onClick={e => {
                        if (e.detail === 2){
                          handlePreUpdate(row);
                        }
                      }}
                    >
                      <TableCell>
                        <Checkbox onChange={handleCheckRow}/>
                      </TableCell>
                      {columns[table].map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'number'
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    );
}