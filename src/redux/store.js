import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./slices/cartSlice.js";
import addressSlice from "./slices/addressSlice.js";
import productsSlice from "./slices/productSlice.js";
import userAuthSlice from "./slices/authSlice.js";
import orderSlice from "./slices/orderSlice.js";
import ratingReviewReducer from "./slices/ratingReviewSlice.js";
import adminAuthSlice from "./adminSlices/authSlice.js";
import adminProductSlice from "./adminSlices/productSlice.js";
import adminOrderSlice from "./adminSlices/orderSlice.js";

export const store = configureStore({
  reducer: {
    auth: userAuthSlice,
    adminAuth: adminAuthSlice,
    products: productsSlice,
    adminProduct: adminProductSlice,
    adminOrder: adminOrderSlice,
    cart: cartSlice,
    address: addressSlice,
    orders: orderSlice,
    ratingReview: ratingReviewReducer,
  }
});
// import { configureStore } from "@reduxjs/toolkit";
// import cartSlice from "./slices/cartSlice.js";
// import addressSlice from "./slices/addressSlice.js";
// import productsSlice from "./slices/productSlice.js";
// import authSlice from "./slices/authSlice.js";
// import orderSlice from "./slices/orderSlice.js";
// import ratingReviewReducer from "./slices/ratingReviewSlice.js";

// export const store = configureStore({
//   reducer: {
//     auth: authSlice,
//     products: productsSlice,
//     cart: cartSlice,
//     address: addressSlice,
//     orders: orderSlice,
//     ratingReview: ratingReviewReducer,
//   }
// });
