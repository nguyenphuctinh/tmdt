import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authorization } from "../../auth/auth";
import axios from "axios";
export const fetchPromotion = createAsyncThunk(
  "promotion/fetchPromotions",
  async () => {
    const promotions = await new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/promotions`,
          authorization()
        );
        resolve(res.data);
      } catch (error) {
        reject(null);
      }
    });
    return promotions;
  }
);
const promotionSlice = createSlice({
  name: "promotions",
  initialState: {
    loading: false,
    data: null,
    error: null,
  },
  reducers: {
    deleteProduct(state, action) {
      const { promotionId, productId } = action.payload;
      const promotion = state.data.find(
        (item) => item.promotionId === promotionId
      );
      const newProducts = promotion.saledProducts.filter(
        (product) => product.productId !== productId
      );
      promotion.saledProducts = newProducts;
    },
    createPromotion(state, action) {
      const { promotion } = action.payload;
      // console.log(promotion);
      state.data.push(promotion);
    },
    deletePromotion(state, action) {
      // console.log(action.payload);
      const { promotionId } = action.payload;
      // console.log(promotionId);
      const newData = state.data.filter(
        (item) => item.promotionId !== parseInt(promotionId)
      );
      console.log(newData);
      state.data = newData;
    },
  },
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
export const { deleteProduct, createPromotion, deletePromotion } =
  promotionSlice.actions;

export default reducer;
