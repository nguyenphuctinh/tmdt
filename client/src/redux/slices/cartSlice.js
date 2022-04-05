import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { authorization } from "../../auth/auth";

export const fetchCart = createAsyncThunk("carts/fetchCart", async (userId) => {
  console.log(userId);
  const carts = await new Promise(async (resolve, reject) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/carts/${userId}`
      );
      resolve(res.data);
    } catch (error) {
      console.log(error.response);
      reject({
        userId: null,
        cartItems: [],
      });
    }
  });
  console.log(carts, "cart");
  return carts;
});
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    loading: false,
    data: {
      userId: null,
      cartItems: [],
    },
    error: null,
  },
  reducers: {},
  extraReducers: {
    [fetchCart.pending]: (state) => {
      state.loading = true;
    },
    [fetchCart.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [fetchCart.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    },
  },
});
const { reducer } = cartSlice;
// export const {  } = cartSlice.actions;

export default reducer;
