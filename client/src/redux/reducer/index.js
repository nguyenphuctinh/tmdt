import { combineReducers } from "redux";
import userSlice from "../slices/userSlice";
import phoneSlice from "../slices/phoneSlice";
import productSlice from "../slices/productSlice";
const allReducers = combineReducers({
  user: userSlice,
  phones: phoneSlice,
  products: productSlice,
});
export default allReducers;
