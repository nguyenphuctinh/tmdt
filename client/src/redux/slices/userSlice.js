import { createSlice } from "@reduxjs/toolkit";
import { authorization } from "../../auth/auth";
import axios from "axios";
const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    username: null,
  },
  reducers: {
    loginAction(state, action) {
      state.loading = false;
      state.username = action.payload;
    },
    logoutAction(state, action) {
      state.username = null;
    },
    userLoaded(state, action) {
      state.loading = false;
      state.username = action.payload;
    },
    userLoading(state, action) {
      state.loading = true;
    },
  },
});
const { actions, reducer } = userSlice;
export const { loginAction, logoutAction, userLoaded, userLoading } = actions;
export default reducer;
export const fetchUser = () => async (dispatch) => {
  dispatch(userLoading());
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_SERVER}/auth`,
      authorization()
    );
    dispatch(userLoaded(res.data));
  } catch (error) {
    console.log(error);
    dispatch(userLoaded(null));
  }
};
