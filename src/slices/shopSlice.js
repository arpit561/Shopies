import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  myShop: [],
  shops: [],
  loading: false,
};

const shopSlice = createSlice({
  name: "shop",
  initialState: initialState,
  reducers: {
    setMyShop(state, action) {
      state.myShop = action.payload;
    },
    setAllShops(state, action) {
      state.shops = action.payload;
    },
    setShopLoading(state, action) {
      state.loading = action.payload;
    },
    clearShop(state) {
      state.myShop = null;
      state.shops = [];
    },
  },
});

export const { setMyShop, setAllShops, setShopLoading, clearShop } = shopSlice.actions;

export default shopSlice.reducer;
