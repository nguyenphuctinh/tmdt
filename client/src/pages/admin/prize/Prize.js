import { TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { authorization } from "../../../auth/auth";
import {
  addPrize,
  deletePrize,
  fetchPrizes,
} from "../../../redux/slices/prizeSlice";
export default function Prize() {
  const prizes = useSelector((state) => state.prizes);
  const dispatch = useDispatch();
  const [prizeName, setPrizeName] = useState("");
  const handleAddPrize = async () => {
    console.log(prizeName);
    if (!prizeName) return;
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/prizes`,
        { prizeName },
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
  }, []);
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <TextField
            style={{ width: "100%" }}
            required
            label="Tên phần thưởng"
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
          <p> Danh sách phần thưởng</p>
          {prizes.data?.map((prize) => (
            <div key={prize.prizeId}>
              <p>{prize.prizeName}</p>
              <button
                onClick={() => handleDelete(prize.prizeId)}
                type="button"
                className="btn btn-danger"
              >
                xóa
              </button>
            </div>
          ))}
          <p>Danh sách người trúng thưởng</p>
        </div>
      </div>
    </div>
  );
}
