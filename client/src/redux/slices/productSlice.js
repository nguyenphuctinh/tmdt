import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authorization } from "../../auth/auth";
import axios from "axios";
export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (productId) => {
    console.log(productId);
    const product = await new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/products/${productId}`,
          authorization()
        );
        resolve(res.data);
      } catch (error) {
        reject(error.response.data);
      }
    });
    return product;
  }
);
const productSlice = createSlice({
  name: "products",
  initialState: {
    loading: false,
    data: [],
    error: null,
  },
  reducers: {},
  extraReducers: {
    [fetchProductById.pending]: (state) => {
      state.loading = true;
    },
    [fetchProductById.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [fetchProductById.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = [action.payload];
      state.error = null;
    },
  },
});
const { reducer } = productSlice;
export default reducer;
