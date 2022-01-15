import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginAction } from "../redux/action";
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  function login() {
    axios
      .post(`${process.env.REACT_APP_SERVER}/login`, {
        username: username,
        password: password,
      })
      .then(function (response) {
        console.log(response);
        localStorage.setItem("auth", JSON.stringify(response.data.accessToken));
        toast(response.data.message);
        dispatch(loginAction(username));
      })
      .catch(function (error) {
        // toast(error);
        if (error.response) {
          // Request made and server responded
          toast(error.response.data);
          // console.log(error.response.status);
          // console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          toast(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          toast("Error", error.message);
        }
      });
  }
  if (user.username) {
    console.log(user);
    return <Navigate to="/" />;
  }
  return (
    <div>
      <h1>Đăng nhập</h1>
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
      <button onClick={() => login()} type="button" className="btn btn-primary">
        submit
      </button>
    </div>
  );
}
