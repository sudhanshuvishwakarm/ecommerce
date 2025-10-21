import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./slices/cartSlice.js";
import addressSlice from "./slices/addressSlice.js";
import productsSlice from "./slices/productSlice.js";
import authSlice from "./slices/authSlice.js";
import orderSlice from "./slices/orderSlice.js";
import ratingReviewReducer from "./slices/ratingReviewSlice.js";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    products: productsSlice,
    cart: cartSlice,
    address: addressSlice,
    orders: orderSlice,
    ratingReview: ratingReviewReducer,
  }
});
// import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "./slices/authSlice.js";
// import orderReducer from "./slices/orderSlice.js";
// import cartReducer from "./slices/cartSlice.js";
// // Import other reducers as needed

// const store = configureStore({
//     reducer: {
//         auth: authReducer,
//         orders: orderReducer,
//         ratingReview: ratingReviewReducer,
//         cart: cartReducer,
//         // Add other reducers here
//     }
// });

// export default store;