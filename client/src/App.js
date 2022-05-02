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
import CategoryPage from "./pages/category/CategoryPage";
import AddProduct from "./pages/admin/product/AddProduct.js";
import Account from "./pages/account/Account";
import ProductAdmin from "./pages/admin/product/ProductAdmin.js";
import { fetchProduct } from "./redux/slices/productSlice.js";
import ProductDetail from "./pages/productDetail/ProductDetail";
import ScrollToTop from "./components/ScrollToTop";
import UpdateProduct from "./pages/admin/product/UpdateProduct";
import Search from "./pages/search/Search";
import { fetchUser } from "./redux/slices/userSlice";
import { fetchCart, setCart } from "./redux/slices/cartSlice";
import Cart from "./pages/cart/Cart";
import { fetchPromotion } from "./redux/slices/promotionSlice";
import OrderAdmin from "./pages/admin/order/OrderAdmin";
import AddPromotion from "./pages/admin/promotion/AddPromotion";
import PromotionDetail from "./pages/promotion/PromotionDetail";
import Admin from "./pages/admin/main/Admin";
import UpdatePromotion from "./pages/admin/promotion/UpdatePromotion";
function App() {
  const [rendered, setRendered] = useState(false);
  const dispatch = useDispatch();
  let user = useSelector((state) => state.user);
  let loading = useSelector((state) => state.loading);
  const products = useSelector((state) => state.products);
  useEffect(() => {
    document.title =
      " Cửa hàng điện thoại, máy tính, máy tính bảng, đồng hô chính hãng";

    setRendered(true);
    dispatch(fetchProduct());
    dispatch(fetchUser());
    dispatch(fetchPromotion());
  }, [dispatch]);
  useEffect(() => {
    if (user.data) {
      dispatch(fetchCart(user.data.id));
    } else {
      let cart = JSON.parse(localStorage.getItem("cart"));
      if (!cart) {
        dispatch(setCart([]));
      } else {
        dispatch(setCart([...cart]));
      }
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
            <Route
              path="/"
              element={
                !user.data || user.data.role !== "admin" ? (
                  <Home />
                ) : (
                  <Navigate to="/admin?tab=product" />
                )
              }
            ></Route>
            <Route
              path="/category/:category"
              element={
                !user.data || user.data.role !== "admin" ? (
                  <CategoryPage />
                ) : (
                  <Navigate to="/admin?tab=product" />
                )
              }
            ></Route>
            <Route
              path="/search"
              element={
                !user.data || user.data.role !== "admin" ? (
                  <Search />
                ) : (
                  <Navigate to="/admin?tab=product" />
                )
              }
            ></Route>
            <Route
              path="/product/:productName"
              element={
                !user.data || user.data.role !== "admin" ? (
                  <ProductDetail />
                ) : (
                  <Navigate to="/admin?tab=product" />
                )
              }
            ></Route>
            <Route
              path="/account"
              element={user.data ? <Account /> : <Navigate to="/login" />}
            ></Route>
            <Route
              path="/cart"
              element={
                !user.data || user.data.role !== "admin" ? (
                  <Cart />
                ) : (
                  <Navigate to="/admin?tab=product" />
                )
              }
            ></Route>
            <Route
              path="/admin"
              element={
                user.data && user.data.role === "admin" ? (
                  <Admin />
                ) : (
                  <Navigate to="/" />
                )
              }
            ></Route>
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
              path="/admin/promotion/add"
              element={
                user.data && user.data.role === "admin" ? (
                  <AddPromotion />
                ) : (
                  <Navigate to="/" />
                )
              }
            ></Route>
            <Route
              path="/admin/promotion/update/:promotionId"
              element={
                user.data && user.data.role === "admin" ? (
                  <UpdatePromotion />
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
            <Route
              path="/admin/order"
              element={
                user.data && user.data.role === "admin" ? (
                  <OrderAdmin />
                ) : (
                  <Navigate to="/" />
                )
              }
            ></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route
              path="/promotion/:promotionId"
              element={<PromotionDetail />}
            ></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/*" element={<NotFound />}></Route>
          </Routes>
        </Router>
      )}
    </>
  );
}

export default App;
