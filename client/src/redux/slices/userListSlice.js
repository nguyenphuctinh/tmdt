import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authorization } from "../../auth/auth";
import axios from "axios";
export const fetchAllUsers = createAsyncThunk(
  "users/fetchAllUsers",
  async () => {
    const users = await new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/users`,
          authorization()
        );
        resolve(res.data);
      } catch (error) {
        reject(null);
      }
    });
    return users;
  }
);
const userSlice = createSlice({
  name: "users",
  initialState: {
    loading: false,
    data: null,
    error: null,
  },
  reducers: {
    updateUser(state, action) {
      console.log(action.payload);
      const { userId, userState } = action.payload;
      console.log(state.data);
      state.data = state.data.map((user) => {
        if (user.id === userId) {
          user.state = userState;
        }
        return user;
      });
    },
  },
  extraReducers: {
    [fetchAllUsers.pending]: (state) => {
      state.loading = true;
    },
    [fetchAllUsers.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [fetchAllUsers.fulfilled]: (state, action) => {
      // console.log(action);
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    },
  },
});
const { actions, reducer } = userSlice;
export const { updateUser } = actions;

export default reducer;
