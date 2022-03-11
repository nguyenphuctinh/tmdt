import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProduct = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const products = await new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/products`
        );
        resolve(res.data);
      } catch (error) {
        console.log(error.response);
        reject([]);
      }
    });
    return products;
  }
);
const productSlice = createSlice({
  name: "products",
  initialState: {
    loading: false,
    data: [],
    error: null,
  },
  reducers: {
    deleteProduct: (state, action) => {
      const newData = state.data.filter(
        (product) => product.productId !== action.payload
      );
      state.data = [...newData];
    },
  },
  extraReducers: {
    [fetchProduct.pending]: (state) => {
      state.loading = true;
    },
    [fetchProduct.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [fetchProduct.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    },
  },
});
const { reducer } = productSlice;
export const { deleteProduct } = productSlice.actions;

export default reducer;
