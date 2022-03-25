import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { TextField } from "@mui/material";
export default function Register() {
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const insertAUser = async () => {
    if (usernameError || passwordError || firstNameError || lastNameError) {
      return;
    }
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users`,
        {
          username,
          password,
          firstName,
          lastName,
        }
      );
      setFirstName("");
      setLastName("");
      setUsername("");
      setPassword("");

      toast.success(res.data);
    } catch (error) {
      console.log(error);
      if (error.response) {
        toast.error(error.response.data);
      } else if (error.request) {
        toast(error.request);
      } else {
        toast("Error", error.message);
      }
    }
  };
  return (
    <div className="container w-50">
      <div className="row">
        <div className="col-12">
          <ToastContainer /> <h1>Đăng ký</h1>
          <TextField
            required
            error={usernameError === "" ? false : true}
            style={{ width: "100%" }}
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            helperText={usernameError}
            onBlur={() => {
              if (username.length === 0)
                setUsernameError("Không được để trống");
              else setUsernameError("");
            }}
          />
          <TextField
            style={{ width: "100%" }}
            label="Mật khẩu"
            variant="outlined"
            type={"password"}
            required
            error={passwordError === "" ? false : true}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helperText={passwordError}
            onBlur={() => {
              if (password.length === 0)
                setPasswordError("Không được để trống");
              else setPasswordError("");
            }}
          />
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
          <button
            onClick={insertAUser}
            type="button"
            className="btn btn-primary"
          >
            Đăng ký
          </button>
          <Link className="text-success" to="/login">
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}
