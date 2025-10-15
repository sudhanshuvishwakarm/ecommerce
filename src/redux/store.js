import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./slices/cartSlice.js";
import addressSlice from "./slices/addressSlice.js";
import productsSlice from "./slices/productSlice.js";
import authSlice from "./slices/authSlice.js";
import orderSlice from "./slices/orderSlice.js";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    products: productsSlice,
    cart: cartSlice,
    address: addressSlice,
    orders: orderSlice,
  }
});