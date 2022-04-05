import React from "react";
import CartTable from "./CartTable";
import { useSelector } from "react-redux";
import OrderForm from "./OrderForm";

export default function Cart() {
  const cart = useSelector((state) => state.cart);

  return (
    <div className="container-fluid cart pb-5">
      <div className="row">
        <h1>Giỏ hàng của bạn</h1>
      </div>
      <div className="row">
        <div className="col-lg-9">
          <CartTable rows={[...cart.data.cartItems]} />
        </div>
        <div className="col-lg-3 pt-5 pt-lg-0 ">
          <OrderForm items={[...cart.data.cartItems]} />
        </div>
      </div>
    </div>
  );
}
