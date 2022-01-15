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
        `${process.env.REACT_APP_SERVER}/api/users`,
        {
          username: username,
          password: password,
        }
      );
      toast(res.data);
    } catch (error) {
      console.log(error);
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
    }
  };
  return (
    <div>
      <ToastContainer /> <h1>Đăng kys</h1>
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
      <button onClick={insertAUser} type="button" className="btn btn-primary">
        submit
      </button>
    </div>
  );
}
