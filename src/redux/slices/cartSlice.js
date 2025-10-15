import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/cart');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk for updating quantity
export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async ({ cartItemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.put('/api/cart', {
        cartItemId,
        quantity
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk for removing item
export const removeCartItem = createAsyncThunk(
  'cart/removeItem',
  async (cartItemId, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/cart?cartItemId=${cartItemId}`);
      return cartItemId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  cartItems: [],
  cartData: {
    totalPrice: 0,
    totalItem: 0,
    totalDiscountPrice: 0,
    discounte: 0
  },
  loading: false,
  error: null,
  updatingItems: []
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.cartData = {
        totalPrice: 0,
        totalItem: 0,
        totalDiscountPrice: 0,
        discounte: 0
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.cart && action.payload.cart.cartItems) {
          state.cartData = action.payload.cart;

          state.cartItems = action.payload.cart.cartItems.map(item => ({
            id: item._id,
            productId: item.product?._id,
            name: item.product?.title || 'Product',
            image: item.product?.imageUrl || '/placeholder.jpg',
            size: item.size,
            color: item.product?.color || 'Default',
            brand: item.product?.brand || 'Brand',
            price: item.discountedPrice,
            originalPrice: item.price,
            discount: item.price > 0 ? Math.round(((item.price - item.discountedPrice) / item.price) * 100) : 0,
            quantity: item.quantity
          }));
        } else {
          state.cartItems = [];
          state.cartData = {
            totalPrice: 0,
            totalItem: 0,
            totalDiscountPrice: 0,
            discounte: 0
          };
        }
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.cartItems = [];
        state.cartData = {
          totalPrice: 0,
          totalItem: 0,
          totalDiscountPrice: 0,
          discounte: 0
        };
      })

      // Update Quantity
      .addCase(updateCartItemQuantity.pending, (state, action) => {
        const cartItemId = action.meta.arg.cartItemId;
        if (!state.updatingItems.includes(cartItemId)) {
          state.updatingItems.push(cartItemId);
        }
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        const cartItemId = action.meta.arg.cartItemId;
        state.updatingItems = state.updatingItems.filter(id => id !== cartItemId);

        // Update local state with new data
        if (action.payload.cart) {
          state.cartData = action.payload.cart;
          state.cartItems = state.cartItems.map(item =>
            item.id === cartItemId
              ? { ...item, quantity: action.meta.arg.quantity }
              : item
          );
        }
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        const cartItemId = action.meta.arg.cartItemId;
        state.updatingItems = state.updatingItems.filter(id => id !== cartItemId);
        state.error = action.payload;
      })

      // Remove Item
      .addCase(removeCartItem.pending, (state, action) => {
        const cartItemId = action.meta.arg;
        if (!state.updatingItems.includes(cartItemId)) {
          state.updatingItems.push(cartItemId);
        }
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        const cartItemId = action.payload;
        state.updatingItems = state.updatingItems.filter(id => id !== cartItemId);
        state.cartItems = state.cartItems.filter(item => item.id !== cartItemId);

        // Update cart data (you might want to refetch cart here)
        state.cartData.totalItem -= 1;
        // Note: For accurate totals, you might want to call fetchCart again
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        const cartItemId = action.meta.arg;
        state.updatingItems = state.updatingItems.filter(id => id !== cartItemId);
        state.error = action.payload;
      });
  }
});

export const { clearError, clearCart } = cartSlice.actions;
export default cartSlice.reducer;