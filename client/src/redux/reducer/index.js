import { combineReducers } from "redux";
import userSlice from "../slices/userSlice";
import navbarSlice from "../slices/navbarSlice";
import loadingSlice from "../slices/loadingSlice";
import productSlice from "../slices/productSlice";
const allReducers = combineReducers({
  user: userSlice,
  products: productSlice,
  navbar: navbarSlice,
  loading: loadingSlice,
});
export default allReducers;
