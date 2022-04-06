import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { authorization } from "../../auth/auth";

export const fetchCart = createAsyncThunk("carts/fetchCart", async (userId) => {
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
  reducers: {
    increaseQuantity: (state, action) => {
      const { productVariantId, quantity } = action.payload;
      const cartItems = state.data.cartItems.map((item) => {
        if (item.productVariantId === productVariantId) {
          return {
            ...item,
            quantity: quantity + 1,
          };
        }
        return item;
      });
      state.data.cartItems = cartItems;
    },
    decreaseQuantity: (state, action) => {
      const { productVariantId, quantity } = action.payload;
      if (quantity === 1) return;
      const cartItems = state.data.cartItems.map((item) => {
        if (item.productVariantId === productVariantId) {
          return {
            ...item,
            quantity: quantity - 1,
          };
        }
        return item;
      });
      state.data.cartItems = cartItems;
    },
    removeItem: (state, action) => {
      console.log(action.payload);
      const { productVariantId } = action.payload;
      const cartItems = state.data.cartItems.filter((item) => {
        console.log(item.productVariantId, productVariantId);
        return item.productVariantId !== productVariantId;
      });
      state.data.cartItems = cartItems;
    },
  },
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
export const { increaseQuantity, decreaseQuantity, removeItem } =
  cartSlice.actions;

export default reducer;
