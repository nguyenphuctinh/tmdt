import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  const [data, setData] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [updatedUsername, setUpdatedUsername] = useState("");
  const [updatedPassword, setUpdatedPassword] = useState("");
  const [updatedUserID, setUpdatedUserID] = useState(-1);
  const [loading, setLoading] = useState(true);
  async function getUsers() {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER}/user`);
      console.log(response);
      setData(response.data);

      // console.log(data);
    } catch (error) {
      toast(" error");
    } finally {
      setLoading(false);
      console.log(loading);
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
  const deleteUser = (userId) => {
    axios
      .delete(`${process.env.REACT_APP_SERVER}/user/delete/${userId}`)
      .then((res) => {
        toast(res.data);
      })
      .catch((err) => {
        toast(err.response.data);
      });
  };
  const updateUser = (userId) => {
    axios
      .put(`${process.env.REACT_APP_SERVER}/user/update/${updatedUserID}`, {
        username: updatedUsername,
        password: updatedPassword,
      })
      .then((res) => toast(res.data))
      .catch((err) => toast(err.response.data));
  };
  useEffect(() => {
    getUsers();
    console.log(data);
  }, []);
  return loading ? (
    <p>Loading...</p>
  ) : (
    <div className="App">
      <ToastContainer />
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

      <button onClick={login} type="button" className="btn btn-primary">
        submit
      </button>
      {data &&
        data.map((user) => {
          return (
            <div key={user.id}>
              <span>
                {user.username} {user.password}
              </span>
              <button onClick={() => deleteUser(user.id)}>xoa</button>
              <button onClick={() => setUpdatedUserID(user.id)}>sửa</button>
            </div>
          );
        })}
      <input
        onChange={(event) => setUpdatedUsername(event.target.value)}
        value={updatedUsername}
        type="text"
        className="form-control"
        placeholder="usename"
      />

      <input
        onChange={(event) => setUpdatedPassword(event.target.value)}
        value={updatedPassword}
        type="text"
        className="form-control"
        placeholder="pass"
      />
      <button onClick={updateUser} type="button" className="btn btn-primary">
        submit
      </button>
    </div>
  );
}

export default App;
