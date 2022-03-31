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

export default function MyTable({
  rows,
  type,
  category,
  onHandleDelete,
  setUpdateFromOpened,
  setProductVariantUpdated,
}) {
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
          {type === "variant" || type === "updateVariant" ? (
            <TableRow>
              <TableCell style={{ width: 160 }} align="center">
                Màu sắc
              </TableCell>
              <TableCell style={{ width: 160 }} align="center">
                {category !== "watch" ? "Dung lượng" : "Kích thước"}
              </TableCell>
              <TableCell style={{ width: 160 }} align="center">
                Số lượng
              </TableCell>
              <TableCell style={{ width: 160 }} align="center">
                Giá
              </TableCell>
              <TableCell style={{ width: 50 }} align="center">
                Cập nhật
              </TableCell>
            </TableRow>
          ) : (
            <TableRow>
              <TableCell component="th" scope="row">
                Tên sản phẩm
              </TableCell>
              <TableCell component="th" scope="row">
                Sale
              </TableCell>

              <TableCell style={{ width: 100 }} align="center"></TableCell>
            </TableRow>
          )}
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => {
            if (type === "variant" || type === "updateVariant") {
              return (
                <TableRow key={row.id || row.productVariantId}>
                  <TableCell style={{ width: 160 }} align="center">
                    {row.color}
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="center">
                    {category === "watch" ? row.size : row.capacity}
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="center">
                    {row.quantity}
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="center">
                    {row.price}
                  </TableCell>
                  <TableCell style={{ width: 50 }} align="center">
                    <button
                      onClick={() => {
                        setUpdateFromOpened(true);
                        setProductVariantUpdated(row);
                      }}
                      type="button"
                      className="btn btn-primary"
                    >
                      Chỉnh sửa
                    </button>
                  </TableCell>
                </TableRow>
              );
            }
            if (type === "product") {
              return (
                <TableRow key={row.productId}>
                  <TableCell component="th" scope="row">
                    <Link to={`/product/${row.productName}`}>
                      <span style={{ color: "#0d6efd" }}>
                        {row.productName}
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.sale}
                  </TableCell>
                  <TableCell style={{ width: 100 }} align="center">
                    <Link to={`/admin/product/update/${row.productId}`}>
                      <button type="button" className="btn btn-primary">
                        Chỉnh sửa
                      </button>
                    </Link>
                  </TableCell>
                </TableRow>
              );
            } else {
              return "";
            }
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
