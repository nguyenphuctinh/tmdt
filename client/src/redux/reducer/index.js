import { combineReducers } from "redux";
import userSlice from "../slices/userSlice";
import phoneSlice from "../slices/phoneSlice";
const allReducers = combineReducers({
  user: userSlice,
  phones: phoneSlice,
});
export default allReducers;
