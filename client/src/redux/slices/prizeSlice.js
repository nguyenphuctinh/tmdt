import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authorization } from "../../auth/auth";
import axios from "axios";
export const fetchPrizes = createAsyncThunk("prize/fetchPrizes", async () => {
  const prizes = await new Promise(async (resolve, reject) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/prizes`,
        authorization()
      );
      resolve(res.data);
    } catch (error) {
      reject(null);
    }
  });

  return prizes;
});

const prizeSlice = createSlice({
  name: "prizes",
  initialState: {
    loading: false,
    data: null,
    error: null,
  },
  reducers: {
    addPrize: (state, action) => {
      state.data.push(action.payload);
    },
    deletePrize: (state, action) => {
      state.data = state.data.filter(
        (prize) => prize.prizeId !== action.payload
      );
    },
  },
  extraReducers: {
    [fetchPrizes.pending]: (state) => {
      state.loading = true;
    },
    [fetchPrizes.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [fetchPrizes.fulfilled]: (state, action) => {
      // console.log(action);
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    },
  },
});
const { actions, reducer } = prizeSlice;
export const { addPrize, deletePrize } = prizeSlice.actions;

export default reducer;
