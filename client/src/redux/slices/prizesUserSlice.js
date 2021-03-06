import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authorization } from "../../auth/auth";
import axios from "axios";
export const fetchPrizesUserById = createAsyncThunk(
  "prizesUser/fetchPrizesUserById",
  async (userId) => {
    const prizesUser = await new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/prizesUsers/${userId}`,
          authorization()
        );
        resolve(res.data);
      } catch (error) {
        reject(null);
      }
    });

    return prizesUser;
  }
);
export const fetchPrizesUsers = createAsyncThunk(
  "prizesUser/fetchPrizesUsers",
  async () => {
    const prizesUser = await new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/prizesUsers`,
          authorization()
        );
        resolve(res.data);
      } catch (error) {
        reject(null);
      }
    });

    return prizesUser;
  }
);

const prizesUserSlice = createSlice({
  name: "prizesUser",
  initialState: {
    loading: false,
    data: null,
    error: null,
  },
  reducers: {
    addPrizeUser(state, action) {
      console.log(action.payload);
      state.data = [action.payload, ...state.data];
    },
  },
  extraReducers: {
    [fetchPrizesUserById.pending]: (state) => {
      state.loading = true;
    },
    [fetchPrizesUserById.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [fetchPrizesUserById.fulfilled]: (state, action) => {
      // console.log(action);
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    },
    [fetchPrizesUsers.pending]: (state) => {
      state.loading = true;
    },
    [fetchPrizesUsers.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [fetchPrizesUsers.fulfilled]: (state, action) => {
      // console.log(action);
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    },
  },
});
const { actions, reducer } = prizesUserSlice;
export const { addPrizeUser } = prizesUserSlice.actions;

export default reducer;
