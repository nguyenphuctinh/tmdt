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
import Loading from "./components/Loading";
import PhonePage from "./pages/category/CategoryPage";
import AddProduct from "./pages/admin/product/AddProduct.js";
import Account from "./pages/account/Account";
import ProductAdmin from "./pages/admin/product/ProductAdmin.js";
import { fetchProduct } from "./redux/slices/productSlice.js";
import ProductDetail from "./pages/productDetail/ProductDetail";
import ScrollToTop from "./components/ScrollToTop";
import UpdateProduct from "./pages/admin/product/UpdateProduct";
import Search from "./pages/search/Search";
import { fetchUser } from "./redux/slices/userSlice";
import { fetchCart } from "./redux/slices/cartSlice";
import Cart from "./pages/cart/Cart";
function App() {
  const [rendered, setRendered] = useState(false);
  const dispatch = useDispatch();
  let user = useSelector((state) => state.user);
  let loading = useSelector((state) => state.loading);
  const products = useSelector((state) => state.products);
  console.log(user);
  useEffect(() => {
    document.title = "TopZone - Cửa hàng Apple chính hãng";
    setRendered(true);
    dispatch(fetchProduct());
    dispatch(fetchUser());
  }, [dispatch]);
  useEffect(() => {
    console.log("fetch cart");
    if (user.data) {
      dispatch(fetchCart(user.data.id));
    }
  }, [user]);
  return (
    <>
      {user.loading || products.loading || !rendered ? (
        <Loading />
      ) : (
        <Router>
          <ScrollToTop />
          <ToastContainer />
          <NavBar />
          {loading.value ? <Loading /> : ""}
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/category/:category" element={<PhonePage />}></Route>
            <Route path="/search" element={<Search />}></Route>
            <Route
              path="/product/:productName"
              element={<ProductDetail />}
            ></Route>
            <Route
              path="/account"
              element={user.data ? <Account /> : <Navigate to="/login" />}
            ></Route>
            <Route path="/cart" element={<Cart />}></Route>
            <Route
              path="/admin/product/add"
              element={
                user.data && user.data.role === "admin" ? (
                  <AddProduct />
                ) : (
                  <Navigate to="/" />
                )
              }
            ></Route>
            <Route
              path="/admin/product/update/:productId"
              element={
                user.data && user.data.role === "admin" ? (
                  <UpdateProduct />
                ) : (
                  <Navigate to="/" />
                )
              }
            ></Route>
            <Route
              path="/admin/product"
              element={
                user.data && user.data.role === "admin" ? (
                  <ProductAdmin />
                ) : (
                  <Navigate to="/" />
                )
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
