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
import PhonePage from "./pages/category/CategoryPage";
import AddProduct from "./pages/admin/product/AddProduct.js";
import Account from "./pages/account/Account";
import ProductAdmin from "./pages/admin/product/ProductAdmin.js";
import { fetchProduct } from "./redux/slices/productSlice.js";
import ProductDetail from "./pages/productDetail/ProductDetail";
import ScrollToTop from "./components/ScrollToTop";
function App() {
  const [rendered, setRendered] = useState(false);
  const dispatch = useDispatch();
  let user = useSelector((state) => state.user);
  useEffect(() => {
    document.title = "TopZone - Cửa hàng Apple chính hãng";
    setRendered(true);
    dispatch(fetchUser());
    dispatch(fetchProduct());
  }, [dispatch]);
  return (
    <>
      {user.loading || !rendered ? (
        <Loading />
      ) : (
        <Router>
          <ScrollToTop />
          <ToastContainer />
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/category/:category" element={<PhonePage />}></Route>
            <Route
              path="/product/:productId"
              element={<ProductDetail />}
            ></Route>
            <Route
              path="/account"
              element={user.username ? <Account /> : <Navigate to="/login" />}
            ></Route>
            <Route
              path="/admin/product/add"
              element={
                user.role === "admin" ? <AddProduct /> : <Navigate to="/" />
              }
            ></Route>
            <Route
              path="/admin/product"
              element={
                user.role === "admin" ? <ProductAdmin /> : <Navigate to="/" />
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
