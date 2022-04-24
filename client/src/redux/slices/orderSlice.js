import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authorization } from "../../auth/auth";
import axios from "axios";
export const fetchOrders = createAsyncThunk(
  "order/fetchOrders",
  async (userId) => {
    const orders = await new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/orders/${userId}`,
          authorization()
        );
        resolve(res.data);
      } catch (error) {
        reject(null);
      }
    });

    return orders;
  }
);
export const fetchAllOrders = createAsyncThunk(
  "order/fetchAllOrders",
  async () => {
    const orders = await new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/orders/management`,
          authorization()
        );
        resolve(res.data);
      } catch (error) {
        reject(null);
      }
    });

    return orders;
  }
);
const orderSlice = createSlice({
  name: "orders",
  initialState: {
    loading: false,
    data: null,
    error: null,
  },
  reducers: {},
  extraReducers: {
    [fetchOrders.pending]: (state) => {
      state.loading = true;
    },
    [fetchOrders.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [fetchOrders.fulfilled]: (state, action) => {
      // console.log(action);
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    },
    [fetchAllOrders.pending]: (state) => {
      state.loading = true;
    },
    [fetchAllOrders.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [fetchAllOrders.fulfilled]: (state, action) => {
      // console.log(action);
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    },
  },
});
const { actions, reducer } = orderSlice;
export default reducer;
