import { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
function Home() {
  // const [data, setData] = useState([]);
  const user = useSelector((state) => state.user);
  // const dispatch = useDispatch();
  // const [updatedUsername, setUpdatedUsername] = useState("");
  // const [updatedPassword, setUpdatedPassword] = useState("");
  // const [updatedUserID, setUpdatedUserID] = useState(-1);

  // async function getUsers() {
  //   setLoading(true);
  //   try {
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_SERVER}/api/users`
  //     );
  //     console.log(response);
  //     setData(response.data);

  //     // console.log(data);
  //   } catch (error) {
  //     toast(" error");
  //   } finally {
  //     setLoading(false);
  //     console.log(loading);
  //   }
  // }

  // const deleteUser = (userId) => {
  //   axios
  //     .delete(`${process.env.REACT_APP_SERVER}/api/users/${userId}`)
  //     .then((res) => {
  //       toast(res.data);
  //     })
  //     .catch((err) => {
  //       toast(err.response.data);
  //     });
  // };
  // const updateUser = () => {
  //   axios
  //     .put(`${process.env.REACT_APP_SERVER}/api/users/${updatedUserID}`, {
  //       username: updatedUsername,
  //       password: updatedPassword,
  //     })
  //     .then((res) => {
  //       toast(res.data);
  //       let tmp = [...data];
  //       tmp.forEach((user) => {
  //         if (user.id === updatedUserID) {
  //           user.username = updatedUsername;
  //           user.password = updatedPassword;
  //         }
  //       });
  //       // setData(tmp);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       if (error.response) {
  //         // Request made and server responded
  //         toast(error.response.data);
  //         // console.log(error.response.status);
  //         // console.log(error.response.headers);
  //       } else if (error.request) {
  //         // The request was made but no response was received
  //         toast(error.request);
  //       } else {
  //         // Something happened in setting up the request that triggered an Error
  //         toast("Error", error.message);
  //       }
  //     });
  // };

  useEffect(() => {
    // console.log(data);
  }, []);
  return (
    <div className="App">
      {user && `xin chao ${user.username}`}
      {/* {data &&
        data.map((user) => {
          return (
            <div key={user.id}>
              <span>
                {user.username} {user.password}
              </span>
              <button onClick={() => deleteUser(user.id)}>xoa</button>
              <button
                onClick={() => {
                  setUpdatedUserID(user.id);
                  setUpdatedUsername(user.username);
                }}
              >
                sửa
              </button>
            </div>
          );
        })} */}
      {/* <input
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
      /> */}
      {/* <button onClick={updateUser} type="button" className="btn btn-primary">
        submit
      </button> */}

      <h1>HOME</h1>
    </div>
  );
}

export default Home;
