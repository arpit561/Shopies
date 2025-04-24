// customerSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  customers: [],
  customerDetails: null,
  loading: false,
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setCustomers(state, action) {
      state.customers = action.payload;
    },
    setCustomerDetails(state, action) {
      state.customerDetails = action.payload;
    },
    setCustomerLoading(state, action) {
      state.loading = action.payload;
    },
    resetCustomerDetails(state) {
      state.customerDetails = null;
    },
  },
});

export const {
  setCustomers,
  setCustomerDetails,
  setCustomerLoading,
  resetCustomerDetails,
} = customerSlice.actions;

export default customerSlice.reducer;
