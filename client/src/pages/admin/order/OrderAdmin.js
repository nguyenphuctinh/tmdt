import React from "react";
import OrderList from "../../../components/OrderList";
import Orders from "../../../components/Orders";

export default function OrderAdmin() {
  return (
    <div className="container-fluid">
      <div className="row pt-5 pb-5">
        <div className="col-sm-12 sessionTitle">
          <i className="fab fa-apple"></i> <span>Quản lý đơn hàng</span>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12 ">
          <Orders type="management" />
        </div>
      </div>
    </div>
  );
}
