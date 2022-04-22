import React from "react";
import OrderList from "../../../components/OrderList";
import Orders from "../../../components/Orders";

export default function OrderAdmin() {
  return (
    <div className="container-fluid">
      <div class="row pt-5 pb-5">
        <div class="col-sm-12 sessionTitle">
          <i class="fab fa-apple"></i> <span>Quản lý đơn hàng</span>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12 ">
          <Orders type="management" />
        </div>
      </div>
    </div>
  );
}
