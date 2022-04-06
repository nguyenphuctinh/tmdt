import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import InfoOrderForm from "../../components/InfoOrderForm";
export default function OrderForm({ items }) {
  const [infoFormOpened, setInfoFormOpened] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const cart = useSelector((state) => state.cart);
  useEffect(() => {
    setTotalPrice(
      items.reduce((a, b) => {
        return a + b.price * (1 - b.sale) * b.quantity;
      }, 0)
    );
  }, [items]);
  return (
    <div className="container-fluid orderForm p-0">
      {infoFormOpened ? (
        <>
          <div
            onClick={() => setInfoFormOpened(false)}
            style={{
              position: "fixed",
              height: "100vh",
              width: "100vw",
              zIndex: "2",
              left: 0,
              top: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          ></div>
          <div
            style={{
              position: "fixed",
              width: "50%",
              left: "50%",
              overflowY: "auto",
              top: "50%",
              height: "400px",
              transform: "translate(-50%, -50%)",
              zIndex: "3",
            }}
          >
            <InfoOrderForm
              type="orderFromCart"
              productVariants={[...cart.data.cartItems]}
            />
          </div>
        </>
      ) : (
        ""
      )}
      <div className="row w-100 m-0">
        <div className="col-12 p-0 ">
          <p className="quantity">
            {" "}
            Có
            {" " +
              items.reduce((a, b) => {
                return a + b.quantity;
              }, 0) +
              " "}
            sản phẩm trong giỏ hàng
          </p>
          <div className="checkout">
            <div className="d-flex justify-content-between price">
              <p>
                <strong> TỔNG CỘNG: </strong>
              </p>
              <p>
                {" "}
                <strong>
                  {" "}
                  {totalPrice.toLocaleString()}
                  <small>₫</small>
                </strong>
              </p>
            </div>

            <button type="button" className="btn btn-success">
              Dùng phiếu giảm giá
            </button>
            <br />
            <button
              onClick={() => setInfoFormOpened(true)}
              type="button"
              className="btn btn-primary"
            >
              Đặt hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
