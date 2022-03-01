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
      reject(error.response.data);
    }
  });
  // console.log(user);
  return user;
});
const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    username: null,
    error: null,
    role: null,
  },
  reducers: {
    logoutAction(state, action) {
      state.username = null;
      state.role = null;
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
      state.username = action.payload.username;
      state.role = action.payload.role;
      state.error = null;
    },
  },
});
const { actions, reducer } = userSlice;
export const { logoutAction } = actions;
export default reducer;
