import logo from "./logo.svg";
import "./App.css";
import { react, useEffect, useState } from "react";
import axios from "axios";
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
      console.error(error);
    }
  }
  function insertUser() {
    axios
      .post(`${process.env.REACT_APP_SERVER}/user/insert`, {
        username: username,
        password: password,
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  useEffect(() => {
    getUsers();
    console.log(data);
  }, []);
  return (
    <div className="App">
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

      <button onClick={insertUser} type="button" class="btn btn-primary">
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
