import { Stack, TextField } from "@mui/material";
import { toast } from "react-toastify";
import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import DatePicker from "@mui/lab/DatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";

export default function Info() {
  const user = useSelector((state) => state.user);
  const [firstName, setFirstName] = useState(user.data.firstName);
  const [firstNameError, setFirstNameError] = useState("");
  const [lastName, setLastName] = useState(user.data.lastName);
  const [lastNameError, setLastNameError] = useState("");
  const [phone, setPhone] = useState(user.data.phone);
  const [dob, setDob] = useState(user.data.dob);
  const [address, setAddress] = useState(user.data.address);
  const onHandleClick = () => {
    console.log(firstName, lastName, phone, dob, address);
  };
  return (
    <div className="container updatePw">
      <div className="row">
        <div className="col-12">
          <p className="sessionTitle">
            <span>CẬP NHẬT THÔNG TIN</span>
          </p>
        </div>
        <div className="col-12">
          <TextField
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
            style={{ width: "100%" }}
            label="Số điện thoại"
            variant="outlined"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={3}>
              <DatePicker
                disableFuture
                label="Ngày sinh"
                openTo="year"
                views={["year", "month", "day"]}
                value={dob}
                onChange={(newValue) => {
                  setDob(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </Stack>
          </LocalizationProvider>

          <TextField
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
