import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  BrowserRouter as Router,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Home from "./pages/home/Home";
import NavBar from "./components/NavBar";
import NotFound from "./pages/notfound/NotFound";
import { ToastContainer } from "react-toastify";
import { fetchUser } from "./redux/slices/userSlice";
import Loading from "./components/Loading";
import PhoneList from "./pages/phone/PhoneList";
import PhoneAdmin from "./pages/admin/PhoneAdmin/PhoneAdmin.js";

function App() {
  const [rendered, setRendered] = useState(false);
  const dispatch = useDispatch();
  let user = useSelector((state) => state.user);
  useEffect(() => {
    setRendered(true);
    dispatch(fetchUser());
    // const fetchData = async () => {
    //   try {
    //     unwrapResult(await dispatch(fetchUser()));
    //   } catch (error) {
    //     toast(error.message);
    //   }
    // };
    // fetchData();
  }, [dispatch]);
  return (
    <>
      {user.loading || !rendered ? (
        <Loading />
      ) : (
        <Router>
          <ToastContainer />
          <NavBar />
          <Routes>
            <Route
              path="/"
              element={user.username ? <Home /> : <Navigate to="/login" />}
            ></Route>
            <Route path="/phone" element={<PhoneList />}></Route>
            <Route
              path="/admin/phone"
              element={
                user.role === "admin" ? <PhoneAdmin /> : <Navigate to="/" />
              }
            ></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/*" element={<NotFound />}></Route>
          </Routes>
        </Router>
      )}
    </>
  );
}

export default App;
