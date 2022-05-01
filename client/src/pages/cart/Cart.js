import React, { useEffect } from "react";
import ProductTable from "../../components/ProductTable";
import { useSelector, useDispatch } from "react-redux";
import OrderForm from "./OrderForm";
import emptyCartImg from "../../assets/images/empty-cart.png";
import { changeNavbar } from "../../redux/slices/navbarSlice";
export default function Cart() {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(changeNavbar("others"));
    document.title = "Giỏ hàng";
  }, []);
  return (
    <div className="container-fluid cart pb-5">
      <div className="row">
        {cart.data.cartItems.length > 0 ? (
          <>
            <div className="col-12">
              <h1>Giỏ hàng của bạn</h1>
            </div>
            <div className="col-lg-9">
              <ProductTable
                type="cart"
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
