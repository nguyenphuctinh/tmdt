import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const insertAUser = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users`,
        {
          username: username,
          password: password,
        }
      );
      toast(res.data);
    } catch (error) {
      console.log(error);
      if (error.response) {
        toast(error.response.data);
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
          <input
            onChange={(event) => setUsername(event.target.value)}
            value={username}
            type="text"
            className="form-control"
            placeholder="usename"
          />
          <input
            onChange={(event) => setPassword(event.target.value)}
            value={password}
            type="text"
            className="form-control"
            placeholder="pass"
          />
          <button
            onClick={insertAUser}
            type="button"
            className="btn btn-primary"
          >
            Đăng ký
          </button>
          <a href="/login">Đăng nhập</a>
        </div>
      </div>
    </div>
  );
}