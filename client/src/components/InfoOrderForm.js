import { Stack, TextField } from "@mui/material";
import { toast } from "react-toastify";
import React, { useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import DatePicker from "@mui/lab/DatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { authorization } from "../auth/auth";
import { removeAllItems } from "../redux/slices/cartSlice";
import isNumber from "../helpers/isNumber";
import isPhoneNumber from "../helpers/isPhoneNumber";

export default function InfoOrderForm({
  productVariants,
  type = "buyNow",
  coupons = 0,
  totalPrice,
}) {
  const user = useSelector((state) => state.user);
  const prizesUser = useSelector((state) => state.prizesUser);
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState(user.data?.firstName || "");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastName, setLastName] = useState(user.data?.lastName || "");
  const [lastNameError, setLastNameError] = useState("");
  const [phone, setPhone] = useState(user.data?.phone || "");
  const [phoneError, setPhoneError] = useState("");
  const [dob, setDob] = useState(
    (user.data && new Date(user.data.dob)) || null
  );
  const [dobError, setDobError] = useState("");
  const [address, setAddress] = useState(user.data?.address || "");
  const [addressError, setAddressError] = useState("");
  const onHandleClick = async () => {
    console.log(firstNameError, lastNameError, dobError);
    if (
      !firstName ||
      !lastName ||
      dobError !== "" ||
      !phone ||
      !isNumber(phone) ||
      !address ||
      !isPhoneNumber(phone)
    ) {
      toast.error("Vui lòng nhập đầy đủ và chính xác thông tin");
      return;
    }
    let userId = user.data?.id;
    try {
      if (!user.data) {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/users`,
          {
            firstName,
            lastName,
            phone,
            dob:
              dob.getFullYear() +
              "-" +
              (dob.getMonth() + 1) +
              "-" +
              dob.getDate(),
            address,
            type: "anonymous",
          }
        );
        userId = res.data.userId;
      } else {
        const res = await axios.put(
          `${process.env.REACT_APP_API_URL}/api/users/${user.data.id}`,
          {
            firstName,
            lastName,
            phone,
            dob:
              dob.getFullYear() +
              "-" +
              (dob.getMonth() + 1) +
              "-" +
              dob.getDate(),
            address,
            type: "updateInfo",
          },
          authorization()
        );
      }
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/orders`,
        {
          productVariants,
          coupons,
          userId,
        }
      );

      if (type === "orderFromCart") {
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/api/carts/${userId}`
        );
        if (coupons) {
          const tmpPUId = prizesUser.data.find(
            (item) =>
              item.prizeName === coupons && item.state === "chưa sử dụng"
          ).prizeUserId;
          console.log(tmpPUId);
          await axios.put(
            `${process.env.REACT_APP_API_URL}/api/prizesUsers/${tmpPUId}`,
            {
              state: "đã sử dụng",
            },
            authorization()
          );
        }
        dispatch(removeAllItems());
      }

      toast.success("Đặt hàng thành công!");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="container infoForm">
      <div className="row">
        <div className="col-12">
          <p className="sessionTitle">
            <span>THÔNG TIN ĐẶT HÀNG</span>
          </p>
        </div>
        <div className="col-12">
          <TextField
            sx={{ mb: 2 }}
            required
            error={firstNameError === "" ? false : true}
            style={{ width: "100%" }}
            label="Tên"
            variant="outlined"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            helperText={firstNameError}
            onBlur={() => {
              if (firstName.length === 0)
                setFirstNameError("Không được để trống");
              else setFirstNameError("");
            }}
          />
          <TextField
            sx={{ mb: 2 }}
            style={{ width: "100%" }}
            label="Họ"
            variant="outlined"
            required
            error={lastNameError === "" ? false : true}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            helperText={lastNameError}
            onBlur={() => {
              if (lastName.length === 0)
                setLastNameError("Không được để trống");
              else setLastNameError("");
            }}
          />
          <TextField
            sx={{ mb: 2 }}
            required
            error={phoneError === "" ? false : true}
            onBlur={() => {
              if (!isPhoneNumber(phone)) {
                setPhoneError("Số điện thoại không hợp lệ");
              } else setPhoneError("");
            }}
            style={{ width: "100%" }}
            label="Số điện thoại"
            variant="outlined"
            helperText={phoneError}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <LocalizationProvider sx={{ mb: 2 }} dateAdapter={AdapterDateFns}>
            <Stack spacing={3}>
              <DatePicker
                disableFuture
                label="Ngày sinh"
                openTo="year"
                views={["year", "month", "day"]}
                value={dob}
                onChange={(newValue) => {
                  if (
                    newValue === null ||
                    newValue.toString() === "Invalid Date"
                  ) {
                    setDobError("Ngày sinh không hợp lệ");
                  } else {
                    setDob(newValue);
                    setDobError("");
                  }
                }}
                renderInput={(params) => {
                  return <TextField required {...params} />;
                }}
              />
            </Stack>
          </LocalizationProvider>

          <TextField
            sx={{ mb: 2 }}
            required
            error={addressError === "" ? false : true}
            helperText={addressError}
            style={{ width: "100%" }}
            label="Địa chỉ"
            variant="outlined"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onBlur={() => {
              if (address.length === 0) setAddressError("Không được để trống");
              else setAddressError("");
            }}
          />
        </div>
        <button onClick={onHandleClick} type="button" class="btn btn-primary">
          Đặt hàng
        </button>
      </div>
    </div>
  );
}
