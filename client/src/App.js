import logo from "./logo.svg";
import "./App.css";
import { react, useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  const [data, setData] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function getUsers() {
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER}/user`);
      console.log(response);
      setData(response.data);

      // console.log(data);
    } catch (error) {
      toast(" error");

      console.error(error);
    }
  }
  function login() {
    axios
      .post(`${process.env.REACT_APP_SERVER}/login`, {
        username: username,
        password: password,
      })
      .then(function (response) {
        console.log(response);
        toast(response.data);
      })
      .catch(function (error) {
        toast(error);
        if (error.response) {
          // Request made and server responded
          toast(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          toast(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          toast("Error", error.message);
        }
      });
  }
  useEffect(() => {
    getUsers();
    console.log(data);
  }, []);
  return (
    <div className="App">
      <ToastContainer />
      <input
        onChange={(event) => setUsername(event.target.value)}
        value={username}
        type="text"
        class="form-control"
        placeholder="usename"
      />

      <input
        onChange={(event) => setPassword(event.target.value)}
        value={password}
        type="text"
        class="form-control"
        placeholder="pass"
      />

      <button onClick={login} type="button" class="btn btn-primary">
        submet
      </button>
      {data &&
        data.map((user, index) => {
          return (
            <p key={index}>
              {user.username} {user.password}
            </p>
          );
        })}
    </div>
  );
}

export default App;
