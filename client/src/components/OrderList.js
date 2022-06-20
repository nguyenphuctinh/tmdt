import { Pagination } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrders, fetchAllOrders } from "../redux/slices/orderSlice";
import Order from "./Order";
export default function OrderList({ tab, type = "normal" }) {
  const user = useSelector((state) => state.user);
  const orders = useSelector((state) => state.orders);
  const dispatch = useDispatch();
  const [page, setPage] = React.useState(1);
  const [filterdOrders, setFilterdOrders] = useState([]);
  const handleChange = (event, value) => {
    setPage(value);
  };
  useEffect(() => {
    if (type === "normal") {
      dispatch(fetchOrders(user.data?.id));
    } else {
      dispatch(fetchAllOrders());
    }
  }, [user.data]);
  useEffect(() => {
    setFilterdOrders(
      orders.data?.filter((order) => {
        if (tab.toLowerCase() === "tất cả") {
          return true;
        }
        return order.orderStatus.toLowerCase() === tab.toLowerCase();
      })
    );
  }, [tab, orders.data]);
  return (
    <div className="container-fluid order p-0">
      {filterdOrders.length !== 0
        ? filterdOrders.slice((page - 1) * 3, page * 3).map((order) => (
            <div key={order.orderId} className="row pb-4">
              <div className="col-12 p-0 ">
                <Order type={type} order={order} />
              </div>
            </div>
          ))
        : "Không có đơn hàng nào"}
      <div className="row">
        <div className="col-12 d-flex justify-content-center p-4">
          {filterdOrders.length !== 0 ? (
            <Pagination
              count={Math.ceil(filterdOrders.length / 3)}
              page={page}
              onChange={handleChange}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}
