import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import InfoOrderForm from "../../components/InfoOrderForm";
import { fetchPrizesUserById } from "../../redux/slices/prizesUserSlice";
export default function OrderForm({ items }) {
  const [infoFormOpened, setInfoFormOpened] = useState(false);
  const prizesUser = useSelector((state) => state.prizesUser);
  const user = useSelector((state) => state.user);
  const [coupons, setCoupons] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discount, setDiscount] = useState(false);
  const cart = useSelector((state) => state.cart);
  useEffect(() => {
    setTotalPrice(
      items.reduce((a, b) => {
        return a + b.price * (1 - b.sale) * b.quantity;
      }, 0)
    );
  }, [items]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user.data) dispatch(fetchPrizesUserById(user.data.id));
  }, []);
  const handleChangeCoupons = (e) => {
    console.log(e.target.value);
    setCoupons(e.target.value);
  };
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
            className="orderFormContainer"
            style={{
              position: "fixed",
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
              totalPrice={totalPrice}
              coupons={coupons}
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
            C??
            {" " +
              items.reduce((a, b) => {
                return a + b.quantity;
              }, 0) +
              " "}
            s???n ph???m trong gi??? h??ng
          </p>
          <div className="checkout">
            <div className="d-flex justify-content-between price">
              <p>
                <strong> T???NG C???NG: </strong>
              </p>
              <p>
                {" "}
                <strong>
                  {" "}
                  {totalPrice.toLocaleString()}
                  <small>???</small>
                </strong>
              </p>
            </div>

            <div className="d-flex justify-content-between price">
              <p>
                <strong> Chi???t kh???u: </strong>
              </p>
              <p>
                {" "}
                <strong> {`${coupons * 100}%`}</strong>
              </p>
            </div>
            <div className="d-flex justify-content-between price">
              <p>
                <strong> C??n l???i: </strong>
              </p>
              <p>
                <strong>
                  {(totalPrice * (1 - coupons)).toLocaleString()}??
                </strong>
              </p>
            </div>

            {user.data ? (
              <button
                onClick={() => {
                  if (
                    prizesUser.data.filter(
                      (item) =>
                        item.prizeType === "discount" &&
                        item.state === "ch??a s??? d???ng"
                    ).length === 0
                  ) {
                    toast.error("B???n kh??ng c?? phi???u gi???m gi?? n??o");
                  } else {
                    setDiscount(true);
                  }
                }}
                type="button"
                className="btn btn-success"
              >
                D??ng phi???u gi???m gi??
              </button>
            ) : (
              ""
            )}
            {discount ? (
              <FormControl>
                <RadioGroup
                  onChange={handleChangeCoupons}
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="coupons"
                  name="radio-buttons-group"
                >
                  {[
                    ...new Set(
                      prizesUser.data
                        .filter(
                          (item) =>
                            item.prizeType === "discount" &&
                            item.state === "ch??a s??? d???ng"
                        )
                        .map((item) => {
                          return item.prizeName;
                        })
                    ),
                  ].map((item) => {
                    return (
                      <FormControlLabel
                        key={item}
                        value={item}
                        control={<Radio />}
                        label={`Phi???u gi???m gi?? ${item * 100}%`}
                      />
                    );
                  })}
                </RadioGroup>
              </FormControl>
            ) : (
              ""
            )}

            <br />
            <button
              onClick={() => setInfoFormOpened(true)}
              type="button"
              className="btn btn-primary"
            >
              ?????t h??ng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
