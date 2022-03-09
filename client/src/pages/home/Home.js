import { useEffect } from "react";
import { useDispatch } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { changeNavbar } from "../../redux/slices/navbarSlice";
import PhoneList from "../category/ProductList";
function Home() {
  // const [data, setData] = useState([]);
  const dispatch = useDispatch();
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
  }, [dispatch]);
  return (
    <div className="App">
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12 policies padding-lg">
            <div className="row policies ">
              <div className="col-6 col-sm-3 padding-0">
                <div className="policy d-flex align-items-center">
                  <div style={{ width: "100%" }}>
                    <i className="far fa-check-circle"></i>
                    <p> Mẫu mã đa dạng, chính hãng.</p>
                  </div>
                </div>
              </div>
              <div className="col-6  col-sm-3  padding-0">
                <div className="policy d-flex align-items-center">
                  <div style={{ width: "100%" }}>
                    <i className="fal fa-shipping-fast"></i>
                    <p>Giao hàng toàn quốc.</p>
                  </div>
                </div>
              </div>
              <div className="col-6 col-sm-3 padding-0 ">
                <div className="policy d-flex align-items-center">
                  <div style={{ width: "100%" }}>
                    <i className="fal fa-shield"></i>
                    <p>Bảo hành tới 36 tháng.</p>
                  </div>
                </div>
              </div>
              <div className="col-6 col-sm-3 padding-0 ">
                <div className="policy d-flex align-items-center">
                  <div style={{ width: "100%" }}>
                    <i className="fal fa-undo"></i>
                    <p>
                      Có thể đổi trả tại <br />
                      Thegioididong và DienmayXanh
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PhoneList category={"phone"} />
      <PhoneList category={"laptop"} />
      <PhoneList category={"tablet"} />
      <PhoneList category={"watch"} />
    </div>
  );
}

export default Home;
