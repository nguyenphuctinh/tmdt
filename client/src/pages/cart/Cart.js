import React from "react";
import CartTable from "./CartTable";
import { useSelector } from "react-redux";

export default function Cart() {
  const cart = useSelector((state) => state.cart);

  return (
    <div className="container-fluid cart">
      <div className="row">
        <div className="col-sm-9">
          <h1>Giỏ hàng của bạn</h1>
          <CartTable rows={[...cart.data.cartItems]} />
        </div>
      </div>
    </div>
  );
}
