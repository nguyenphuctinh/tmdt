import * as React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

export default function CartTable({ rows }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        <TableBody>
          <TableRow>
            <TableCell component="th" scope="row">
              Sản phẩm
            </TableCell>
            <TableCell component="th" scope="row">
              Giá
            </TableCell>
            <TableCell component="th" scope="row">
              Số lượng
            </TableCell>
            <TableCell component="th" scope="row">
              Tổng
            </TableCell>

            <TableCell style={{ width: 100 }} align="center"></TableCell>
          </TableRow>

          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => {
            return (
              <TableRow key={row.productId}>
                <TableCell component="th" scope="row">
                  <Link to={`/product/${row.productName}`}>
                    <div>
                      <img width={100} src={row.imgSrc} />
                      <p className="productName" style={{ color: "#0d6efd" }}>
                        {row.productName}
                      </p>
                    </div>
                  </Link>
                </TableCell>
                <TableCell component="th" scope="row">
                  <div className="d-flex price w-100 ">
                    <p className="productPrice mr-2">
                      {parseInt(row.price * (1 - row.sale)).toLocaleString()}
                      <small>₫</small>
                    </p>
                    {row.sale > 0 && (
                      <p className="productPrice  productPrice--sale">
                        {parseInt(row.price).toLocaleString()}
                        <small>₫</small>
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell component="th" scope="row">
                  <div style={{ width: "100%" }}>
                    <div className="d-flex">
                      <div className="d-flex">
                        <button className="quantity__increase d-flex align-items-center">
                          -
                        </button>
                        <div className="quantity__value d-flex align-items-center">
                          {row.quantity}
                        </div>
                        <button className="quantity__decrease d-flex align-items-center">
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell component="th" scope="row">
                  <strong>
                    {parseInt(
                      row.price * (1 - row.sale) * row.quantity
                    ).toLocaleString()}
                  </strong>
                </TableCell>
                <TableCell style={{ width: 100 }} align="center">
                  <Link to={`/`}>
                    <button type="button" className="btn btn-danger">
                      Xóa
                    </button>
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
              colSpan={3}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  "aria-label": "rows per page",
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
