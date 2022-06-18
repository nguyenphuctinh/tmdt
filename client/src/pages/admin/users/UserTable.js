import * as React from "react";
import axios from "axios";
import { useDispatch } from "react-redux";

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
import { authorization } from "../../../auth/auth";
import { updateUser } from "../../../redux/slices/userListSlice";
import { generateEntityId } from "../../../helpers/generateId";
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

export default function UserTable({ rows, type }) {
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
  const dispatch = useDispatch();
  const handleChangeState = async (val, userId) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/management/${userId}`,
        {
          state: val,
        },
        authorization()
      );
      dispatch(updateUser({ userId, userState: val }));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        <TableBody>
          <TableRow>
            <TableCell component="th" scope="row">
              Mã
            </TableCell>
            <TableCell component="th" scope="row">
              Tên
            </TableCell>
            <TableCell component="th" scope="row">
              Họ
            </TableCell>
            <TableCell component="th" scope="row">
              Năm sinh
            </TableCell>
            <TableCell component="th" scope="row">
              Số điện thoại
            </TableCell>
            <TableCell component="th" scope="row">
              Địa chỉ
            </TableCell>
            <TableCell component="th" scope="row">
              Điểm tích lũy
            </TableCell>
            <TableCell style={{ width: 100 }} align="center"></TableCell>
          </TableRow>

          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => {
            return (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  <span>{generateEntityId("U", row.id)}</span>
                </TableCell>
                <TableCell component="th" scope="row">
                  <span>{row.firstName}</span>
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.lastName}
                </TableCell>
                <TableCell component="th" scope="row">
                  {new Date(row.dob).toISOString().split("T")[0]}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.phone}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.address}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.points}
                </TableCell>
                <TableCell style={{ width: 100 }} align="center">
                  <button
                    onClick={() => {
                      if (row.state === "active") {
                        handleChangeState("locked", row.id);
                      } else {
                        handleChangeState("active", row.id);
                      }
                    }}
                    type="button"
                    className={`btn ${
                      row.state === "active" ? "btn-success" : "btn-danger"
                    }`}
                  >
                    {row.state}
                  </button>
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
