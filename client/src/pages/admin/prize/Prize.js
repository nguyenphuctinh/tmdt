import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { authorization } from "../../../auth/auth";
import {
  addPrize,
  deletePrize,
  fetchPrizes,
} from "../../../redux/slices/prizeSlice";
import {
  fetchPrizesUserById,
  fetchPrizesUsers,
} from "../../../redux/slices/prizesUserSlice";
import { generateEntityId, generateUserId } from "../../../helpers/generateId";
import { toast } from "react-toastify";
export default function Prize() {
  const prizes = useSelector((state) => state.prizes);
  const prizesUser = useSelector((state) => state.prizesUser);
  const dispatch = useDispatch();
  const [type, setType] = useState("discount");
  const [prizeName, setPrizeName] = useState("");
  const handleAddPrize = async () => {
    console.log(prizeName);
    if (!prizeName) return;
    if (type === "discount" && (prizeName < 0 || prizeName > 1)) {
      toast.error("Giá trị khuyến mãi phải nằm trong khoảng 0 - 1");
      return;
    }
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/prizes`,
        { prizeName, type },
        authorization()
      );
      dispatch(addPrize(res.data));
      setPrizeName("");
    } catch (error) {}
  };
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/prizes/${id}`,
        authorization()
      );
      dispatch(deletePrize(id));
    } catch (error) {}
  };
  useEffect(() => {
    dispatch(fetchPrizes());
    dispatch(fetchPrizesUsers());
  }, []);

  const handleUpdateState = () => {};
  return (
    <div className="container-fluid pt-2">
      <div className="row">
        <div className="col-12">
          <p>Thêm phần thưởng</p>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Thể loại</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={type}
              label="Thể loại"
              onChange={(e) => {
                setType(e.target.value);
                // handleUpdateState(e.target.value, prizeUser.prizeId);
              }}
            >
              <MenuItem value="discount">Phiếu giảm giá</MenuItem>
              <MenuItem value="betterLuckNextTime">May mắn lần sau</MenuItem>
              <MenuItem value="others">Khác</MenuItem>
            </Select>
          </FormControl>
          <TextField
            style={{ width: "100%" }}
            required
            label="Giá trị"
            variant="outlined"
            value={prizeName}
            onChange={(e) => setPrizeName(e.target.value)}
          />
          <button
            onClick={(e) => handleAddPrize(e)}
            type="button"
            className="btn btn-primary"
          >
            Thêm phần thưởng
          </button>
          <hr />
          <p className="text-center"> Danh sách phần thưởng</p>
          <table class="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Tên phần thưởng</th>
                <th scope="col">Xóa</th>
              </tr>
            </thead>
            <tbody>
              {prizes.data?.map((prize) => (
                <tr key={prize.prizeId}>
                  <th scope="row">{generateEntityId("PZ", prize.prizeId)}</th>
                  <td>
                    {prize.prizeType === "discount"
                      ? `Phiếu giảm giá ${prize.prizeName * 100}%`
                      : prize.prizeName}
                  </td>
                  <td>
                    {" "}
                    <button
                      onClick={() => handleDelete(prize.prizeId)}
                      type="button"
                      className="btn btn-danger"
                    >
                      xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="text-center">Danh sách người trúng thưởng</p>
          <table class="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Mã người trúng</th>
                <th scope="col">Tên phần thưởng</th>
                <th scope="col">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {prizesUser.data?.map((prizeUser) => (
                <tr key={prizeUser.prizeUserId}>
                  <th scope="row">
                    {generateEntityId("PU", prizeUser.prizeId)}
                  </th>
                  <td>{generateEntityId("U", prizeUser.userId)}</td>
                  <td>
                    {" "}
                    {prizeUser.prizeType === "discount"
                      ? `Phiếu giảm giá ${prizeUser.prizeName * 100}%`
                      : prizeUser.prizeName}
                  </td>
                  <td>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Trạng thái
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={prizeUser.state}
                        label="Thể loại"
                        onChange={(e) => {
                          handleUpdateState(e.target.value, prizeUser.prizeId);
                        }}
                      >
                        <MenuItem value="chờ xử lý">Chờ xử lý</MenuItem>
                        <MenuItem value="đang giao">Đang giao</MenuItem>
                        <MenuItem value="đã giao">Đã giao</MenuItem>
                      </Select>
                    </FormControl>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
