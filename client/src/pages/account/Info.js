import { Stack, TextField } from "@mui/material";
import { toast } from "react-toastify";
import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import DatePicker from "@mui/lab/DatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { authorization } from "../../auth/auth";
import isPhoneNumber from "../../helpers/isPhoneNumber";

export default function Info() {
  const user = useSelector((state) => state.user);
  const [firstName, setFirstName] = useState(user.data.firstName);
  const [firstNameError, setFirstNameError] = useState("");
  const [lastName, setLastName] = useState(user.data.lastName);
  const [lastNameError, setLastNameError] = useState("");
  const [phone, setPhone] = useState(user.data.phone || "");
  const [dob, setDob] = useState(new Date(user.data.dob));
  const [dobError, setDobError] = useState("");
  const [address, setAddress] = useState(user.data.address || "");
  const onHandleClick = async () => {
    console.log(firstNameError, lastNameError, dobError);
    if (!firstName || !lastName || dobError !== "") {
      toast.error("Vui lòng nhập đầy đủ và chính xác thông tin");
      return;
    }
    if (phone && !isPhoneNumber(phone)) {
      toast.error("Số điện thoại không hợp lệ");
      return;
    }
    console.log(firstName, lastName, phone, typeof dob, address);
    try {
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
      toast.success("Cập nhật thành công!");
    } catch (error) {
      console.log(error);
      toast.error("Cập nhật thất bại!");
    }
  };
  return (
    <div className="container updateInfo">
      <div className="row">
        <div className="col-12">
          <p className="sessionTitle">
            <span>CẬP NHẬT THÔNG TIN</span>
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
            style={{ width: "100%" }}
            label="Số điện thoại"
            variant="outlined"
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
                    console.log("invalid");
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
            style={{ width: "100%" }}
            label="Địa chỉ"
            variant="outlined"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <button onClick={onHandleClick} type="button" class="btn btn-primary">
          Lưu
        </button>
      </div>
    </div>
  );
}
