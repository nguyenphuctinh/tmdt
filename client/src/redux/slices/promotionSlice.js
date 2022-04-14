import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authorization } from "../../auth/auth";
import axios from "axios";
export const fetchPromotion = createAsyncThunk(
  "promotion/fetchPromotion",
  async () => {
    const promotion = await new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/promotions`,
          authorization()
        );
        console.log(res.data);
        resolve(res.data);
      } catch (error) {
        reject(null);
      }
    });

    return promotion;
  }
);
const promotionSlice = createSlice({
  name: "promotion",
  initialState: {
    loading: false,
    data: null,
    error: null,
  },
  reducers: {},
  extraReducers: {
    [fetchPromotion.pending]: (state) => {
      state.loading = true;
    },
    [fetchPromotion.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [fetchPromotion.fulfilled]: (state, action) => {
      // console.log(action);
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    },
  },
});
const { actions, reducer } = promotionSlice;
export default reducer;
