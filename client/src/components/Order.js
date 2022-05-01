import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductTable from "../components/ProductTable";
import { authorization } from "../auth/auth";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import capitalizeFirstLetter from "../helpers/capitalizeFirstLetter";

export default function Order({ order, type }) {
  const [orderState, setOrderState] = useState(
    capitalizeFirstLetter(order.orderStatus)
  );
  const handleUpdateOrderState = async (value, orderId) => {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/orders/${orderId}`,
        {
          status: value,
        },
        authorization()
      );
      if (value === "Đã giao") {
        console.log(order);
        const res = await axios.put(
          `${process.env.REACT_APP_API_URL}/api/users/${order.user.userId}`,
          {
            type: "updatePoints",
            points: order.user.points + setTotalPrice(order.orderItems) / 50000,
          },
          authorization()
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="d-flex justify-content-between">
        <h5>
          Đơn hàng ngày{" "}
          {new Date(order.orderDate).getDate() +
            "-" +
            (new Date(order.orderDate).getMonth() + 1) +
            "-" +
            new Date(order.orderDate).getFullYear()}
        </h5>

        <div>
          {type === "management" ? (
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Trạng thái</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={orderState}
                label="Thể loại"
                onChange={(e) => {
                  handleUpdateOrderState(e.target.value, order.orderId);
                  setOrderState(e.target.value);
                }}
              >
                <MenuItem value="Chờ xác nhận">Chờ xác nhận</MenuItem>
                <MenuItem value="Chờ lấy hàng">Chờ lấy hàng</MenuItem>
                <MenuItem value="Đang giao">Đang giao</MenuItem>
                <MenuItem value="Đã giao">Đã giao</MenuItem>
                <MenuItem value="Từ chối">Từ chối</MenuItem>
              </Select>
            </FormControl>
          ) : (
            <div>{orderState}</div>
          )}
        </div>
      </div>
      {type === "management" ? (
        <p>
          {"TTKH: " +
            order.user.firstName +
            " " +
            order.user.lastName +
            ", " +
            order.user.phone +
            ", " +
            new Date(order.user.dob).toISOString().split("T")[0] +
            ", " +
            order.user.address}
        </p>
      ) : (
        ""
      )}
      <ProductTable type="order" rows={[...order.orderItems]} />
      <div className="d-flex justify-content-between price">
        <p>
          <strong> TỔNG CỘNG: </strong>
        </p>
        <p>
          {" "}
          <strong>
            {" "}
            {setTotalPrice(order.orderItems).toLocaleString()}
            <small>₫</small>
          </strong>
        </p>
      </div>
    </>
  );
}
const setTotalPrice = (items) => {
  return items.reduce((a, b) => {
    return a + b.price * (1 - b.sale) * b.quantity;
  }, 0);
};
