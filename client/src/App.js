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
import AddPhone from "./pages/admin/PhoneAdmin/AddPhone.js";
import Account from "./pages/account/Account";
import PhoneAdmin from "./pages/admin/PhoneAdmin/PhoneAdmin.js";
import { fetchPhone } from "./redux/slices/phoneSlice.js";
import ProductDetail from "./pages/productDetail/ProductDetail";
function App() {
  const [rendered, setRendered] = useState(false);
  const dispatch = useDispatch();
  let user = useSelector((state) => state.user);
  useEffect(() => {
    setRendered(true);
    dispatch(fetchUser());
    dispatch(fetchPhone());
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
            <Route path="/" element={<Home />}></Route>
            <Route path="/iphone" element={<PhoneList />}></Route>
            <Route
              path="/iphone/:productId"
              element={<ProductDetail />}
            ></Route>
            <Route
              path="/account"
              element={user.username ? <Account /> : <Navigate to="/login" />}
            ></Route>
            <Route
              path="/admin/phone/add"
              element={
                user.role === "admin" ? <AddPhone /> : <Navigate to="/" />
              }
            ></Route>
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
