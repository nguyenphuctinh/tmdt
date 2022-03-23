import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authorization } from "../../auth/auth";
import axios from "axios";
export const fetchUser = createAsyncThunk("user/fecthUser", async () => {
  const user = await new Promise(async (resolve, reject) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/auth`,
        authorization()
      );
      console.log(res.data);
      resolve(res.data);
    } catch (error) {
      reject(null);
    }
  });
  // console.log(user);
  return user;
});
const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    data: null,
    error: null,
  },
  reducers: {
    logoutAction(state, action) {
      state.data = null;
    },
  },
  extraReducers: {
    [fetchUser.pending]: (state) => {
      state.loading = true;
    },
    [fetchUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [fetchUser.fulfilled]: (state, action) => {
      // console.log(action);
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    },
  },
});
const { actions, reducer } = userSlice;
export const { logoutAction } = actions;
export default reducer;
