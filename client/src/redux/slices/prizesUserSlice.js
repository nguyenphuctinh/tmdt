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

const prizesUserSlice = createSlice({
  name: "prizesUser",
  initialState: {
    loading: false,
    data: null,
    error: null,
  },
  reducers: {
    addPrizeUser: (state, action) => {
      state.data.push(action.payload);
    },
    deletePrizeUser: (state, action) => {
      //   state.data = state.data.filter(
      //     (prize) => prize.prizeId !== action.payload
      //   );
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
  },
});
const { actions, reducer } = prizesUserSlice;
export const { addPrize, deletePrize } = prizesUserSlice.actions;

export default reducer;
