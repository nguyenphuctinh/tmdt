import React from "react";
import CartTable from "./CartTable";
import { useSelector } from "react-redux";
import OrderForm from "./OrderForm";
import emptyCartImg from "../../assets/images/empty-cart.png";
export default function Cart() {
  const cart = useSelector((state) => state.cart);

  return (
    <div className="container-fluid cart pb-5">
      <div className="row">
        {cart.data.cartItems.length > 0 ? (
          <>
            <div className="col-12">
              <h1>Giỏ hàng của bạn</h1>
            </div>
            <div className="col-lg-9">
              <CartTable
                rows={[...cart.data.cartItems]}
                userId={cart.data.userId}
              />
            </div>
            <div className="col-lg-3 pt-5 pt-lg-0 ">
              <OrderForm items={[...cart.data.cartItems]} />
            </div>
          </>
        ) : (
          <img className="emptyCart" src={emptyCartImg} alt="" />
        )}
      </div>
    </div>
  );
}
