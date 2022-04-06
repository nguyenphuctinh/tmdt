import { Slider } from "@mui/material";
import React, { useState, useEffect } from "react";
export default function OrderForm({ items }) {
  const [totalPrice, setTotalPrice] = useState(0);
  useEffect(() => {
    setTotalPrice(
      items.reduce((a, b) => {
        return a + b.price * (1 - b.sale) * b.quantity;
      }, 0)
    );
  }, [items]);
  return (
    <div className="container-fluid orderForm p-0">
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
            <button type="button" className="btn btn-primary">
              Đặt hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
