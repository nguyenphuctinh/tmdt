import { combineReducers } from "redux";
import userSlice from "../slices/userSlice";
import navbarSlice from "../slices/navbarSlice";
import loadingSlice from "../slices/loadingSlice";
import productSlice from "../slices/productSlice";
import cartSlice from "../slices/cartSlice";
import promotionSlice from "../slices/promotionSlice";
import orderSlice from "../slices/orderSlice";
import userListSlice from "../slices/userListSlice";
const allReducers = combineReducers({
  user: userSlice,
  products: productSlice,
  navbar: navbarSlice,
  loading: loadingSlice,
  cart: cartSlice,
  promotions: promotionSlice,
  orders: orderSlice,
  users: userListSlice,
});
export default allReducers;
