import { combineReducers } from "redux";
import userSlice from "../slices/userSlice";
import navbarSlice from "../slices/navbarSlice";
import loadingSlice from "../slices/loadingSlice";
import productSlice from "../slices/productSlice";
import cartSlice from "../slices/cartSlice";
import promotionSlice from "../slices/promotionSlice";
import orderSlice from "../slices/orderSlice";
const allReducers = combineReducers({
  user: userSlice,
  products: productSlice,
  navbar: navbarSlice,
  loading: loadingSlice,
  cart: cartSlice,
  promotions: promotionSlice,
  order: orderSlice,
});
export default allReducers;
