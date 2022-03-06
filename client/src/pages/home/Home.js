import { useEffect } from "react";
import { useDispatch } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { changeNavbar } from "../../redux/slices/navbarSlice";
function Home() {
  // const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  // const dispatch = useDispatch();
  // const [updatedUsername, setUpdatedUsername] = useState("");
  // const [updatedPassword, setUpdatedPassword] = useState("");
  // const [updatedUserID, setUpdatedUserID] = useState(-1);

  // async function getUsers() {
  //   setLoading(true);
  //   try {
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_API_URL}/api/users`
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
  //     .delete(`${process.env.REACT_APP_API_URL}/api/users/${userId}`)
  //     .then((res) => {
  //       toast(res.data);
  //     })
  //     .catch((err) => {
  //       toast(err.response.data);
  //     });
  // };
  // const updateUser = () => {
  //   axios
  //     .put(`${process.env.REACT_APP_API_URL}/api/users/${updatedUserID}`, {
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
  //         toast(error.response.data);
  //       } else if (error.request) {
  //         toast(error.request);
  //       } else {
  //         toast("Error", error.message);
  //       }
  //     });
  // };

  useEffect(() => {
    dispatch(changeNavbar("home"));
  }, []);
  return (
    <div className="App">
      {user && `xin chao ${user.username}`}

      <h1>HOME</h1>
    </div>
  );
}

export default Home;
