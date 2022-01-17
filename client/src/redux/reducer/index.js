import { combineReducers } from "redux";
import userSlice from "../slices/userSlice";

const allReducers = combineReducers({
  user: userSlice,
});
export default allReducers;
