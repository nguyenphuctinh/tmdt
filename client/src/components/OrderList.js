import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrders, fetchAllOrders } from "../redux/slices/orderSlice";
import Order from "./Order";
export default function OrderList({ tab, type = "normal" }) {
  const user = useSelector((state) => state.user);
  const order = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(type);
    if (type === "normal") {
      dispatch(fetchOrders(user.data.id));
    } else {
      dispatch(fetchAllOrders());
    }
  }, [user.data]);

  return (
    <div className="container-fluid order p-0">
      {order.data &&
        order.data
          .filter((order) => {
            if (tab.toLowerCase() === "tất cả") {
              return true;
            }
            return order.orderStatus.toLowerCase() === tab.toLowerCase();
          })
          .map((order) => (
            <div key={order.orderId} className="row pb-4">
              <div className="col-12 p-0 ">
                <Order order={order} />
              </div>
            </div>
          ))}
    </div>
  );
}
