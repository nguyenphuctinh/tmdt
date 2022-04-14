import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrders, fetchAllOrders } from "../../redux/slices/orderSlice";
import ProductTable from "../../components/ProductTable";
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
            console.log(order.orderStatus, tab);
            if (tab.toLowerCase() === "tất cả") {
              return true;
            }
            return order.orderStatus.toLowerCase() === tab.toLowerCase();
          })
          .map((order) => (
            <div key={order.orderId} className="row pb-4">
              <div className="col-12 p-0 ">
                <h5>
                  Đơn hàng ngày{" "}
                  {new Date(order.orderDate).getDate() +
                    "-" +
                    new Date(order.orderDate).getMonth() +
                    "-" +
                    new Date(order.orderDate).getFullYear()}
                </h5>
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
              </div>
            </div>
          ))}
    </div>
  );
}
const setTotalPrice = (items) => {
  return items.reduce((a, b) => {
    return a + b.price * (1 - b.sale) * b.quantity;
  }, 0);
};
