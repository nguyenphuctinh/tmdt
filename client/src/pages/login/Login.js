import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../redux/slices/userSlice";
import { changeNavbar } from "../../redux/slices/navbarSlice";
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const login = (e) => {
    e.preventDefault();
    axios
      .post(`${process.env.REACT_APP_API_URL}/login`, {
        username: username,
        password: password,
      })
      .then(function (response) {
        console.log(response);
        localStorage.setItem(
          "token",
          JSON.stringify(response.data.accessToken)
        );
        // toast(response.data.message);
        dispatch(fetchUser());
      })
      .catch(function (error) {
        console.log(error);
        if (error.response) {
          toast.error(error.response.data.message);
        } else if (error.request) {
          toast(error.request);
        } else {
          toast("Error", error.message);
        }
      });
  };
  if (user.data) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container w-50 pt-1">
      <div className="row ">
        <div className="col-12 ">
          <div className="">
            <form onSubmit={(e) => login(e)} className="">
              <h1>Đăng nhập</h1>
              <input
                onChange={(event) => setUsername(event.target.value)}
                value={username}
                type="text"
                className="form-control"
                placeholder="Tài khoản"
              />
              <br />
              <input
                onChange={(event) => setPassword(event.target.value)}
                value={password}
                type="password"
                className="form-control"
                placeholder="Mật khẩu"
              />
              <br />
              <button type="submit" className="btn btn-primary">
                Đăng nhập
              </button>
              <Link className="text-success" to="/register">
                Đăng ký
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
