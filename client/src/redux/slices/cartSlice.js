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
      localStorage.setItem("cart", JSON.stringify([...cartItems]));
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
      localStorage.setItem("cart", JSON.stringify([...cartItems]));
    },
    removeItem: (state, action) => {
      console.log(action.payload);
      const { productVariantId } = action.payload;
      const cartItems = state.data.cartItems.filter((item) => {
        console.log(item.productVariantId, productVariantId);
        return item.productVariantId !== productVariantId;
      });
      state.data.cartItems = cartItems;
      localStorage.setItem("cart", JSON.stringify([...cartItems]));
    },
    addItem: (state, action) => {
      const {
        productVariantId,
        quantity,
        productName,
        sale,
        price,
        imgSrc,
        variantValues,
      } = action.payload;
      console.log(variantValues);
      let isProductVariantExist = false;
      state.data.cartItems.forEach((cartItem) => {
        if (cartItem.productVariantId === productVariantId) {
          isProductVariantExist = true;
          return;
        }
      });
      if (isProductVariantExist) {
        const cartItems = state.data.cartItems.map((item) => {
          if (item.productVariantId === productVariantId) {
            return {
              ...item,
              quantity: item.quantity + quantity,
            };
          }
          return item;
        });
        state.data.cartItems = cartItems;
      } else {
        const cartItems = [
          {
            productVariantId,
            quantity,
            productName,
            sale,
            price,
            imgSrc,
            variantValues: [...variantValues],
          },
          ...state.data.cartItems,
        ];

        state.data.cartItems = [...cartItems];
      }
      localStorage.setItem("cart", JSON.stringify([...state.data.cartItems]));
    },
    removeAllItems: (state, action) => {
      state.data.cartItems = [];
      localStorage.setItem("cart", JSON.stringify([]));
    },
    setCart: (state, action) => {
      state.data.cartItems = [...action.payload];
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
export const {
  increaseQuantity,
  decreaseQuantity,
  removeItem,
  addItem,
  setCart,
  removeAllItems,
} = cartSlice.actions;

export default reducer;
